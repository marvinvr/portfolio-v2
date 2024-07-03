# Stage 1 - build the app
FROM oven/bun:1 as build

WORKDIR /app

# Copy package-related files first
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application files
COPY . .

RUN bun install

RUN bun run build

# Stage 2 - run the app
FROM oven/bun:1 as run

# Install wget 
RUN apt-get update && apt-get install -y wget

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/svelte.config.js ./svelte.config.js
COPY --from=build /app/build ./build

EXPOSE 3000
ENTRYPOINT ["bun", "./build"]