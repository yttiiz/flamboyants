# Dockerfile
FROM denoland/deno:latest
EXPOSE 3000

WORKDIR /app
USER deno

COPY server/dependencies/deps.ts .
RUN deno cache deps.ts
COPY . .

RUN deno cache main.ts

ENV HOST=127.0.0.1
ENV PORT=3000