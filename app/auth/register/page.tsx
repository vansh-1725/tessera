"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A6FDB" /><stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" /><stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="19" height="19" rx="2.5" fill="url(#g1)" opacity="0.95" />
      <rect x="26" y="3" width="19" height="19" rx="2.5" fill="url(#g2)" opacity="0.75" />
      <rect x="3" y="26" width="19" height="19" rx="2.5" fill="url(#g2)" opacity="0.6" />
      <rect x="26" y="26" width="19" height="19" rx="2.5" fill="url(#g1)" opacity="0.85" />
      <circle cx="24" cy="24" r="4" fill="#00D4FF" opacity="0.9" />
      <circle cx="24" cy="24" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      router.push("/auth/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: "#0A0E1A",
    border: "1px solid #1e2a45", borderRadius: 8, color: "#F0F4FF",
    fontSize: 14, outline: "none", fontFamily: "DM Sans, sans-serif",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ background: "#060912", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
      fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400, opacity: 0.12, pointerEvents: "none",
        background: "radial-gradient(ellipse, #2A6FDB, transparent)" }} />

      <div style={{ width: "100%", maxWidth: 440, zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logo />
            <span style={{ fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#F0F4FF,#94A3C4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>tessera</span>
          </Link>
          <p style={{ color: "#3D4F72", fontSize: 13, marginTop: 6 }}>Knowledge, assembled.</p>
        </div>

        <div style={{ background: "#0D1526", border: "1px solid #1e2a45", borderRadius: 16, padding: 36 }}>
          <h1 style={{ color: "#F0F4FF", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Free forever. No credit card required.</p>

          {error && (
            <div style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#FF4D6D", fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Your name" },
              { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", key: "password", type: "password", placeholder: "At least 8 characters" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: f.key === "password" ? 24 : 16 }}>
                <label style={{ display: "block", color: "#94A3C4", fontSize: 13,
                  fontWeight: 500, marginBottom: 6 }}>{f.label}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={f.key === "password" ? (showPassword ? "text" : "password") : f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required
                    style={{ ...inputStyle, paddingRight: f.key === "password" ? 44 : 14 }}
                    onFocus={(e) => (e.target.style.borderColor = "#2A6FDB")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e2a45")}
                  />
                  {f.key === "password" && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: 12, top: "50%",
                        transform: "translateY(-50%)", background: "none",
                        border: "none", cursor: "pointer", color: "#64748b",
                        padding: 0, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: 13, border: "none", borderRadius: 8, fontSize: 15,
              fontWeight: 600, fontFamily: "DM Sans, sans-serif", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#1e2a45" : "linear-gradient(135deg,#2A6FDB,#00D4FF)",
              color: loading ? "#64748b" : "#fff",
            }}>
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#64748b", fontSize: 14, marginTop: 24 }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#2A6FDB", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}