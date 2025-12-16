FROM oven/bun:1.3 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:1.3-slim AS runtime
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

EXPOSE 3000
CMD ["bun", "run", "start"]