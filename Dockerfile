FROM oven/bun:1

COPY . .

RUN bun install

RUN bun run build

EXPOSE 3000
ENTRYPOINT [ "bun", "./build" ]