# Stage 1 - build the app
FROM oven/bun:1@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS build

WORKDIR /app

# Copy package-related files first
COPY package.json bun.lockb bunfig.toml ./

# Install dependencies
RUN bun install --frozen-lockfile --network-concurrency=4 --no-progress

# Copy the rest of the application files
COPY . .

RUN bun run build

# Stage 2 - run the app
FROM node:24.22.2-alpine@sha256:a34ab6d7f6f4813f4d0c5469d74685604b962fbdbf5793a7bc7b4998ecb867c8 AS run

# Install wget 
RUN apk add --no-cache wget


WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/svelte.config.js ./svelte.config.js
COPY --from=build /app/build ./build

EXPOSE 3000
ENTRYPOINT ["node", "./build"]
