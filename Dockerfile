# Stage 1: Build
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Set DATABASE_URL for Prisma generate
# Variables de build-time (pueden ser sobreescritas por Dokploy)
ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

# Copy package.json and pnpm-lock.yaml first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN apk add --no-cache wget && npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile
# Copiar el resto del código

COPY . .

RUN npx prisma generate

# Build the application
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS production

# Install pnpm and wget (needed for healthcheck)
RUN apk add --no-cache wget && npm install -g pnpm

# Establecer directorio de trabajo
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios desde el builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy node_modules and dist from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/scripts ./scripts
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Cambiar a usuario no-root
USER nextjs

# Etiquetas
LABEL maintainer="Luisma Suarez <luismasuarez@github.com>" \
      version="1.0.0" \
      description="Aplicación Next.js para administración de dokkao-app" \
      org.opencontainers.image.source="https://github.com/luismasuarez/dokkao-app"

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]