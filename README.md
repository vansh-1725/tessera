# 🧩 Tessera — Knowledge, assembled.

An AI-powered study platform where you upload PDFs or paste YouTube links, and the AI builds quizzes, summaries, and tracks your daily progress.

---

## ✨ Features

- 📄 **PDF Upload & Quiz Generation** — Upload any PDF, AI generates a full quiz instantly
- ▶️ **YouTube Integration** — Paste a video URL, get a summary + quiz
- 🤖 **AI Chat Agent** — Conversational AI that knows your uploaded materials
- 📈 **Progress Dashboard** — Daily scores, streaks, and improvement tracking
- 🔐 **Authentication** — Secure email/password login with NextAuth.js

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Auth | NextAuth.js |
| AI | OpenAI GPT-4 + LangChain |
| Storage | AWS S3 |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR-USERNAME/tessera.git
cd tessera
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env.local
```
Fill in your keys in `.env.local` and create a `.env` file with your `DATABASE_URL`.

### 4. Push database schema
```bash
npx prisma db push
```

### 5. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
tessera/
├── app/
│   ├── api/          # Backend API routes
│   ├── auth/         # Login & Register pages
│   ├── dashboard/    # Main dashboard
│   ├── upload/       # PDF upload (coming soon)
│   ├── youtube/      # YouTube processing (coming soon)
│   └── chat/         # AI chat agent (coming soon)
├── components/       # Reusable UI components
├── lib/              # Auth, DB, AI helpers
├── prisma/           # Database schema
└── public/           # Static assets
```

---

## 📌 Roadmap

- [x] Landing page
- [x] Authentication (register + login)
- [ ] PDF upload + quiz generation
- [ ] YouTube integration
- [ ] AI chat agent
- [ ] Progress dashboard
- [ ] Resource library

---

## 👨‍💻 Built by

Vansh Jadav — [@YOUR-GITHUB](https://github.com/YOUR-USERNAME)