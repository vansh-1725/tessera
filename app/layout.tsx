import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/shared/AuthProvider";

export const metadata: Metadata = {
  title: "Tessera — Knowledge, assembled.",
  description:
    "Upload PDFs, paste YouTube links. Tessera's AI agent builds quizzes, summaries, and tracks your progress — one tile at a time.",
  keywords: ["AI study", "quiz generator", "PDF learning", "study assistant"],
  openGraph: {
    title: "Tessera",
    description: "Knowledge, assembled.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
