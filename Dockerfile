FROM oven/bun:1

COPY . .

RUN bun install

RUN bun run build

ENTRYPOINT [ "bun", "./build" ]