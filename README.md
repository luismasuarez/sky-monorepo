# Sky Monorepo

**Resumen**
- Repositorio monorepo para proyectos NestJS y microservicios. Contiene una aplicación `gateway` (API/Nest) y una plantilla de servicio (`ms_nestjs-template`) junto con paquetes compartidos y contratos.

**Estructura**
- `apps/` : aplicaciones (por ejemplo `gateway`).
- `services/` : microservicios reutilizables (por ejemplo `ms_nestjs-template`).
- `packages/` : paquetes compartidos y contratos.
- `docs/` : documentación auxiliar.

**Requisitos**
- Node.js o Bun (el `package.json` indica `bun@1.3.7`).
- Git.
- Docker (opcional, para servicios locales como bases de datos o MinIO).

**Instalación**
1. Clonar el repositorio:

```bash
git clone <repo-url>
cd sky-monorepo
```

2. Instalar dependencias (usa tu gestor preferido).

Con Bun:

```bash
bun install
```

Con npm (alternativa):

```bash
npm install
```

3. Generar artefactos de Prisma (si usas Prisma):

```bash
bunx turbo run prisma:generate
```

**Comandos útiles (raíz)**
- `dev` : ejecuta `turbo run dev` para desarrollo en todos los paquetes.
- `build` : ejecuta `turbo run build`.
- `lint` : ejecuta `turbo run lint`.
- `typecheck` : ejecuta `turbo run typecheck`.
- `backend` : ejecuta solo `@repo/gateway` en modo desarrollo.
- `template` : ejecuta solo `@repo/ms-nestjs-template` en modo desarrollo.

Ejecutar individualmente (ejemplo `gateway`):

```bash
bunx turbo run dev --filter=@repo/gateway
```

**Prisma / Base de datos**
- Dentro de cada paquete que use Prisma encontrarás un directorio `prisma/` con `schema.prisma` y scripts de migración.
- Sigue los pasos de ese paquete para configurar la conexión (variables de entorno) y ejecutar migraciones.

**Servicios auxiliares**
- El proyecto incluye ejemplos y utilidades para MinIO, RabbitMQ y otros. Revisa `apps/gateway/src/shared` y `services/*/src/shared`.

**Tests**
- Ejecuta los tests desde los paquetes individuales usando `turbo run test` o el script de test del paquete.

**Contribuir**
- Abre issues y pull requests. Sigue las convenciones existentes en los paquetes para lint, formateo y pruebas.

**Licencia**
- Revisa los archivos `LICENSE` presentes en los servicios/paquetes.

---
Si quieres, puedo: añadir badges, detallar configuración de Docker/MinIO, o generar ejemplos de variables de entorno para `gateway` y los servicios.
