"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") return setError("Only PDF files allowed.");
    if (f.size > 10 * 1024 * 1024) return setError("File too large. Max 10MB.");
    setError("");
    setFile(f);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const res = await fetch("/api/pdf/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      setUploadResult(data);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!uploadResult?.documentId) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: uploadResult.documentId, difficulty: "MEDIUM", questionCount: 5 }),
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

  return (
    <div style={{ fontFamily: "DM Sans, sans-serif", maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: "#F0F4FF", fontSize: 24, fontWeight: 700,
          letterSpacing: "-0.02em", marginBottom: 4 }}>Upload PDF</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Upload any PDF and Tessera will generate a quiz from it instantly.
        </p>
      </div>

      {/* Drop Zone */}
      {!uploadResult && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false);
            const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          style={{ border: `2px dashed ${dragOver ? "#2A6FDB" : file ? "#10D98A" : "#1e2a45"}`,
            borderRadius: 16, padding: "48px 32px", textAlign: "center",
            cursor: "pointer", transition: "all 0.2s", marginBottom: 16,
            background: dragOver ? "rgba(42,111,219,0.05)" : "#0D1526" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{file ? "📄" : "⬆️"}</div>
          {file ? (
            <>
              <div style={{ color: "#10D98A", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {file.name}
              </div>
              <div style={{ color: "#64748b", fontSize: 13 }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </>
          ) : (
            <>
              <div style={{ color: "#F0F4FF", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                Drop your PDF here
              </div>
              <div style={{ color: "#64748b", fontSize: 13 }}>
                or click to browse — Max 10MB
              </div>
            </>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            style={{ display: "none" }} />
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)",
          borderRadius: 8, padding: "10px 14px", marginBottom: 16,
          color: "#FF4D6D", fontSize: 13 }}>{error}</div>
      )}

      {/* Upload Button */}
      {file && !uploadResult && (
        <button onClick={handleUpload} disabled={uploading}
          style={{ width: "100%", padding: 14, border: "none", borderRadius: 10,
            background: uploading ? "#1e2a45" : "linear-gradient(135deg,#2A6FDB,#00D4FF)",
            color: uploading ? "#64748b" : "#fff", fontSize: 15, fontWeight: 600,
            fontFamily: "DM Sans, sans-serif", cursor: uploading ? "not-allowed" : "pointer",
            marginBottom: 12 }}>
          {uploading ? "Extracting text..." : "Upload & Process PDF →"}
        </button>
      )}

      {/* Result */}
      {uploadResult && (
        <div style={{ background: "#0D1526", border: "1px solid rgba(16,217,138,0.3)",
          borderRadius: 16, padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>✅</span>
            <div>
              <div style={{ color: "#10D98A", fontSize: 15, fontWeight: 700 }}>PDF Processed!</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>{uploadResult.wordCount} words extracted</div>
            </div>
          </div>

          <div style={{ background: "#060912", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ color: "#3D4F72", fontSize: 11, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Preview
            </div>
            <div style={{ color: "#94A3C4", fontSize: 13, lineHeight: 1.6 }}>
              {uploadResult.preview}...
            </div>
          </div>

          <button onClick={handleGenerateQuiz} disabled={generating}
            style={{ width: "100%", padding: 14, border: "none", borderRadius: 10,
              background: generating ? "#1e2a45" : "linear-gradient(135deg,#2A6FDB,#00D4FF)",
              color: generating ? "#64748b" : "#fff", fontSize: 15, fontWeight: 600,
              fontFamily: "DM Sans, sans-serif", cursor: generating ? "not-allowed" : "pointer" }}>
            {generating ? "Generating quiz with AI..." : "🎯 Generate Quiz →"}
          </button>
        </div>
      )}

      {/* Reset */}
      {uploadResult && (
        <button onClick={() => { setFile(null); setUploadResult(null); setError(""); }}
          style={{ background: "transparent", border: "1px solid #1e2a45",
            color: "#64748b", padding: "10px 20px", borderRadius: 8,
            fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
          Upload another PDF
        </button>
      )}
    </div>
  );
}