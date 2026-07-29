FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS development

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY scripts ./scripts
COPY src ./src

ENV DATABASE_URL="postgresql://user:password@localhost:5432/database"

RUN pnpm prisma generate

EXPOSE 4000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm dev"]

FROM base AS builder

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY scripts ./scripts
COPY src ./src

ENV DATABASE_URL="postgresql://user:password@localhost:5432/database"

RUN pnpm prisma generate
RUN pnpm build

FROM builder AS runner

EXPOSE 4000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]
