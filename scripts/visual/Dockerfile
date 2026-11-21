# Pin the browser, OS, architecture (in visual.mjs), and Bun for repeatable pixels.
FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS bun
FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:2f05f8a734509a7b3f26a912639488ee08f58a7b292d14d62271bcff9038768f

COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s /usr/local/bin/bun /usr/local/bin/bunx
WORKDIR /app
COPY package.json bun.lockb bunfig.toml ./
RUN bun install --frozen-lockfile --network-concurrency=4 --no-progress
COPY src ./src
COPY static ./static
COPY svelte.config.js vite.config.ts tsconfig.json postcss.config.js tailwind.config.js ./
COPY scripts/visual/fixed-clock.cjs ./scripts/visual/fixed-clock.cjs
# Same production build command, but with a fixed server/prerender clock.
RUN TZ=UTC PUBLIC_ENVIRONMENT=local NODE_OPTIONS=--require=/app/scripts/visual/fixed-clock.cjs bun run build

COPY scripts/visual ./scripts/visual

ENV TZ=UTC PUBLIC_ENVIRONMENT=local
ENTRYPOINT ["node", "scripts/visual/runner.mjs"]
