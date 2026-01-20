# Kanban: Migración y Checklist de Funcionalidad

## Contexto de lo ya implementado

- Drag & drop funcional y tipado para mover tareas entre columnas usando hooks y contexto propio (`lib/drag-and-drop/`).
- Estado local de columnas y tarjetas en el board, con lógica para mover tareas entre columnas.
- Renderizado de tarjetas y columnas con el estilo visual del proyecto.
- Contexto global de drag & drop reutilizable y desacoplado de librerías externas.
- Estructura de tipos alineada a backend y frontend (`lib/kanban-types.ts`).

## Checklist de funcionalidades pendientes

### UX/UI y lógica de interacción

- [x] Confirmación visual y lógica para eliminar tareas (modal y zona de drop para eliminar).
  - Implementado: zona de eliminación inferior con feedback visual y modal de confirmación, lógica drag & drop mejorada y modularizada.
- [x] Confirmación visual y lógica para mover tareas (por ejemplo, entre boards o equipos).
  - Implementado: feedback visual y modal de confirmación para mover tareas desde la columna "done".
- [~] Seguimiento de tiempo por tarea (pausar, reanudar, overtime, notificaciones).
  - En progreso: helpers de tiempo y UI/UX de time tracking en tarjetas Kanban, replicando y mejorando la lógica original.
- [ ] Modales para crear y editar tareas (formulario con validación).
- [ ] Skeletons de carga para columnas y tarjetas.
- [ ] Feedback visual avanzado: highlight de drop targets, animaciones, etc.

### Estado y persistencia

- [ ] Centralizar el estado y lógica de negocio en hooks (como `use-kanban-data`).
- [ ] Integrar persistencia local (IndexedDB/Dexie) o API (repositorios).
- [ ] Sincronización y actualización reactiva de datos.

### Utilidades y helpers

- [~] Helpers de tiempo y notificaciones.
  - En progreso: helpers para formateo y manejo de tiempo de tareas, integración con UI de tarjetas.
- [ ] Utilidades para manipulación de datos y formateo.

---

> Continúa este checklist en un nuevo chat para avanzar con la migración y mejoras del tablero Kanban.
