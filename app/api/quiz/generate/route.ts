import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { documentId, difficulty = "MEDIUM", questionCount = 5 } = await req.json();

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const content = document.content.slice(0, 8000);

    const prompt = `You are a quiz generator. Based on the following text, generate exactly ${questionCount} multiple choice questions.

Difficulty: ${difficulty}

Text:
${content}

Return ONLY a valid JSON array with this exact structure, no extra text, no markdown:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

correctAnswer is the index (0-3) of the correct option.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    let questions;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      questions = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse quiz questions" }, { status: 500 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        documentId,
        title: `Quiz: ${document.title}`,
        difficulty: difficulty as any,
        questions,
      },
    });

    return NextResponse.json({ success: true, quizId: quiz.id, questions });

  } catch (error: any) {
    console.error("Quiz generate error:", error);
    return NextResponse.json({ error: "Something went wrong: " + error.message }, { status: 500 });
  }
}