"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TesseraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
      <rect
        x="3"
        y="3"
        width="19"
        height="19"
        rx="2.5"
        fill="#2A6FDB"
        opacity="0.95"
      />
      <rect
        x="26"
        y="3"
        width="19"
        height="19"
        rx="2.5"
        fill="#00D4FF"
        opacity="0.75"
      />
      <rect
        x="3"
        y="26"
        width="19"
        height="19"
        rx="2.5"
        fill="#00D4FF"
        opacity="0.6"
      />
      <rect
        x="26"
        y="26"
        width="19"
        height="19"
        rx="2.5"
        fill="#2A6FDB"
        opacity="0.85"
      />
      <circle cx="24" cy="24" r="3" fill="#00D4FF" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F0F4FF"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Tessera AI. Ask me anything — math, coding, science, general knowledge, or questions about your uploaded study materials.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "DM Sans, sans-serif",
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        maxWidth: 800,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            color: "#F0F4FF",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          AI Assistant
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Ask anything — general knowledge, math, coding, or your study
          materials.
        </p>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingRight: 4,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 10,
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#0D1526",
                  border: "1px solid #1e2a45",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <TesseraIcon />
              </div>
            )}

            <div
              style={{
                maxWidth: "75%",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#2A6FDB,#1a5bc4)"
                    : "#0D1526",
                border: msg.role === "user" ? "none" : "1px solid #1e2a45",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                padding: "12px 16px",
                color: "#F0F4FF",
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#0D1526",
                  border: "1px solid #1e2a45",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <UserIcon />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#0D1526",
                border: "1px solid #1e2a45",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TesseraIcon />
            </div>
            <div
              style={{
                background: "#0D1526",
                border: "1px solid #1e2a45",
                borderRadius: "18px 18px 18px 4px",
                padding: "14px 18px",
              }}
            >
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#2A6FDB",
                      animation: `bounce 1.2s infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "16px 0",
          borderTop: "1px solid #1e2a45",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask me anything..."
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#0D1526",
            border: "1px solid #1e2a45",
            borderRadius: 10,
            color: "#F0F4FF",
            fontSize: 14,
            fontFamily: "DM Sans, sans-serif",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "12px 20px",
            background:
              loading || !input.trim()
                ? "#1e2a45"
                : "linear-gradient(135deg,#2A6FDB,#00D4FF)",
            border: "none",
            borderRadius: 10,
            color: loading || !input.trim() ? "#3D4F72" : "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            fontFamily: "DM Sans, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <SendIcon />
          Send
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
