# LaunchLens AI

**Predict project success before you build.**

LaunchLens AI is an AI-powered project intelligence platform for founders, product teams, and entrepreneurs. Describe a startup or product idea and receive structured analysis — success scores, risk assessment, failure simulations, execution roadmaps, team plans, executive reports, and portfolio-level insights — all powered by Google Gemini.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [Demo Mode](#demo-mode)
- [Application Routes](#application-routes)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [AI Architecture](#ai-architecture)
- [Scripts](#scripts)

---

## Problem Statement

Most startup failures are preventable — if founders had the right intelligence before investing time and money. LaunchLens AI addresses this by turning raw project ideas into actionable intelligence: viability scores, risk signals, skill gaps, execution roadmaps, and strategic guidance, so teams can prioritize the right ideas and de-risk execution early.

---

## Features

### Core Analysis

| Module | Description |
|--------|-------------|
| **Project Analyzer** | AI evaluates market fit, complexity, risks, skill gaps, blockers, and MVP scope. Returns a success score and structured recommendations. |
| **Failure Simulator** | Explores realistic failure scenarios and mitigation strategies before launch. |
| **Roadmap Generator** | Produces phased execution roadmaps with milestones and estimated timelines. |
| **Team Builder** | Recommends team composition, roles, and skill-gap coverage based on project needs. |
| **Project Comparison** | Side-by-side comparison of multiple ideas to help prioritize opportunities. |
| **Executive Reports** | Investment-ready reports with readiness scores, exportable as PDF, and shareable via secure links. |

### Portfolio & Founder Tools

| Module | Description |
|--------|-------------|
| **Founder Dashboard** | Command center with portfolio analytics, goals, activity feed, and notifications. |
| **Portfolio Intelligence** | Aggregate view of all projects with health metrics, watchlists, and filtering. |
| **Boardroom View** | Executive-level portfolio summary for strategic decision-making. |
| **Project Evolution** | Track how a project's analysis and metrics change over time via snapshots. |
| **Goals & Notifications** | Set launch readiness goals and receive alerts when risks or readiness shift. |

### AI Mentor

Context-aware strategic advisor with three modes:

- **Project** — Deep guidance on a single idea
- **Portfolio** — Cross-project strategy and prioritization
- **Founder Coach** — General founder coaching and execution advice

Topics include health checks, what-if scenarios, execution, and strategy. The mentor draws context from all analysis engines across the platform.

### Platform

- User authentication (register / login) with protected routes
- Persistent project storage with MySQL via Prisma
- Activity logging and project snapshots
- Interactive demo with four pre-loaded sample projects (no signup required)
- Responsive UI with dark theme, animations, and guided onboarding

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| UI | Tailwind CSS, Radix UI (shadcn/ui), Framer Motion |
| State | Zustand, React Hook Form + Zod |
| Auth | NextAuth.js v5 (JWT, credentials) |
| Database | MySQL + [Prisma ORM](https://www.prisma.io/) |
| AI | Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` |
| Charts & Export | Recharts, `@react-pdf/renderer` |
| Notifications | Sonner |

---

## Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** 9+
- **MySQL** 8+ (local or hosted)
- **Google Gemini API key** — [Get one free at Google AI Studio](https://aistudio.google.com/apikey)

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd launchlens-ai
npm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) below.

### 3. Set up the database

```bash
npm run db:push
```

This creates all tables in your MySQL database from the Prisma schema.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string, e.g. `mysql://user:password@localhost:3306/launchlens` |
| `AUTH_SECRET` | Yes | Secret for Auth.js sessions. Generate with `openssl rand -base64 32` |
| `AUTH_URL` | Yes | App URL, e.g. `http://localhost:3000` (use your production URL in deployment) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `GEMINI_MODEL` | No | Model name (default: `gemini-2.5-flash`) |

---

## Database Setup

LaunchLens uses Prisma with MySQL. The schema includes models for users, projects, analyses, simulations, roadmaps, team plans, executive reports, snapshots, goals, notifications, mentor conversations, and activity logs.

```bash
# Generate Prisma client (runs automatically on npm install)
npm run db:generate

# Push schema to database (development)
npm run db:push

# Run migrations (production-friendly)
npm run db:migrate

# Open Prisma Studio to inspect data
npm run db:studio
```

---

## Running the App

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server (run `build` first) |
| `npm run lint` | Run ESLint |

**Production:**

```bash
npm run build
npm run start
```

Ensure all environment variables are set and the database is migrated before deploying.

---

## Demo Mode

Explore the full platform without creating an account:

- **Demo hub:** [http://localhost:3000/demo](http://localhost:3000/demo)
- Four pre-loaded projects with complete analysis, simulations, roadmaps, team plans, and executive reports
- Accessible from the landing page via **View Demo**

---

## Application Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/demo` | Interactive demo hub |
| `/demo/projects/[slug]` | Individual demo project workspace |
| `/auth/login` | Sign in |
| `/auth/register` | Create account |
| `/shared/report/[token]` | Public shared executive report |

### Protected (requires login)

| Route | Description |
|-------|-------------|
| `/dashboard` | Founder command center |
| `/portfolio` | Portfolio overview and analytics |
| `/portfolio/boardroom` | Executive boardroom view |
| `/portfolio/[projectId]/evolution` | Project evolution timeline |
| `/projects` | Project list and management |
| `/projects/new` | Create a new project |
| `/projects/[id]` | Project workspace |
| `/projects/[id]/analysis` | Project analysis |
| `/projects/[id]/simulator` | Failure simulation |
| `/projects/[id]/roadmap` | Execution roadmap |
| `/projects/[id]/team` | Team plan |
| `/projects/[id]/reports` | Executive reports |
| `/projects/[id]/mentor` | Project-scoped AI mentor |
| `/analyzer` | Standalone analyzer |
| `/simulator` | Standalone failure simulator |
| `/roadmap` | Standalone roadmap generator |
| `/team` | Standalone team builder |
| `/compare` | Project comparison |
| `/reports` | Reports hub |
| `/mentor` | AI Mentor (all modes) |
| `/settings` | Account settings |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/analyze` | POST | Run project analysis |
| `/api/simulator` | POST | Generate failure simulation |
| `/api/roadmap` | POST | Generate execution roadmap |
| `/api/team-plan` | POST | Generate team plan |
| `/api/compare-projects` | POST | Compare multiple projects |
| `/api/reports` | POST | Generate executive report |
| `/api/reports/[id]` | GET | Fetch a report |
| `/api/reports/share` | POST | Create shareable report link |
| `/api/mentor` | POST | AI Mentor chat |
| `/api/mentor/conversations` | GET, POST | List / create conversations |
| `/api/mentor/conversations/[id]` | GET, DELETE | Conversation detail |
| `/api/portfolio/analytics` | GET | Portfolio analytics |
| `/api/portfolio/compare-groups` | POST | Compare project groups |
| `/api/portfolio/improvement-insights` | POST | Portfolio improvement insights |
| `/api/shared/report/[token]` | GET | Public shared report |
| `/api/auth/[...nextauth]` | * | NextAuth.js handlers |

---

## Project Structure

```
app/
  (marketing)/          # Landing page
  (auth)/               # Login & register
  (dashboard)/          # Protected app pages
  api/                  # API route handlers
  demo/                 # Public demo experience

components/
  ui/                   # Design system (shadcn/ui)
  layout/               # Shell, sidebar, navbar
  dashboard/            # Dashboard widgets
  portfolio/            # Portfolio views
  analyzer/             # Analyzer UI
  simulator/            # Simulator UI
  roadmap/              # Roadmap UI
  mentor/               # AI Mentor UI
  reports/              # Report & PDF components

lib/
  ai/                   # Gemini integration, prompts, fallbacks
  actions/              # Server actions
  portfolio/            # Portfolio analytics & goals
  validations/          # Zod schemas
  utils/                # Shared utilities
  constants/            # Site config, navigation
  demo/                 # Demo seed data

prisma/
  schema.prisma         # Database schema

types/                  # Shared TypeScript types
stores/                 # Zustand stores
hooks/                  # Custom React hooks
```

---

## AI Architecture

All AI features use **Google Gemini** with a consistent pipeline:

1. **Prompt engineering** — Structured prompts per feature (`lib/ai/prompts/`)
2. **JSON response mode** — Gemini returns validated JSON
3. **Zod validation** — Responses parsed and validated before use
4. **Retry & fallback** — Automatic retries with model fallback (`gemini-2.5-flash-lite`) and deterministic offline fallbacks when the API is unavailable
5. **Context building** — The AI Mentor aggregates data from analyses, simulations, roadmaps, team plans, reports, and portfolio analytics

Supported AI modules: project analysis, failure simulation, roadmap generation, team planning, project comparison, executive reports, portfolio improvement insights, and AI Mentor.

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio
```

---

## License

This project was built as a submission project. All rights reserved unless otherwise specified.
