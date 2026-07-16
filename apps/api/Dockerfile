# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.12.4 --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY database ./database
COPY apps/api ./apps/api
RUN pnpm install --frozen-lockfile --filter @medease/api...
RUN pnpm --filter @medease/database run generate
RUN pnpm --filter @medease/api... run build
RUN pnpm deploy --filter @medease/api --prod /prod/api

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S medease && adduser -S medease -G medease
COPY --from=build /prod/api ./
USER medease
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/main.js"]
