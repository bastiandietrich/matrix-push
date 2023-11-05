# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.0.4-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY package.json bun.lockb src/ ./

RUN bun install --no-cache --frozen-lockfile -p

ENTRYPOINT [ "bun", "app.ts" ]
