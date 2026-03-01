# 🧩 Tessera — Setup Guide

## Ye kya hai?
Tessera ka full Next.js project. Abhi sirf Landing Page complete hai.
Baaki pages step by step build karenge.

---

## Step 1 — Project apne system pe chalao

### Prerequisites (pehle install karo)
- Node.js v18+ → https://nodejs.org (LTS version download karo)
- VS Code → https://code.visualstudio.com

### Commands (terminal mein chalao)

```bash
# 1. Is folder mein jao
cd tessera

# 2. Saari dependencies install karo
npm install

# 3. Environment file banao
cp .env.example .env.local

# 4. Dev server start karo
npm run dev
```

### Browser mein kholo
```
http://localhost:3000
```

Bas! Landing page live hoga. 🎉

---

## Current Status

| Page | Status |
|------|--------|
| Landing Page (/) | ✅ Complete |
| Login (/auth/login) | 🔜 Step 2 |
| Register (/auth/register) | 🔜 Step 2 |
| Dashboard | 🔜 Step 3 |
| PDF Upload | 🔜 Step 3 |
| Quiz | 🔜 Step 3 |
| YouTube | 🔜 Step 4 |
| AI Chat | 🔜 Step 5 |
| Progress | 🔜 Step 6 |

---

## Project Structure

```
tessera/
├── app/
│   ├── page.tsx          ← Landing Page (done ✅)
│   ├── layout.tsx        ← Root layout
│   ├── globals.css       ← Brand styles + fonts
│   └── auth/
│       ├── login/        ← Placeholder
│       └── register/     ← Placeholder
├── prisma/
│   └── schema.prisma     ← Full database schema ready
├── .env.example          ← Copy to .env.local
├── tailwind.config.ts    ← Brand colors configured
└── package.json
```

---

## Vercel pe Deploy karna (optional, abhi)

```bash
# Vercel CLI install karo
npm i -g vercel

# Deploy karo
vercel
```

Ye tumhe ek live URL dega jaise: `tessera-xyz.vercel.app`

---

## Next Step
Jab landing page theek lagey, bolo aur hum **Authentication (Step 2)** start karenge.
