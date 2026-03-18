import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { extractText } from "unpdf";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
    const extractedText = text?.trim();

    if (!extractedText || extractedText.length < 100) {
      return NextResponse.json({ error: "Could not extract text from PDF. Make sure it's not a scanned image." }, { status: 400 });
    }

    // Save document to DB
    const userId = (session.user as any).id;
    const document = await prisma.document.create({
      data: {
        userId,
        title: file.name.replace(".pdf", ""),
        type: "PDF",
        content: extractedText.slice(0, 50000), // limit to 50k chars
        tags: [],
      },
    });

    return NextResponse.json({
      success: true,
      documentId: document.id,
      title: document.title,
      wordCount: extractedText.split(" ").length,
      preview: extractedText.slice(0, 300),
    });

  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}