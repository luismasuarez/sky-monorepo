# ---------------------------
# Builder Stage
# ---------------------------
FROM node:20-alpine AS builder

# Build-time arguments
ARG DATABASE_URL
ARG RABBITMQ_URL

# Environment variables for Prisma
ENV DATABASE_URL=${DATABASE_URL}
ENV RABBITMQ_URL=${RABBITMQ_URL}

# Use npm for installs inside the image

# Set working directory
WORKDIR /app

# Copy package files first to leverage caching (package-lock optional)
COPY package*.json ./

# Install dependencies with npm
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app using npm
RUN npm run build

# ---------------------------
# Production Stage
# ---------------------------
FROM node:20-alpine AS production

# Install dependencies needed for bootstrap
RUN apk add --no-cache bash wget postgresql-client

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy build artifacts and node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/shared/prisma ./src/shared/prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY package.json ./

# Copy entrypoint script for DB bootstrap & migrations
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Switch to non-root user
USER nestjs

# Entrypoint runs bootstrap script
ENTRYPOINT ["./docker-entrypoint.sh"]