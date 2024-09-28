FROM node:20.17.0-alpine AS base

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN corepack enable pnpm && \
    pnpm i --frozen-lockfile --ignore-scripts

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN corepack enable pnpm && \
    pnpm run build && \
    pnpm prune --prod --no-optional && \
    rm -rf ./**/*/src

FROM base AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next && \
    chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ARG HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]