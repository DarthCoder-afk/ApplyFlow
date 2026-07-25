FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
COPY prisma.config.ts ./

ENV DATABASE_URL="postgresql://user:password@localhost:5432/database"

RUN pnpm prisma generate

COPY tsconfig.json ./
COPY src ./src

RUN pnpm build

EXPOSE 4000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]
