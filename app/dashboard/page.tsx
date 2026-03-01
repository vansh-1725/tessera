"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  if (status === "loading") return (
    <div style={{ background: "#060912", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", color: "#94A3C4",
      fontFamily: "DM Sans, sans-serif" }}>Loading...</div>
  );

  return (
    <div style={{ background: "#060912", minHeight: "100vh", padding: 40,
      fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 40 }}>
          <div>
            <h1 style={{ color: "#F0F4FF", fontSize: 26, fontWeight: 700,
              letterSpacing: "-0.02em" }}>
              Welcome back, {session?.user?.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
              Ready to study? Let's build your tessera.
            </p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/auth/login" })}
            style={{ background: "#161D30", border: "1px solid #1e2a45",
              color: "#94A3C4", padding: "8px 18px", borderRadius: 8,
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: "DM Sans, sans-serif" }}>
            Sign out
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { icon: "📄", title: "Upload PDF", desc: "Generate a quiz from any PDF", color: "#2A6FDB", href: "/upload" },
            { icon: "▶️", title: "YouTube Video", desc: "Summarise and quiz any video", color: "#FF4D6D", href: "/youtube" },
            { icon: "🤖", title: "AI Chat", desc: "Ask your study agent anything", color: "#8B5CF6", href: "/chat" },
          ].map((a) => (
            <div key={a.title}
              onClick={() => router.push(a.href)}
              style={{ background: "#0D1526", border: "1px solid #1e2a45",
                borderRadius: 12, padding: 24, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = a.color + "60";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2a45";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{a.icon}</div>
              <div style={{ color: "#F0F4FF", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>{a.desc}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { label: "Quizzes Taken", value: "0", icon: "🎯", color: "#2A6FDB" },
            { label: "Avg Score", value: "—", icon: "📈", color: "#10D98A" },
            { label: "Day Streak", value: "0 🔥", icon: "⚡", color: "#F5A623" },
            { label: "Docs Uploaded", value: "0", icon: "📚", color: "#8B5CF6" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0A0E1A", border: "1px solid #1e2a45",
              borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{s.value}</div>
              <div style={{ color: "#3D4F72", fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}