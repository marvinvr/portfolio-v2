# Stage 1 - build the app
FROM oven/bun:1 as build

WORKDIR /app

COPY . .

RUN bun install

RUN bun run build

# Stage 2 - run the app
FROM node:20-alpine as run

# Install wget
RUN apk update && apk add wget

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/svelte.config.js ./svelte.config.js

EXPOSE 3000
ENTRYPOINT ["node", "./build"]