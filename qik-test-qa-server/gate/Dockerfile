FROM oven/bun:1.3 AS deps

WORKDIR /app
COPY gate/package.json gate/bun.lock* ./
RUN bun install --frozen-lockfile

FROM deps AS build

ARG SERVICE_NAME

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY gate/libs ./libs
COPY gate/tsconfig*.json gate/nest-cli.json ./

COPY gate/apps/$SERVICE_NAME ./apps/$SERVICE_NAME

RUN if [ -n "$SERVICE_NAME" ]; then \
      echo "🚀 Building $SERVICE_NAME" && \
        bun run build $SERVICE_NAME || (echo "Build failed for $SERVICE_NAME" && exit 1); \
    else \
      echo "❌ SERVICE_NAME is not set" >&2 && exit 1; \
    fi

FROM oven/bun:1.3-slim AS runtime

ARG SERVICE_NAME
ARG ENVIRONMENT

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist/apps/$SERVICE_NAME ./dist/apps/$SERVICE_NAME

COPY envs/${ENVIRONMENT} ./envs/${ENVIRONMENT}

ENV SERVICE_NAME=$SERVICE_NAME
ENV ENVIRONMENT=$ENVIRONMENT

CMD ["sh", "-c", "bun run dist/apps/$SERVICE_NAME/main.js"]