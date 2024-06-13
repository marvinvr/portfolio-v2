FROM oven/bun:1

RUN apt-get update && apt-get install -y wget

COPY . .

RUN bun install

RUN bun run build

EXPOSE 3000
ENTRYPOINT [ "bun", "./build" ]