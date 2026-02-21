Aquí va una **mini-guía práctica** para **agregar más repos** a tu monorepo (Bun workspaces + Turborepo), con **dos formas**: con historial (recomendada) o sin historial. Incluye comandos listos para copiar.

---

## Antes: regla mental

* **Cada repo nuevo** normalmente entra como **una app** (`apps/*`) o como **un paquete** compartido (`packages/*`).

  * `apps/` = cosas que se ejecutan (web, api, worker, microservicio)
  * `packages/` = librerías internas (contracts, ui kit, config, sdk)

---

# Opción 1 (recomendada): agregar repos con historial usando `git subtree`

### 1) Decide dónde va

Ejemplos:

* Microservicio `ms-users` → `apps/ms-users`
* Worker `jobs` → `apps/worker-jobs`
* UI kit compartido → `packages/ui`
* SDK interno → `packages/sdk`

Crea la carpeta destino:

```bash
mkdir -p apps/ms-users
# o
mkdir -p packages/ui
```

### 2) Agrega el remote y trae el repo

Reemplaza `REPO_URL` y `main` si tu rama es `master`:

```bash
git remote add ms_users REPO_URL
git fetch ms_users --tags
```

### 3) Importa dentro de la carpeta (con historial)

```bash
git subtree add --prefix=apps/ms-users ms_users main
```

> Ya está adentro. Lo “mejor” de subtree es que conserva el historial del repo importado y te permite actualizarlo después.

### 4) Limpia lockfiles viejos dentro de esa app (para unificar con Bun)

```bash
rm -f apps/ms-users/package-lock.json apps/ms-users/pnpm-lock.yaml apps/ms-users/yarn.lock
```

### 5) Asegura `name` + scripts en el `package.json` del repo importado

Turbo corre tareas si existen scripts en ese workspace.

Ejemplo mínimo recomendado:

```json
{
  "name": "@repo/ms-users",
  "private": true,
  "scripts": {
    "dev": "...",
    "build": "...",
    "lint": "...",
    "typecheck": "..."
  }
}
```

### 6) Instala todo desde el root

```bash
bun install
```

### 7) Prueba correr todo o solo ese paquete

```bash
bun run dev
# o solo ese
bunx turbo run dev --filter=@repo/ms-users
```

---

## Actualizar un repo que agregaste por subtree (pull de cambios)

Si ese repo sigue vivo aparte y quieres traer cambios nuevos:

```bash
git fetch ms_users --tags
git subtree pull --prefix=apps/ms-users ms_users main
```

> Esto es súper útil si todavía hay gente trabajando en el repo original por un tiempo.

---

# Opción 2 (más simple): agregar repos sin historial (copiar/pegar)

Si no te importa mantener historial:

1. Clona el repo en otro lado o usa el que tienes local.
2. Copia su contenido dentro de la carpeta destino:

```bash
mkdir -p apps/ms-users
cp -R /ruta/al/repo-ms-users/* apps/ms-users/
```

3. Borra lockfiles viejos y reinstala:

```bash
rm -f apps/ms-users/package-lock.json apps/ms-users/pnpm-lock.yaml apps/ms-users/yarn.lock
bun install
```

---

# ¿Cómo decide Turborepo qué “apps” existen?

No por el nombre de la carpeta.
Turbo se entera por:

1. **Workspaces de Bun** en el `package.json` root (`apps/*`, `packages/*`)
2. Cada carpeta debe tener `package.json`
3. Turbo corre una tarea si el package tiene script con ese nombre (ej `dev`, `build`)

---

# Patrón recomendado para un repo nuevo

### Si es un microservicio / api

* `apps/ms-xyz`
* depende de `packages/contracts`
* scripts `dev/build/typecheck/lint`

### Si es shared code

* `packages/something`
* exporta cosas compartidas (tipos, utils, ui)
* lo consumes con `"workspace:*"`

---

# Checklist rápido cuando agregas repos (para que no explote)

* [ ] Está dentro de `apps/*` o `packages/*` (o actualizaste `workspaces`)
* [ ] Tiene `package.json`
* [ ] Tiene `"name": "@repo/..."` único
* [ ] Tiene scripts `dev/build/...` (si quieres que Turbo los ejecute)
* [ ] Eliminaste lockfiles viejos del subrepo
* [ ] `bun install` desde el root crea/actualiza `bun.lockb`
* [ ] Si comparte código: depende de `@repo/contracts` con `"workspace:*"`

---

## Extra: si quieres meter repos en otra ruta (no apps/packages)

Solo añade el patrón al root `package.json`:

```json
"workspaces": ["apps/*", "packages/*", "services/*"]
```

Y listo. Bun los incluye como workspace.

---

Si me dices **qué repos quieres agregar** (ej: `ms-users`, `ms-catalog`, `admin`, `mobile`, `ui-kit`) y qué stack usan (Nest/Vite/Next/Expo), te devuelvo:

* dónde poner cada uno,
* los scripts exactos por `package.json`,
* y un `turbo.json` afinado para tu mezcla.
