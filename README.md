# HumanCheck AI – AI Content Detector & Writing Humanizer

> **“Write naturally. Analyze confidently.”**  
> *A modern, premium SaaS platform for AI writing pattern detection and natural humanization.*

---

## 📌 Overview

**HumanCheck AI** is a professional two-in-one writing intelligence workspace designed for students, researchers, teachers, bloggers, marketers, and professional writers.

1. **AI Content Detector**: Analyzes text for statistical predictability, vocabulary redundancy (Type-Token Ratio), burstiness (sentence length variance), and generic machine transition patterns. Provides sentence-level heatmaps, confidence meters, and actionable writing insights.
2. **AI Writing Humanizer**: Transforms rigid, repetitive, or overly formal writing into organic, readable prose with customizable tones (Natural, Academic, Conversational, Friendly, etc.) and rewrite strengths (1 to 4) while strictly safeguarding facts, numbers, citations, URLs, and original core meaning.

> **Responsible AI Principle:** AI detection is probabilistic and should be treated as an assessment, not definitive proof of authorship. Our tool empowers writers to improve clarity and rhythm without making deceptive "100% bypass" claims.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Lucide React Icons
- **Backend**: Node.js, Express, TypeScript, Helmet, CORS, Rate Limiting, JWT Authentication, Morgan
- **Database**: PostgreSQL with UUID support (`database/schema.sql`) + Built-in In-Memory fallback store
- **Architecture**: Modular Service Layer for drop-in replacement with real LLM/AI detection APIs

---

## 📁 Repository Structure

```text
AI detector and humanizer/
├── client/                     # React + Vite + Tailwind Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/         # ScoreCircle, RichToolbar, UploadBox, Modal, Toast
│   │   │   ├── detector/       # SentenceHighlight, SentenceModal, InsightsCard, StatsCard, ExportModal
│   │   │   ├── humanizer/      # HumanizerControls, DiffViewer, LoadingStepIndicator
│   │   │   ├── dashboard/      # ActivityChart, DistributionChart
│   │   │   └── layout/         # Navbar, Footer, AppLayout
│   │   ├── context/            # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/              # Home, Detector, Humanizer, Dashboard, History, Detail, Pricing, Auth, Profile, Settings
│   │   ├── services/           # api, detectorService, humanizerService, historyService
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # nlpAnalysis, textDiff, readability, exportUtils
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── controllers/        # authController, detectorController, humanizerController, historyController, userController
│   │   ├── middleware/         # authMiddleware, rateLimiter, errorHandler
│   │   ├── routes/             # authRoutes, detectorRoutes, humanizerRoutes, historyRoutes, userRoutes
│   │   ├── services/           # detectorService, humanizerService, dbService
│   │   ├── utils/              # nlpEngine, textTransformer
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   └── schema.sql              # PostgreSQL schema with indexes and tables
├── .env.example
├── README.md
└── package.json                # Root orchestration workspace
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or v20+ recommended)
- npm or yarn

### 1. Installation

Install all root, client, and server dependencies with one command:
```bash
npm run install:all
```
*Or install individually:*
```bash
cd server && npm install
cd ../client && npm install
```

---

### 2. Running Locally (Development Mode)

From the root directory:
```bash
npm run dev
```

This concurrently launches:
- **Client (Frontend)** on `http://localhost:5173`
- **Server (API Backend)** on `http://localhost:5000`

#### Running Independently:
- **Frontend only**:
  ```bash
  cd client
  npm run dev
  ```
- **Backend only**:
  ```bash
  cd server
  npm run dev
  ```

---

## 🗄️ Database Configuration (PostgreSQL)

The platform runs out-of-the-box in **Zero-Config Demo Mode** using a built-in memory store.

To connect a live PostgreSQL database:
1. Copy `.env.example` to `.env` in the root or `server/` directory:
   ```env
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/humancheck_db
   ```
2. Create the database and run the schema:
   ```bash
   psql -U postgres -d humancheck_db -f database/schema.sql
   ```

---

## 🔌 Connecting Real AI Models (OpenAI / Claude / Gemini / Ollama)

The application features a clean, separated service layer located at:
- `server/src/services/detectorService.ts`
- `server/src/services/humanizerService.ts`

### Example: Hooking Gemini or OpenAI in `server/src/services/humanizerService.ts`:
```typescript
import { GoogleGenAI } from '@google/genai';

export class HumanizerService {
  public static async humanize(options: HumanizeOptions, userId?: string) {
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Rewrite this text to sound organic, engaging, and in a ${options.tone} tone. Preserve all citations, technical terms, and core facts:\n\n${options.text}`
      });
      // Return structured HumanizeResult
    }
    // Falls back seamlessly to built-in rule transformer
    return humanizeText(options);
  }
}
```

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Salted bcrypt hashing.
- **JWT Authentication**: Secure stateless token issuance with expiration.
- **Rate Limiting**: Configured IP rate limits on auth and analysis endpoints.
- **Input Sanitation & Validation**: Protection against script injection and buffer overruns.
- **Security Headers**: Powered by `helmet` with CORS protection.

---

## 📄 License
© 2026 HumanCheck AI. All rights reserved.
