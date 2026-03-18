"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${params.id}`);
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch {
        console.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [params.id]);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected!];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      const correct = newAnswers.filter((a, i) => a === questions[i].correctAnswer).length;
      setScore(Math.round((correct / questions.length) * 100));
      setShowResult(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  if (loading) return (
    <div style={{ background: "#060912", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ color: "#94A3C4" }}>Loading quiz...</div>
    </div>
  );

  if (showResult) return (
    <div style={{ background: "#060912", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
      fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {score >= 80 ? "🎉" : score >= 60 ? "👍" : "📚"}
        </div>
        <h1 style={{ color: "#F0F4FF", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          {score}%
        </h1>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>
          {score >= 80 ? "Excellent work!" : score >= 60 ? "Good job!" : "Keep studying!"}
          {" "}You got {answers.filter((a, i) => a === questions[i].correctAnswer).length} out of {questions.length} correct.
        </p>

        {/* Review */}
        <div style={{ textAlign: "left", marginBottom: 32 }}>
          {questions.map((q, i) => {
            const correct = answers[i] === q.correctAnswer;
            return (
              <div key={i} style={{ background: "#0D1526",
                border: `1px solid ${correct ? "rgba(16,217,138,0.3)" : "rgba(255,77,109,0.3)"}`,
                borderRadius: 10, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span>{correct ? "✅" : "❌"}</span>
                  <div style={{ color: "#F0F4FF", fontSize: 13, fontWeight: 500 }}>{q.question}</div>
                </div>
                {!correct && (
                  <div style={{ color: "#10D98A", fontSize: 12, marginLeft: 24 }}>
                    Correct: {q.options[q.correctAnswer]}
                  </div>
                )}
                <div style={{ color: "#64748b", fontSize: 12, marginLeft: 24, marginTop: 4 }}>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => router.push("/upload")}
            style={{ padding: "12px 24px", background: "linear-gradient(135deg,#2A6FDB,#00D4FF)",
              border: "none", borderRadius: 8, color: "#fff", fontSize: 14,
              fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            Upload Another PDF
          </button>
          <button onClick={() => router.push("/dashboard")}
            style={{ padding: "12px 24px", background: "transparent",
              border: "1px solid #1e2a45", borderRadius: 8, color: "#94A3C4",
              fontSize: 14, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  if (!q) return null;

  return (
    <div style={{ background: "#060912", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
      fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ maxWidth: 620, width: "100%" }}>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            color: "#64748b", fontSize: 13, marginBottom: 8 }}>
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(((current) / questions.length) * 100)}% complete</span>
          </div>
          <div style={{ background: "#1e2a45", borderRadius: 999, height: 6 }}>
            <div style={{ width: `${((current) / questions.length) * 100}%`,
              height: "100%", background: "linear-gradient(90deg,#2A6FDB,#00D4FF)",
              borderRadius: 999, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ background: "#0D1526", border: "1px solid #1e2a45",
          borderRadius: 16, padding: 32, marginBottom: 20 }}>
          <h2 style={{ color: "#F0F4FF", fontSize: 18, fontWeight: 600,
            lineHeight: 1.5, margin: 0 }}>{q.question}</h2>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {q.options.map((option, i) => {
            let bg = "#0D1526";
            let border = "#1e2a45";
            let color = "#94A3C4";

            if (selected !== null) {
              if (i === q.correctAnswer) { bg = "rgba(16,217,138,0.1)"; border = "#10D98A"; color = "#10D98A"; }
              else if (i === selected && selected !== q.correctAnswer) {
                bg = "rgba(255,77,109,0.1)"; border = "#FF4D6D"; color = "#FF4D6D";
              }
            } else if (selected === i) {
              bg = "rgba(42,111,219,0.15)"; border = "#2A6FDB"; color = "#F0F4FF";
            }

            return (
              <div key={i} onClick={() => handleSelect(i)}
                style={{ background: bg, border: `1px solid ${border}`,
                  borderRadius: 10, padding: "14px 18px", cursor: selected !== null ? "default" : "pointer",
                  color, fontSize: 14, fontWeight: 500, transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%",
                  background: border === "#1e2a45" ? "#161D30" : bg,
                  border: `1px solid ${border}`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
                  color: border === "#1e2a45" ? "#3D4F72" : color }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </div>
            );
          })}
        </div>

        {/* Next Button */}
        <button onClick={handleNext} disabled={selected === null}
          style={{ width: "100%", padding: 14, border: "none", borderRadius: 10,
            background: selected === null ? "#161D30" : "linear-gradient(135deg,#2A6FDB,#00D4FF)",
            color: selected === null ? "#3D4F72" : "#fff", fontSize: 15, fontWeight: 600,
            fontFamily: "DM Sans, sans-serif", cursor: selected === null ? "not-allowed" : "pointer",
            transition: "all 0.2s" }}>
          {current + 1 >= questions.length ? "Finish Quiz →" : "Next Question →"}
        </button>
      </div>
    </div>
  );
}