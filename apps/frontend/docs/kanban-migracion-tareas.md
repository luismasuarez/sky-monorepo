# Kanban: Migración y Checklist de Funcionalidad (Actualizado 2026)

## Contexto de lo ya implementado

- Drag & drop funcional y tipado para mover tareas entre columnas usando hooks y contexto propio (`lib/drag-and-drop/`).
- Estado local de columnas y tarjetas en el board, con lógica para mover tareas entre columnas.
- Renderizado de tarjetas y columnas con el estilo visual del proyecto.
- Contexto global de drag & drop reutilizable y desacoplado de librerías externas.
- Estructura de tipos alineada a backend y frontend (`lib/kanban-types.ts`).

## Consideraciones de migración

- **Solo se migrará la UI/UX** del kanban original (`example/kanban`), adaptando componentes y flujos a las buenas prácticas y patrones de este proyecto (estructura de carpetas, hooks, tipado, atomicidad, etc).
- **La lógica de persistencia y manipulación de datos** se implementará usando Prisma y la base de datos definida en `prisma/schema.prisma`, eliminando dependencias de Dexie/IndexedDB.
- Se migrarán y adaptarán los flujos de drag & drop, manejo de tiempo, y formularios, pero centralizando la lógica en hooks y servicios alineados a la arquitectura actual.

## Checklist de migración y tareas a realizar

### UX/UI y lógica de interacción

- [x] Drag & drop funcional y tipado para mover tareas entre columnas (adaptar UI/UX original, centralizar lógica en hooks y servicios).
- [x] Confirmación visual y lógica para eliminar tareas (modal y zona de drop para eliminar).
- [x] Confirmación visual y lógica para mover tareas (por ejemplo, entre boards o equipos).
- [~] Seguimiento de tiempo por tarea (pausar, reanudar, overtime, notificaciones). Integrar UI/UX original, pero lógica y persistencia con Prisma.
- [ ] Modales para crear y editar tareas (formulario con validación, persistencia en base de datos).
- [ ] Skeletons de carga para columnas y tarjetas (integrar en flujo de carga real).
- [ ] Feedback visual avanzado: highlight de drop targets, animaciones, etc.

### Estado y persistencia (ahora solo con Prisma)

- [ ] Centralizar el estado y lógica de negocio en hooks (como `use-kanban-data`), desacoplando UI de la lógica.
- [ ] Implementar persistencia y manipulación de datos usando Prisma Client y la base de datos (ver `prisma/schema.prisma`).
- [ ] Sincronización y actualización reactiva de datos tras operaciones (optimistic UI, SWR/react-query, etc).

### Utilidades y helpers

- [~] Helpers de tiempo y notificaciones (adaptar helpers originales, pero integrados a la lógica de backend y frontend actual).
- [ ] Utilidades para manipulación y formateo de datos (migrar solo lo necesario del original, siguiendo patrones del proyecto).

---

## Tareas específicas a realizar

1. Migrar y adaptar los componentes de UI/UX del kanban original, asegurando consistencia visual y de interacción.
2. Reescribir la lógica de manipulación de tareas (crear, editar, mover, eliminar) para que use Prisma Client y la base de datos.
3. Centralizar el estado y lógica de negocio en hooks y servicios reutilizables.
4. Integrar el seguimiento de tiempo por tarea usando los campos y lógica definidos en el modelo Task de Prisma.
5. Implementar skeletons de carga y feedback visual avanzado en el board.
6. Migrar helpers de tiempo y utilidades, adaptando a la nueva arquitectura.
7. Eliminar dependencias y lógica de Dexie/IndexedDB.
8. Validar la sincronización y actualización reactiva de datos en la UI.

---

> Continúa este checklist en un nuevo chat para avanzar con la migración y mejoras del tablero Kanban.

---

> Continúa este checklist en un nuevo chat para avanzar con la migración y mejoras del tablero Kanban.
