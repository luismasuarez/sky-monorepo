---

name: domain-aware-commit-writer
description: >
Ensures that after domain-relevant changes, the agent generates a commit
message using a domain-oriented commit format that explains what was changed,
why it was changed, and its business impact.

trigger: >
Activate this skill whenever the agent:

- Modifies business logic
- Fixes a bug affecting user behavior or business rules
- Introduces or changes domain workflows
- Alters validation rules, calculations, permissions, or policies
- Completes a task linked to a Kanban card or business requirement

rules:

- The agent MUST create a commit after completing qualifying changes.
- The commit message MUST use domain language, not implementation details.
- Code-level explanations are only allowed if they clarify business behavior.
- The agent MUST NOT generate generic commit messages such as:
  - "fix bug"
  - "update service"
  - "refactor code"
- If no business impact exists, the agent SHOULD explain why briefly.

commit_format:
header: "<type>(<context>): <short description>"
body_sections: - Motivation - Detail - Impact
optional_footer: "Refs"

types_allowed:

- feat
- fix
- improvement
- refactor
- chore
- docs

field_definitions:
type: >
The nature of the change (feature, fix, improvement, etc.).
context: >
The domain module or business area affected (e.g. billing, orders, inventory).
short_description: >
A concise, business-oriented summary of what changed.
Motivation: >
Why this change was necessary from a business or user perspective.
Detail: >
What was changed in terms of domain behavior or rules.
Impact: >
Which processes, modules, users, or reports are affected.
Refs: >
Optional references to tasks, tickets, RFCs, or Kanban cards.

output_example: |
feat(pedidos): Permitir reprogramación de entregas

Motivación:
Los usuarios necesitaban reagendar entregas para reducir incidencias logísticas.

Detalle:
Se añadió la posibilidad de cambiar la fecha de entrega respetando las reglas
de disponibilidad y validación del dominio de logística.

Impacto:
Afecta la asignación de repartidores y el cálculo de SLA.
El equipo de soporte debe estar informado.

Refs: #1423
