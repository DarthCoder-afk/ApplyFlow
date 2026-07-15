# Job Tracker

A full-stack job application tracker that helps you manage your job search in one place — save roles, track application status, and monitor progress from a dashboard instead of juggling spreadsheets.

## Features

- **Authentication** — Register, log in, and manage sessions with JWT access and refresh tokens
- **Jobs** — Save job postings with title, company, location, source, URL, description, and notes
- **Applications** — Link applications to jobs and track status through the pipeline (Saved → Applied → Interview → Offer, etc.)
- **Dashboard** — View totals, active applications, status breakdown chart, and recent activity
- **Search & filtering** — Search jobs and applications with loading skeletons for a smooth UX
- **Landing page** — Marketing homepage with feature highlights and auth entry points

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, React Hook Form, Zod, Recharts, Framer Motion, shadcn/ui |
| Backend  | Node.js, Express 5, TypeScript, Prisma, PostgreSQL, Zod, JWT, bcrypt |
| Database | PostgreSQL 17 (via Docker) |

## Project Structure

```
Job Tracker/
├── frontend/          # Next.js app (port 3000)
│   ├── src/app/       # App Router pages (landing, auth, dashboard, jobs, applications)
│   ├── src/components/
│   └── lib/           # API clients, types, validation schemas
├── backend/           # Express API (port 4000)
│   ├── src/modules/   # auth, jobs, applications, dashboard
│   └── prisma/        # Schema and migrations
└── docker-compose.yml # PostgreSQL database
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) (recommended — lockfiles are included)
- [Docker](https://www.docker.com/) (for PostgreSQL)

## Getting Started

### 1. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL on port `5432` with:

- **Database:** `applyflow`
- **User:** `postgres`
- **Password:** `postgres`

### 2. Configure environment variables

**Backend** — create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/applyflow"
PORT=4000
NODE_ENV=development

JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Frontend** — create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Install dependencies

```bash
cd backend && pnpm install
cd ../frontend && pnpm install
```

### 4. Set up the database

```bash
cd backend
pnpm exec prisma generate
pnpm exec prisma migrate deploy
```

### 5. Run the development servers

In separate terminals:

```bash
# Backend (http://localhost:4000)
cd backend && pnpm dev

# Frontend (http://localhost:3000)
cd frontend && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. Register an account, then use the dashboard, jobs, and applications pages.

## Scripts

### Backend (`backend/`)

| Command       | Description                    |
| ------------- | ------------------------------ |
| `pnpm dev`    | Start API with hot reload      |
| `pnpm build`  | Compile TypeScript to `dist/`  |
| `pnpm start`  | Run compiled production build  |

### Frontend (`frontend/`)

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start Next.js dev server |
| `pnpm build`   | Create production build  |
| `pnpm start`   | Serve production build   |
| `pnpm lint`    | Run ESLint               |

## API Overview

All API routes are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/health`         | API health check         |
| GET    | `/api/health/db`      | Database health check    |
| POST   | `/api/auth/register`  | Create account           |
| POST   | `/api/auth/login`     | Log in                   |
| POST   | `/api/auth/refresh`   | Refresh access token     |
| POST   | `/api/auth/logout`    | Log out                  |
| GET    | `/api/auth/me`        | Current user (protected) |
| GET    | `/api/jobs`           | List jobs (protected)    |
| POST   | `/api/jobs`           | Create job (protected)   |
| GET    | `/api/jobs/:id`       | Get job (protected)      |
| PUT    | `/api/jobs/:id`       | Update job (protected)   |
| DELETE | `/api/jobs/:id`       | Delete job (protected)   |
| GET    | `/api/jobs/sources`   | List job sources         |
| GET    | `/api/applications`   | List applications        |
| POST   | `/api/applications`   | Create application       |
| GET    | `/api/applications/:id` | Get application        |
| PUT    | `/api/applications/:id` | Update application     |
| DELETE | `/api/applications/:id` | Delete application     |
| GET    | `/api/dashboard/stats`| Dashboard statistics     |

## Data Models

**Job sources:** LinkedIn, Indeed, JobStreet, Glassdoor, Company Website, Referral, Other

**Application statuses:** Saved, Applied, Interview, Offer, Rejected, Withdrawn

## License

ISC
