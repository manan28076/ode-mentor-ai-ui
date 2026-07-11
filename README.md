# CodeMentor AI

> AI-powered code review platform — review, optimize, explain, and improve code using Google Gemini.

**Live App:** [ode-mentor-ai-ui.vercel.app](https://ode-mentor-ai-ui.vercel.app/)
**Backend Repo Path:** [`/backend`](./backend)

---

## Overview

CodeMentor AI is a full-stack application that gives developers instant, AI-driven feedback on their code — bug detection, complexity analysis, optimization suggestions, and plain-English explanations of errors. Users can sign up, submit code for review, and track their review history and stats over time from a personal dashboard.

Built solo, end-to-end: system design, REST API, database schema, auth, and a fully custom React frontend.

---

## Features

- **AI Code Review** — deep, context-aware feedback on style, bugs, and structure
- **Complexity Analysis** — time/space complexity with optimized alternatives
- **Error Explanation** — plain-English breakdown of why an error occurred
- **Review History** — every submission is saved and retrievable per user
- **Dashboard Stats** — total reviews, average score, languages reviewed, lines reviewed
- **Auth** — JWT-based signup/login with hashed passwords (bcrypt)

---

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- TanStack Router + TanStack Query
- Tailwind CSS v4 + shadcn/ui (Radix primitives)
- Framer Motion
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt authentication
- Google Gemini API (`@google/genai`) for code review/explanation

---

## Architecture

```
├── backend/
│   ├── controllers/     # Route handlers (auth, review, explain)
│   ├── models/           # Mongoose schemas (User, Review)
│   ├── routes/            # Express route definitions
│   ├── middleware/    # JWT auth middleware
│   ├── services/         # Gemini API client
│   ├── prompts/           # AI prompt templates
│   └── server.js
└── src/                     # React frontend
    ├── components/
    ├── routes/
    ├── hooks/
    ├── services/
    └── lib/
```

The frontend communicates with the Express backend over a REST API. Code review and explanation requests are sent to Gemini via a dedicated prompt layer, and results are parsed and persisted to MongoDB against the authenticated user.

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in, returns JWT | No |
| POST | `/api/review` | Submit code for AI review | Yes |
| GET | `/api/review/history` | Get user's past reviews | Yes |
| GET | `/api/review/dashboard` | Get aggregated review stats | Yes |
| POST | `/api/explain` | Get an AI explanation of a code snippet/error | Yes |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Gemini API key

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm start
```

### Frontend Setup
```bash
npm install
```

Create a `.env` file in the project root:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

---

## Roadmap

- [ ] GitHub repo import for direct PR/branch review
- [ ] Automated unit test generation
- [ ] Multi-language code conversion
- [ ] Centralized error handling middleware
- [ ] Test coverage (Jest/Supertest)

---

## Author

**Manan Shah**
[LinkedIn](https://linkedin.com/in/mananshah2876) · [GitHub](https://github.com/manan28076)