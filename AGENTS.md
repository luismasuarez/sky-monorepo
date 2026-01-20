# AGENTS.md

## Repository Guidelines

Este repositorio utiliza agentes y skills documentados en `.github/agents` y `.github/skills`.

---

## Agentes Disponibles

| Agente                       | Descripción                     | Archivo                                                                                      |
| ---------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| `nextjs-architecture-expert` | Experto en arquitectura Next.js | [.github/agents/nextjs-architecture-expert.md](.github/agents/nextjs-architecture-expert.md) |

---

## Skills Disponibles

| Skill                  | Descripción breve (si aplica) | Archivo                                                                                      |
| ---------------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `authjs-skills`        | Skills para Auth.js           | [.github/skills/authjs-skills/SKILL.md](.github/skills/authjs-skills/SKILL.md)               |
| `prisma-orm-v7-skills` | Skills para Prisma ORM v7     | [.github/skills/prisma-orm-v7-skills/SKILL.md](.github/skills/prisma-orm-v7-skills/SKILL.md) |
| `react-19`             | Skills para React 19          | [.github/skills/react-19/SKILL.md](.github/skills/react-19/SKILL.md)                         |
| `react-best-practices` | Mejores prácticas de React    | [.github/skills/react-best-practices/SKILL.md](.github/skills/react-best-practices/SKILL.md) |
| `senior-frontend`      | Skills avanzados de frontend  | [.github/skills/senior-frontend/SKILL.md](.github/skills/senior-frontend/SKILL.md)           |
| `tailwind-4`           | Skills para Tailwind CSS v4   | [.github/skills/tailwind-4/SKILL.md](.github/skills/tailwind-4/SKILL.md)                     |
| `zod-4`                | Skills para Zod v4            | [.github/skills/zod-4/SKILL.md](.github/skills/zod-4/SKILL.md)                               |
| `zustand-5`            | Skills para Zustand v5        | [.github/skills/zustand-5/SKILL.md](.github/skills/zustand-5/SKILL.md)                       |

---

## Notas

- Para detalles y patrones de uso, revisa cada archivo `SKILL.md` correspondiente.
- Si agregas un nuevo skill, crea su carpeta y archivo `SKILL.md` bajo `.github/skills/`.
- Si agregas un nuevo agente, documenta su propósito en `.github/agents/`.

---

## Commit & Pull Request Guidelines

Sigue el estilo de commit convencional: `<type>[scope]: <description>`

**Tipos sugeridos:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

Antes de crear un Pull Request:

1. Completa el checklist en `.github/pull_request_template.md` (si existe).
2. Ejecuta los tests y linters relevantes.
3. Adjunta capturas de pantalla para cambios en UI (si aplica).

---
