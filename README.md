# ApplyFlow

A full-stack job application tracker that helps you manage your job search in one place — save roles, track application status, and monitor progress from a dashboard instead of juggling spreadsheets.

## Features

- **Authentication** — Register, log in, and manage sessions with JWT access and refresh tokens
- **Profile management** — Maintain separate name fields, contact details, a professional headline, location, and HTTPS portfolio/social links
- **Profile pictures** — Upload, replace, or remove a Cloudinary-hosted avatar with local preview, initials fallback, file validation, rate limiting, and upload-abuse protection
- **Jobs** — Save job postings with title, company, location, source, URL, description, and notes; long descriptions stay contained in a scrollable detail card for easier reading
- **Applications** — Link applications to jobs and track status through the pipeline (Saved → Applied → Interview → Offer, etc.)
- **Calendar** — Browse application submissions, scheduled interview stages, and offers in a monthly view with upcoming events, color-coded categories, and month navigation
- **Dashboard** — View totals, active applications, status breakdown chart, and recent activity
- **Search & filtering** — Search jobs and applications with loading skeletons for a smooth UX
- **Automated testing** — Jest coverage for backend routes, controllers, services, schemas, and utilities, plus Vitest coverage for frontend profile behavior
- **Landing page** — Marketing homepage with feature highlights and auth entry points

## Tech Stack

| Layer    | Technologies                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, React Hook Form, Zod, Recharts, GSAP, shadcn/ui, Vitest |
| Backend  | Node.js, Express 5, TypeScript, Prisma, PostgreSQL, Zod, JWT, bcrypt, Multer, Cloudinary, express-rate-limit              |
| Database | PostgreSQL 17 (via Docker Compose)                                                                                        |
| Media    | Cloudinary (profile pictures only)                                                                                        |

## Project Structure

```
ApplyFlow/
├── frontend/          # Next.js app (port 3000)
│   ├── src/app/       # App Router pages (landing, auth, dashboard, profile, jobs, applications, calendar)
│   ├── src/components/
│   └── lib/           # API clients, types, validation schemas
├── backend/           # Express API (port 4000)
│   ├── src/modules/   # auth, profile, cloudinary, jobs, applications, calendar, dashboard
│   └── prisma/        # Schema and migrations
└── docker-compose.yml # Frontend, API, and PostgreSQL
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) (recommended — lockfiles are included)
- [Docker](https://www.docker.com/) (for PostgreSQL)
- A [Cloudinary](https://cloudinary.com/) account for profile-picture uploads

## Getting Started

### Run the complete application with Docker

```bash
docker compose up --build
```

This starts the frontend at http://localhost:3000, API at http://localhost:4000, and PostgreSQL on port `5432`. The API runs database migrations automatically after PostgreSQL is healthy.

Docker Compose loads backend secrets, including Cloudinary credentials, from
`backend/.env`. Compose overrides `DATABASE_URL` so the API connects to the
PostgreSQL container instead of `localhost`.

For detached mode:

```bash
docker compose up --build -d
```

### Automatically refresh Docker services while developing

After the initial image build, run Compose Watch instead of rebuilding manually:

```bash
docker compose watch
```

It syncs application-source changes into the development containers: Next.js refreshes
the frontend and the API restarts with its TypeScript watcher. Changes to package files,
lockfiles, or TypeScript configuration rebuild only the affected development image.
Dependency folders and build output are ignored.
Use `Ctrl+C` to stop watching. Compose Watch requires Docker Compose 2.22 or newer.

Stop the stack with `docker compose down`. Add `-v` only when you also want to delete the local database volume.

PostgreSQL uses:

- **Database:** `applyflow`
- **User:** `postgres`
- **Password:** `postgres`

### Run services locally (alternative)

Start only PostgreSQL:

```bash
docker compose up -d postgres
```

Then configure environment variables and run the frontend/backend as described below.

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
FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_AVATAR_FOLDER=applyflow/avatars
```

`CLOUDINARY_API_SECRET` is backend-only. Never add it to `frontend/.env.local`
or expose it with a `NEXT_PUBLIC_` prefix.

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
pnpm exec prisma migrate dev
```

Use `pnpm exec prisma migrate deploy` for staging and production. Never run a
development reset against the production Neon database.

The profile migration keeps the legacy `name` column temporarily. Existing
multi-part names are backfilled using the final whitespace-delimited token as
`lastName`; one-word or blank legacy names receive a reviewable fallback.
Review migrated users before removing the old column in a later migration.

### 5. Run the development servers

In separate terminals:

```bash
# Backend (http://localhost:4000)
cd backend && pnpm dev

# Frontend (http://localhost:3000)
cd frontend && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. Register an account, then use the dashboard, profile, jobs, applications, and calendar pages.

## Scripts

### Backend (`backend/`)

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Start API with hot reload     |
| `pnpm build`      | Compile TypeScript to `dist/` |
| `pnpm start`      | Run compiled production build |
| `pnpm test`       | Run the Jest test suite       |
| `pnpm test:watch` | Run tests in watch mode       |

### Frontend (`frontend/`)

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start Next.js dev server |
| `pnpm build` | Create production build  |
| `pnpm start` | Serve production build   |
| `pnpm lint`  | Run ESLint               |
| `pnpm test`  | Run the Vitest suite     |

## API Overview

All API routes are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

| Method | Endpoint                                             | Description                                                               |
| ------ | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/health`                                        | API health check                                                          |
| GET    | `/api/health/db`                                     | Database health check                                                     |
| POST   | `/api/auth/register`                                 | Create account                                                            |
| POST   | `/api/auth/login`                                    | Log in                                                                    |
| POST   | `/api/auth/refresh`                                  | Refresh access token                                                      |
| POST   | `/api/auth/logout`                                   | Log out                                                                   |
| GET    | `/api/auth/me`                                       | Current user (protected)                                                  |
| GET    | `/api/profile`                                       | Get the current profile (protected)                                       |
| PATCH  | `/api/profile`                                       | Update allowed profile fields (protected)                                 |
| POST   | `/api/profile/avatar`                                | Upload or replace the current avatar (protected, multipart)               |
| DELETE | `/api/profile/avatar`                                | Remove the current avatar (protected)                                     |
| GET    | `/api/jobs`                                          | List jobs (protected)                                                     |
| POST   | `/api/jobs`                                          | Create job (protected)                                                    |
| GET    | `/api/jobs/:id`                                      | Get job (protected)                                                       |
| PUT    | `/api/jobs/:id`                                      | Update job (protected)                                                    |
| DELETE | `/api/jobs/:id`                                      | Delete job (protected)                                                    |
| GET    | `/api/jobs/sources`                                  | List job sources                                                          |
| GET    | `/api/applications`                                  | List applications                                                         |
| POST   | `/api/applications`                                  | Create application                                                        |
| GET    | `/api/applications/:id`                              | Get application                                                           |
| PUT    | `/api/applications/:id`                              | Update application                                                        |
| DELETE | `/api/applications/:id`                              | Delete application                                                        |
| GET    | `/api/calendar/events?from=<ISO-8601>&to=<ISO-8601>` | List application, interview, and offer events in a date range (protected) |
| GET    | `/api/dashboard/stats`                               | Dashboard statistics                                                      |

## Data Models

**User profile fields:** first name, middle name, last name, suffix, headline,
phone, location, avatar URL, private avatar public ID, LinkedIn URL, GitHub URL,
and portfolio URL.

**Job sources:** LinkedIn, Indeed, JobStreet, Glassdoor, Company Website, Referral, Other

**Application statuses:** Saved, Applied, Interview, Offer, Rejected, Withdrawn

## License

ISC
