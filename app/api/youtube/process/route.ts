import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { YoutubeTranscript } from "youtube-transcript";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/live\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    // Get transcript
    let transcript;
    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      transcript = transcriptData.map((t) => t.text).join(" ");
    } catch {
      return NextResponse.json(
        {
          error:
            "Could not get transcript. Make sure the video has captions/subtitles enabled.",
        },
        { status: 400 },
      );
    }

    if (!transcript || transcript.length < 100) {
      return NextResponse.json(
        {
          error: "Transcript too short or empty.",
        },
        { status: 400 },
      );
    }

    // Save to DB
    const userId = (session.user as any).id;
    const document = await prisma.document.create({
      data: {
        userId,
        title: `YouTube: ${videoId}`,
        type: "YOUTUBE",
        youtubeUrl: url,
        content: transcript.slice(0, 50000),
        tags: [],
      },
    });

    return NextResponse.json({
      success: true,
      documentId: document.id,
      title: document.title,
      wordCount: transcript.split(" ").length,
      preview: transcript.slice(0, 300),
    });
  } catch (error: any) {
    console.error("YouTube process error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error.message },
      { status: 500 },
    );
  }
}
