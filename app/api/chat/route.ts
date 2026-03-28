import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { message, chatHistory } = await req.json();
    const userId = (session.user as any).id;

    // Only fetch docs if user is asking about their materials
    const askingAboutDocs =
      /pdf|document|video|youtube|upload|material|note/i.test(message);
    let docsContext = "";

    if (askingAboutDocs) {
      const documents = await prisma.document.findMany({
        where: { userId },
        select: { title: true, content: true, type: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      });
      if (documents.length > 0) {
        docsContext =
          `\n\nUSER'S STUDY MATERIALS:\n` +
          documents
            .map((d) => `[${d.type}] ${d.title}:\n${d.content.slice(0, 2000)}`)
            .join("\n\n---\n\n");
      }
    }

    const systemPrompt = `You are Tessera AI, a powerful AI assistant like ChatGPT. You can:
- Answer any general knowledge question
- Solve math problems step by step
- Help with coding, science, history, geography, etc.
- Explain any concept clearly
${docsContext}

Always respond in English. Be helpful, clear and concise.`;

    const history = (chatHistory || []).slice(-10).map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply =
      response.choices[0].message.content ||
      "Sorry, I could not generate a response.";
    return NextResponse.json({ response: reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error.message },
      { status: 500 },
    );
  }
}
