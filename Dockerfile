# Stage 1 - build the app
FROM oven/bun:1@sha256:3aa040e5445efa09d75bb428a64ba50db13e2b3ac9b6b0c7f145615f62b2ee18 AS build

WORKDIR /app

# Copy package-related files first
COPY package.json bun.lockb bunfig.toml ./

# Install dependencies
RUN bun install --frozen-lockfile --network-concurrency=4 --no-progress

# Copy the rest of the application files
COPY . .

RUN bun run build

# Stage 2 - run the app
FROM node:24.22.3-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS run

# Install wget 
RUN apk add --no-cache wget


WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/svelte.config.js ./svelte.config.js
COPY --from=build /app/build ./build

EXPOSE 3000
ENTRYPOINT ["node", "./build"]
