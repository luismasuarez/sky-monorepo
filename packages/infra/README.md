# Infra — Servicios locales


Breve guía para levantar los servicios compartidos del monorepo (DB, RabbitMQ, MinIO, etc.).

Requisitos
- Tener Docker y Docker Compose instalados.
- Copiar el archivo de ejemplo de variables y ajustar valores:

```bash
cp ../../.env.example .env
```

También puedes copiar el ejemplo a la raíz del repo si prefieres centralizar las variables:

```bash
cp .env.example ../.env
```

Comandos (desde la raíz del repo)

```bash
# usando npm/yarn/bun (scripts en package.json raíz)
npm run services:up
npm run services:down
npm run services:build
npm run services:logs

# o directamente docker compose
docker compose -f packages/infra/docker-compose.yml up -d
docker compose -f packages/infra/docker-compose.yml down
```

Comandos (desde el paquete)

```bash
# ejecutar los scripts del paquete infra
npm --prefix packages/infra run services:up
npm --prefix packages/infra run services:down
```

Usando Turbo

```bash
# si usas turbo (configurado en turbo.json)
bunx turbo run services:up
bunx turbo run services:down
```

Notas
- Si el `docker-compose.yml` hace referencia a variables de entorno, coloca un `.env` en la raíz y referencia con `env_file:` o copia un `.env.example` a `.env`.
- Revisa `packages/infra/docker-compose.yml` para puertos y servicios exportados para que `apps/gateway` y `services/ms_nestjs-template` los usen.
- Si quieres, puedo añadir un archivo `.env.example` aquí o ajustar el `docker-compose.yml` para usar rutas relativas al repo.

Soporte
- Para problemas concretos con el compose (puertos en uso, permisos, variables), dime el error y lo reviso.
