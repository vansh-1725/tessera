# 🧩 Tessera — Knowledge, assembled.

An AI-powered study platform where you upload PDFs or paste YouTube links, and the AI builds quizzes, summaries, and tracks your daily progress.

> 🚧 Currently in active development

---

## ✅ Current Status

| Feature                      | Status      |
| ---------------------------- | ----------- |
| Landing Page                 | ✅ Complete |
| User Registration            | ✅ Complete |
| User Login                   | ✅ Complete |
| Dashboard + Sidebar          | ✅ Complete |
| PDF Upload + Text Extraction | ✅ Complete |
| AI Quiz Generation (Groq)    | ✅ Complete |
| Quiz Taking + Results        | ✅ Complete |
| YouTube Integration          | ✅ Complete |
| AI Chat Agent                | 🔜 Coming   |
| Progress Tracking            | 🔜 Coming   |
| Resource Library             | 🔜 Coming   |

---

## ✨ Features

- 📄 **PDF Upload & Quiz Generation** — Upload any PDF, AI generates a full quiz instantly
- ▶️ **YouTube Integration** — Paste a video URL, get a summary + quiz _(coming soon)_
- 🤖 **AI Chat Agent** — Conversational AI that knows your uploaded materials _(coming soon)_
- 📈 **Progress Dashboard** — Daily scores, streaks, and improvement tracking _(coming soon)_
- 🔐 **Authentication** — Secure email/password login with NextAuth.js

---

## 🛠️ Tech Stack

| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| Frontend    | Next.js 15, React, Tailwind CSS    |
| Backend     | Next.js API Routes                 |
| Database    | PostgreSQL (Supabase) + Prisma ORM |
| Auth        | NextAuth.js                        |
| AI          | Groq (LLaMA 3.3 70B)               |
| PDF Parsing | unpdf                              |
| Storage     | AWS S3 _(coming soon)_             |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/vansh-1725/tessera.git
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

Required keys:

```
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=
```

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
│   ├── api/
│   │   ├── auth/         # NextAuth + Register API
│   │   ├── pdf/          # PDF upload + text extraction
│   │   └── quiz/         # Quiz generate + fetch API
│   ├── auth/
│   │   ├── login/        # Login page ✅
│   │   └── register/     # Register page ✅
│   ├── dashboard/
│   │   ├── layout.tsx    # Sidebar layout ✅
│   │   ├── page.tsx      # Dashboard home ✅
│   │   ├── upload/       # PDF upload page ✅
│   │   ├── quiz/[id]/    # Quiz taking page ✅
│   │   ├── youtube/      # YouTube page 🔜
│   │   ├── chat/         # AI Chat page 🔜
│   │   ├── library/      # Library page 🔜
│   │   └── profile/      # Profile page 🔜
│   └── page.tsx          # Landing page ✅
├── components/
│   └── shared/
│       └── AuthProvider.tsx
├── lib/
│   ├── auth/authOptions.ts
│   └── db/prisma.ts
└── prisma/
    └── schema.prisma
```

---

## 📌 Roadmap

- [x] Landing page
- [x] Authentication (register + login)
- [x] Dashboard with sidebar
- [x] PDF upload + text extraction
- [x] AI quiz generation
- [x] Quiz taking + results screen
- [x] YouTube integration
- [ ] AI chat agent
- [ ] Progress dashboard with charts
- [ ] Resource library

---

## 👨‍💻 Built by

Vansh Jadav — [@vansh-1725](https://github.com/vansh-1725)
