#!/bin/bash
set -e

# -----------------------------
# Configuración de retry
# -----------------------------
DB_HOST=${POSTGRES_HOST:-postgres}
DB_PORT=${POSTGRES_PORT:-5432}
DB_USER=${POSTGRES_USER:-postgres}
DB_NAME=${POSTGRES_DB:-postgres}
RETRIES=${DB_RETRIES:-10}
SLEEP_INTERVAL=${DB_SLEEP:-3}

echo "==== Esperando a que la base de datos esté lista ===="

count=0
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  count=$((count+1))
  if [ $count -ge $RETRIES ]; then
    echo "Error: La base de datos no respondió después de $RETRIES intentos."
    exit 1
  fi
  echo "DB no lista, reintentando en $SLEEP_INTERVAL segundos... ($count/$RETRIES)"
  sleep $SLEEP_INTERVAL
done

echo "==== Base de datos lista ===="

# -----------------------------
# Ejecutar migraciones
# -----------------------------
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "==== Ejecutando migraciones Prisma ===="
  if npx prisma migrate deploy --schema=src/shared/prisma/schema.prisma; then
    echo "==== Migraciones ejecutadas correctamente ===="
  else
    echo "Error al ejecutar migraciones Prisma."
    exit 1
  fi
fi

# -----------------------------
# Arrancar microservicio
# -----------------------------
echo "==== Iniciando microservicio ===="
exec node dist/src/main