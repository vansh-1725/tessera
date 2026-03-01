"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── Tessera Logo SVG ─────────────────────────────────────────────────────────
function TesseraLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A6FDB" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="3" y="3" width="19" height="19" rx="2.5" fill="url(#lg1)" opacity="0.95" />
      <rect x="26" y="3" width="19" height="19" rx="2.5" fill="url(#lg2)" opacity="0.75" />
      <rect x="3" y="26" width="19" height="19" rx="2.5" fill="url(#lg2)" opacity="0.6" />
      <rect x="26" y="26" width="19" height="19" rx="2.5" fill="url(#lg1)" opacity="0.85" />
      <circle cx="24" cy="24" r="4" fill="#00D4FF" filter="url(#glow)" opacity="0.9" />
      <circle cx="24" cy="24" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}

// ── Animated Mosaic Background ───────────────────────────────────────────────
function MosaicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid of tiles */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(42,111,219,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(42,111,219,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Floating tile accents */}
      {[
        { top: "8%", left: "5%", size: 40, delay: "0s", color: "rgba(42,111,219,0.15)" },
        { top: "15%", right: "8%", size: 28, delay: "0.8s", color: "rgba(0,212,255,0.1)" },
        { top: "45%", left: "2%", size: 20, delay: "1.6s", color: "rgba(139,92,246,0.12)" },
        { top: "70%", right: "5%", size: 36, delay: "0.4s", color: "rgba(42,111,219,0.1)" },
        { bottom: "15%", left: "8%", size: 24, delay: "1.2s", color: "rgba(0,212,255,0.08)" },
        { top: "30%", right: "15%", size: 16, delay: "2s", color: "rgba(139,92,246,0.15)" },
      ].map((t, i) => (
        <div
          key={i}
          className="absolute rounded-md animate-float"
          style={{
            ...t,
            width: t.size,
            height: t.size,
            background: t.color,
            border: `1px solid ${t.color.replace("0.", "0.3")}`,
            animationDelay: t.delay,
          }}
        />
      ))}
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20"
        style={{ background: "radial-gradient(ellipse at center, #2A6FDB 0%, transparent 70%)" }}
      />
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6,9,18,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1e2a45" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TesseraLogo size={32} />
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(90deg, #F0F4FF, #94A3C4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            tessera
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#64748b" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F4FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: "#94A3C4" }}
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #2A6FDB, #00D4FF)",
              color: "#fff",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
      <MosaicBackground />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
          style={{
            background: "rgba(42,111,219,0.1)",
            border: "1px solid rgba(42,111,219,0.3)",
            color: "#00D4FF",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#00D4FF" }}
          />
          AI-Powered Study Platform
        </div>

        {/* Headline */}
        <h1
          className="font-display font-light mb-6 leading-none"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(52px, 8vw, 96px)",
            color: "#F0F4FF",
          }}
        >
          Knowledge,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #2A6FDB 0%, #00D4FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            assembled.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif", fontWeight: 400 }}
        >
          Upload a PDF. Paste a YouTube link. Tessera's AI agent builds quizzes,
          summaries, and structured study materials — then tracks how you improve,
          every single day.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/auth/register"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 glow-blue"
            style={{
              background: "linear-gradient(135deg, #2A6FDB, #00D4FF)",
              color: "#fff",
              boxShadow: "0 0 32px rgba(42,111,219,0.3)",
            }}
          >
            Start for free
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-base transition-all duration-200"
            style={{
              background: "transparent",
              border: "1px solid #1e2a45",
              color: "#94A3C4",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3D4F72";
              e.currentTarget.style.color = "#F0F4FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e2a45";
              e.currentTarget.style.color = "#94A3C4";
            }}
          >
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div
          className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl"
          style={{
            background: "rgba(22,29,48,0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid #1e2a45",
          }}
        >
          {[
            { value: "PDF", label: "Upload & Quiz" },
            { value: "YouTube", label: "Transcript → Summary" },
            { value: "AI Chat", label: "24/7 Study Agent" },
            { value: "Progress", label: "Daily Tracking" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="text-sm font-bold mb-0.5"
                style={{ color: "#00D4FF", fontFamily: "DM Sans, sans-serif" }}
              >
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "#3D4F72" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs" style={{ color: "#3D4F72" }}>scroll</span>
        <div
          className="w-px h-8 animate-pulse"
          style={{ background: "linear-gradient(to bottom, #3D4F72, transparent)" }}
        />
      </div>
    </section>
  );
}

// ── Features Section ─────────────────────────────────────────────────────────
const features = [
  {
    icon: "📄",
    title: "PDF → Quiz in 30 seconds",
    desc: "Upload any PDF. Tessera reads it, understands it, and generates a full quiz — MCQ or short answer — ready to take immediately.",
    tag: "Core Feature",
    color: "#2A6FDB",
  },
  {
    icon: "▶️",
    title: "YouTube → Structured Notes",
    desc: "Paste any YouTube video URL. The AI fetches the transcript, writes a clean summary, and exports it as a formatted PDF you can keep.",
    tag: "YouTube",
    color: "#FF4D6D",
  },
  {
    icon: "🤖",
    title: "AI Study Agent",
    desc: "Chat with an AI that knows your uploaded materials. Ask it anything — explanations, comparisons, study tips — it remembers your context.",
    tag: "AI Agent",
    color: "#8B5CF6",
  },
  {
    icon: "📈",
    title: "Progress Dashboard",
    desc: "Track quiz scores, study streaks, and daily improvement. See exactly how much better you're getting, visualised day by day.",
    tag: "Progress",
    color: "#10D98A",
  },
  {
    icon: "🎯",
    title: "Adaptive Difficulty",
    desc: "Score above 80% three times? Tessera automatically makes the next quiz harder. Below 50%? It eases up. Keeps you in the learning zone.",
    tag: "Smart",
    color: "#F5A623",
  },
  {
    icon: "📚",
    title: "Resource Library",
    desc: "Browse a curated library of study videos by subject. Any video can be processed into a quiz or summary in one click.",
    tag: "Library",
    color: "#00D4FF",
  },
];

function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold mb-4 tracking-widest uppercase"
            style={{ color: "#2A6FDB" }}
          >
            What Tessera does
          </p>
          <h2
            className="font-light mb-4"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              color: "#F0F4FF",
            }}
          >
            Every tool you need.{" "}
            <span style={{ color: "#3D4F72" }}>One place.</span>
          </h2>
          <p style={{ color: "#64748b", maxWidth: 480, margin: "0 auto" }}>
            No more switching between YouTube, Anki, ChatGPT, and Google Docs.
            Tessera pulls it all together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl p-6 transition-all duration-300 cursor-default"
              style={{
                background: "#0D1526",
                border: "1px solid #1e2a45",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.color + "60";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2a45";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: f.color + "15" }}
                >
                  {f.icon}
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: f.color + "15",
                    border: `1px solid ${f.color}40`,
                    color: f.color,
                  }}
                >
                  {f.tag}
                </span>
              </div>
              <h3
                className="font-semibold text-base mb-2"
                style={{ color: "#F0F4FF" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    title: "Upload your material",
    desc: "Drop a PDF or paste a YouTube URL. Tessera accepts any study material you throw at it.",
  },
  {
    number: "02",
    title: "AI processes it instantly",
    desc: "The AI reads, understands, and structures the content — extracting key concepts and building a knowledge map.",
  },
  {
    number: "03",
    title: "Take your quiz",
    desc: "A personalised quiz is generated from your exact material. Not generic — your content, your questions.",
  },
  {
    number: "04",
    title: "Watch yourself improve",
    desc: "Scores are tracked daily. Streaks are counted. The dashboard shows your arc — where you started, where you are.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold mb-4 tracking-widest uppercase"
            style={{ color: "#2A6FDB" }}
          >
            The process
          </p>
          <h2
            className="font-light"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              color: "#F0F4FF",
            }}
          >
            Four steps.{" "}
            <span style={{ color: "#00D4FF" }}>Zero friction.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-px z-10"
                  style={{
                    background: "linear-gradient(90deg, #1e2a45, transparent)",
                    width: "calc(100% - 48px)",
                    left: "calc(100% - 0px)",
                  }}
                />
              )}
              <div
                className="rounded-2xl p-6 h-full"
                style={{ background: "#0A0E1A", border: "1px solid #1e2a45" }}
              >
                <div
                  className="text-3xl font-bold mb-4 font-mono"
                  style={{
                    background: "linear-gradient(135deg, #2A6FDB, #00D4FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="font-semibold text-base mb-3"
                  style={{ color: "#F0F4FF" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ──────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="rounded-3xl p-16 relative overflow-hidden"
          style={{ background: "#0D1526", border: "1px solid #1e2a45" }}
        >
          {/* Background glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, #2A6FDB, transparent)" }}
          />

          <div className="relative z-10">
            <TesseraLogo size={52} />
            <h2
              className="font-light mt-6 mb-4"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                color: "#F0F4FF",
              }}
            >
              One tile at a time.
            </h2>
            <p
              className="text-lg mb-10 max-w-lg mx-auto"
              style={{ color: "#64748b" }}
            >
              Start with one PDF. Take one quiz. See your first score.
              The mosaic builds itself from there.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-base"
              style={{
                background: "linear-gradient(135deg, #2A6FDB, #00D4FF)",
                color: "#fff",
                boxShadow: "0 0 40px rgba(42,111,219,0.35)",
              }}
            >
              Build your Tessera — it's free →
            </Link>
            <p className="mt-4 text-xs" style={{ color: "#3D4F72" }}>
              No credit card. No commitment. Start in 30 seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="border-t py-12 px-6"
      style={{ borderColor: "#1e2a45" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TesseraLogo size={24} />
          <span
            className="font-semibold text-sm"
            style={{ color: "#3D4F72" }}
          >
            tessera
          </span>
        </div>
        <p className="text-xs" style={{ color: "#3D4F72" }}>
          © 2025 Tessera. Knowledge, assembled.
        </p>
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs transition-colors"
              style={{ color: "#3D4F72" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3C4")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#3D4F72")}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main style={{ background: "#060912", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
