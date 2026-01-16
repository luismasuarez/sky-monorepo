# Prisma Schema Example

Este archivo contiene el schema básico de Prisma. Reemplázalo con tus propios modelos.

## Ejemplo de modelos básicos

```prisma
// model User {
//   id        String   @id @default(cuid())
//   email     String   @unique
//   name      String?
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
```

## Comandos útiles

```bash
# Crear una migración
pnpm prisma:migrate

# Generar el cliente
pnpm prisma:generate

# Abrir Prisma Studio
pnpm prisma:studio
```
