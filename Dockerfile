# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.0.4 as builder
WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY package.json bun.lockb src/ ./

RUN bun install --no-cache
RUN bun build app.ts --compile --outfile matrixPush  

FROM oven/bun:1.0.4-slim
WORKDIR /app
COPY --from=builder --chmod=0755 /usr/src/app/matrixPush bin
ENTRYPOINT [ "/app/bin" ]
