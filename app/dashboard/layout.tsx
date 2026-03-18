"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="sl1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A6FDB" /><stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
        <linearGradient id="sl2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" /><stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="19" height="19" rx="2.5" fill="url(#sl1)" opacity="0.95" />
      <rect x="26" y="3" width="19" height="19" rx="2.5" fill="url(#sl2)" opacity="0.75" />
      <rect x="3" y="26" width="19" height="19" rx="2.5" fill="url(#sl2)" opacity="0.6" />
      <rect x="26" y="26" width="19" height="19" rx="2.5" fill="url(#sl1)" opacity="0.85" />
      <circle cx="24" cy="24" r="4" fill="#00D4FF" opacity="0.9" />
      <circle cx="24" cy="24" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}

const navItems = [
  { href: "/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/dashboard/upload", icon: "📄", label: "Upload PDF" },
  { href: "/dashboard/youtube", icon: "▶️", label: "YouTube" },
  { href: "/dashboard/chat", icon: "🤖", label: "AI Chat" },
  { href: "/dashboard/library", icon: "📚", label: "Library" },
  { href: "/dashboard/profile", icon: "👤", label: "Profile" },
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  if (status === "loading") return (
    <div style={{ background: "#060912", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#2A6FDB", fontSize: 24 }}>⟳</div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060912",
      fontFamily: "DM Sans, sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: 240, background: "#0A0E1A", borderRight: "1px solid #1e2a45",
        display: "flex", flexDirection: "column", position: "fixed",
        top: 0, left: 0, height: "100vh", zIndex: 50 }}>

        {/* Logo */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2a45" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center",
            gap: 10, textDecoration: "none" }}>
            <Logo />
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em",
              background: "linear-gradient(90deg,#F0F4FF,#94A3C4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              tessera
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px" }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                  background: active ? "rgba(42,111,219,0.15)" : "transparent",
                  border: active ? "1px solid rgba(42,111,219,0.3)" : "1px solid transparent",
                  color: active ? "#F0F4FF" : "#64748b",
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  transition: "all 0.15s", cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLDivElement).style.color = "#94A3C4";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLDivElement).style.background = "transparent";
                      (e.currentTarget as HTMLDivElement).style.color = "#64748b";
                    }
                  }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 16px", borderTop: "1px solid #1e2a45" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg,#2A6FDB,#00D4FF)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#F0F4FF", fontSize: 13, fontWeight: 600,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session?.user?.name}
              </div>
              <div style={{ color: "#3D4F72", fontSize: 11,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session?.user?.email}
              </div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/auth/login" })}
            style={{ width: "100%", padding: "8px", background: "transparent",
              border: "1px solid #1e2a45", borderRadius: 7, color: "#64748b",
              fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: "DM Sans, sans-serif", transition: "all 0.15s" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#FF4D6D40";
              (e.currentTarget as HTMLButtonElement).style.color = "#FF4D6D";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e2a45";
              (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
            }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}