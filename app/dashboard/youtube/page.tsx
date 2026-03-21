"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function YouTubePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const isValidYouTubeUrl = (url: string) => {
    return (
      url.includes("youtube.com/watch") ||
      url.includes("youtu.be/") ||
      url.includes("youtube.com/live")
    );
  };

  const handleProcess = async () => {
    if (!url) return setError("Please enter a YouTube URL.");
    if (!isValidYouTubeUrl(url))
      return setError("Please enter a valid YouTube URL.");

    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/youtube/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      setResult(data);
    } catch {
      setError("Failed to process video. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!result?.documentId) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: result.documentId,
          difficulty: "MEDIUM",
          questionCount: 5,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      router.push(`/dashboard/quiz/${data.quizId}`);
    } catch {
      setError("Quiz generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Extract video ID for thumbnail
  const getVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    );
    return match ? match[1] : null;
  };

  return (
    <div style={{ fontFamily: "DM Sans, sans-serif", maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            color: "#F0F4FF",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          YouTube Integration
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Paste any YouTube video URL and Tessera will extract the transcript
          and generate a quiz.
        </p>
      </div>

      {/* URL Input */}
      {!result && (
        <div
          style={{
            background: "#0D1526",
            border: "1px solid #1e2a45",
            borderRadius: 16,
            padding: 28,
            marginBottom: 16,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                color: "#94A3C4",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              YouTube URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#060912",
                border: "1px solid #1e2a45",
                borderRadius: 8,
                color: "#F0F4FF",
                fontSize: 14,
                fontFamily: "DM Sans, sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleProcess()}
            />
          </div>

          {/* Example URLs */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "#3D4F72", fontSize: 12, marginBottom: 8 }}>
              Works with:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["youtube.com/watch?v=...", "youtu.be/..."].map((ex) => (
                <span
                  key={ex}
                  style={{
                    background: "#161D30",
                    border: "1px solid #1e2a45",
                    borderRadius: 6,
                    padding: "4px 10px",
                    color: "#64748b",
                    fontSize: 12,
                  }}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={processing || !url}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 10,
              background:
                processing || !url
                  ? "#1e2a45"
                  : "linear-gradient(135deg,#FF4D6D,#FF8C42)",
              color: processing || !url ? "#64748b" : "#fff",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "DM Sans, sans-serif",
              cursor: processing || !url ? "not-allowed" : "pointer",
            }}
          >
            {processing ? "Extracting transcript..." : "▶️ Process Video →"}
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            background: "rgba(255,77,109,0.1)",
            border: "1px solid rgba(255,77,109,0.3)",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
            color: "#FF4D6D",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          style={{
            background: "#0D1526",
            border: "1px solid rgba(16,217,138,0.3)",
            borderRadius: 16,
            padding: 28,
            marginBottom: 20,
          }}
        >
          {/* Thumbnail */}
          {getVideoId(url) && (
            <div
              style={{ marginBottom: 20, borderRadius: 10, overflow: "hidden" }}
            >
              <img
                src={`https://img.youtube.com/vi/${getVideoId(url)}/hqdefault.jpg`}
                alt="Video thumbnail"
                style={{ width: "100%", borderRadius: 10 }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 24 }}>✅</span>
            <div>
              <div style={{ color: "#10D98A", fontSize: 15, fontWeight: 700 }}>
                Transcript Extracted!
              </div>
              <div style={{ color: "#64748b", fontSize: 13 }}>
                {result.wordCount} words extracted
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#060912",
              borderRadius: 8,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                color: "#3D4F72",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Transcript Preview
            </div>
            <div style={{ color: "#94A3C4", fontSize: 13, lineHeight: 1.6 }}>
              {result.preview}...
            </div>
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={generating}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 10,
              background: generating
                ? "#1e2a45"
                : "linear-gradient(135deg,#2A6FDB,#00D4FF)",
              color: generating ? "#64748b" : "#fff",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "DM Sans, sans-serif",
              cursor: generating ? "not-allowed" : "pointer",
            }}
          >
            {generating ? "Generating quiz with AI..." : "🎯 Generate Quiz →"}
          </button>
        </div>
      )}

      {result && (
        <button
          onClick={() => {
            setUrl("");
            setResult(null);
            setError("");
          }}
          style={{
            background: "transparent",
            border: "1px solid #1e2a45",
            color: "#64748b",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Try another video
        </button>
      )}
    </div>
  );
}
