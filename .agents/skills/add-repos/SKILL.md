````skill
---
name: add-repos
description: Guía práctica para agregar repos al monorepo (Bun workspaces + Turborepo). Use cuando se necesiten instrucciones paso a paso para importar repos, mantener historial con `git subtree`, o configurar workspaces y scripts.
---

# Skill: Agregar repos a monorepo

Este skill resume y expone de forma accionable la guía contenida en `docs/add-repos.md`.

## Cuándo usar

- Cuando quieras agregar un repo nuevo al monorepo (como `apps/*` o `packages/*`).
- Cuando quieras conservar historial usando `git subtree` o agregar el contenido sin historial.
- Cuando necesites los comandos listos para copiar para limpiar lockfiles y actualizar workspaces.

## Resumen rápido

- Opción recomendada: importar con historial usando `git remote` + `git subtree add --prefix=...`.
- Opción rápida: copiar el contenido dentro de la carpeta destino y eliminar lockfiles.
- Asegúrate de que la carpeta destino tenga un `package.json` con `name` y scripts (ej. `dev`, `build`).

## Comandos útiles

Agregar remote y traer el repo remoto (reemplazar `<alias>` y `<REPO_URL>`):

```
git remote add <alias> <REPO_URL>
git fetch <alias> --tags
```

Importar con historial (recomendada). Reemplazar `<prefix>` por la ruta destino dentro del monorepo (ej. `apps/ms-users` o `packages/ui`) y `<branch>` por la rama adecuada (ej. `main`):

```
git subtree add --prefix=<prefix> <alias> <branch>
```

Eliminar lockfiles viejos dentro de la carpeta destino (reemplazar `<prefix>`):

```
rm -f <prefix>/package-lock.json <prefix>/pnpm-lock.yaml <prefix>/yarn.lock
```

Instalar dependencias desde el root (Bun):

```

```

Ejecutar solo ese workspace con Turbo (reemplazar `<package-name>` por el `name` del package importado):

```
bunx turbo run dev --filter=<package-name>
```

Actualizar un subtree importado (traer cambios del remote):

```
git fetch <alias> --tags
git subtree pull --prefix=<prefix> <alias> <branch>
```
## Recomendaciones de estructura

- `apps/` = microservicios y apps ejecutables
- `packages/` = librerías internas y contratos
- Cada workspace debe tener `package.json` y un `name` único
- Añade patrones adicionales a `workspaces` en el root `package.json` si usas rutas distintas

## Referencia

Fuente completa: `docs/add-repos.md`

## Ejemplos de prompts que disparan este skill

- "¿Cómo agrego un repo ms-users al monorepo conservando historial?"
- "Dame los pasos para importar un repo y limpiar lockfiles para Bun"

````
