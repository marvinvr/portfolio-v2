FROM oven/bun:1


COPY . .
RUN ls -la

RUN bun install

RUN bun run build

RUN ls -la
EXPOSE 3000
ENTRYPOINT [ "bun", "./build" ]