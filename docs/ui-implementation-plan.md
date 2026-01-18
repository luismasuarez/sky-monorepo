# Migración Tab Kanban: Instrucciones para el Siguiente Chat

## 1. Identificar componentes principales de Kanban

- Ubica el archivo legacy principal:  
 bookmark-dashboard.tsx
- Identifica los componentes de primer nivel usados para Kanban:
  - `KanbanBoard` (componente principal de la vista Kanban)
  - `AddTaskModal`, `EditTaskModal` (modales para tareas)
  - `AnimatedView` (gestiona visibilidad por tab)
  - Hooks: `useKanban` (solo para referencia de estructura de datos, no migrar lógica)

## 2. Identificar componentes de segundo nivel de Kanban

- Dentro de `KanbanBoard`, identifica subcomponentes y props principales:
  - Columnas (ToDo, In Progress, Done)
  - Tarjetas de tarea
  - Acciones sobre tareas (pausar, notificar, etc.)
  - Props: `kanbanData`, `onTogglePause`, `onNotifyOvertime`, etc.

## 3. Siguiente pasos para el nuevo chat

- Extraer la estructura de props y tipos de datos usados por `KanbanBoard` y subcomponentes.
- Definir los tipos/interfaces para los datos mock de Kanban, alineados a los modelos de Prisma.
- Crear mocks de datos para alimentar la UI.
- Implementar el componente Kanban en la nueva UI, usando solo datos mock y componentes modernos.
- Documentar en el plan los componentes y tipos identificados.

---

Con esto, el siguiente agente puede continuar extrayendo y adaptando la estructura de Kanban, asegurando una migración ordenada y alineada al plan.

# Plan de Implementación UI Modular para dokkap-app

## Metodología de Trabajo

La implementación de la nueva UI se realizará de manera incremental, abordando una sección a la vez (por ejemplo: Header, Sidebar, Dashboard Widgets, etc.). Al finalizar cada sección, se actualizará este documento con:

- Un resumen de las tareas realizadas en la sección.
- Notas relevantes para el siguiente agente o para continuar el trabajo.
- Estado de integración y dependencias.

Esto permite iniciar un nuevo chat en cualquier momento, proporcionando el contexto necesario sin saturar la ventana de conversación.

---

## 1. Header

### Objetivo

- Reemplazar el header genérico por uno real, usando patrones de la UI legacy y ajustando a los modelos actuales.
- Mostrar información relevante: usuario, workspace, organización, reloj, toggles de vista.

### Pasos

1. Analizar el header legacy y extraer componentes reutilizables.
2. Definir tipos e interfaces para los datos a mostrar (User, Workspace, Organization).
3. Crear mocks de datos representativos.
4. Implementar el nuevo header usando los componentes y estilos modernos.
5. Integrar el header en la página principal y verificar responsividad.

### Skills Aplicados

- Typescript: Tipado estricto de props y mocks.
- React 19: Composición de componentes, sin hooks innecesarios.
- Tailwind 4: Utilidades para estilos, uso de cn().
- Atomic Design: Componentes pequeños y reutilizables.

### Resumen de Tareas Realizadas (Header)

- Analizado y migrado el header legacy.
- Definidos tipos e interfaces para User, Workspace y Organization.
- Implementados mocks de datos.
- Construido el nuevo header modular y responsivo.
- Integrado en la página principal.

---

## [Espacio para la siguiente sección: Sidebar, Dashboard, etc.]

## 2. Dashboard Tabs (Kanban, Métricas, Bookmarks, Teams, Projects, Workspaces)

### Objetivo

- Migrar el contenido principal de cada tab del dashboard desde la UI legacy, adaptando la estructura y componentes a la nueva arquitectura.
- Dejar la UI funcional con datos mock, lista para conectar a lógica real en el futuro.

### Pasos para la migración de cada tab

1. Identificar el archivo legacy que contiene la lógica y UI principal del tab (ej: Kanban, Métricas, Bookmarks, Teams, Projects, Workspaces).
2. Analizar la estructura de datos y componentes usados en el legacy.
3. Definir los tipos/interfaces necesarios para los datos mock, alineados a los modelos actuales de Prisma.
4. Crear mocks de datos representativos para cada tab.
5. Implementar el componente de contenido del tab usando los mocks y componentes modernos (tipado, tailwind, atomic design).
6. Integrar el componente en el sistema de tabs del dashboard, asegurando que se muestre correctamente al cambiar de tab.
7. Verificar responsividad y dejar comentarios/TODO donde se deba conectar lógica real.

### Notas y recomendaciones

- No migrar lógica de negocio ni hooks legacy, solo la UI y estructura visual.
- Mantener los mocks y tipos en archivos separados o en la carpeta correspondiente a cada tab.
- Usar componentes reutilizables y patrones modernos según los skills del proyecto.
- Documentar brevemente la estructura de cada tab y los datos mock utilizados.

### Checklist de migración por tab

- [ ] Kanban: UI migrada, datos mock, integrado en tab
- [ ] Métricas: UI migrada, datos mock, integrado en tab
- [ ] Bookmarks: UI migrada, datos mock, integrado en tab
- [ ] Teams: UI migrada, datos mock, integrado en tab
- [ ] Projects: UI migrada, datos mock, integrado en tab
- [ ] Workspaces: UI migrada, datos mock, integrado en tab

Al finalizar cada tab, actualizar este documento con el resumen de tareas realizadas y notas relevantes para el siguiente agente.

Al iniciar un nuevo chat, revisa el resumen de tareas realizadas de la última sección completada. Continúa con la siguiente sección siguiendo la misma metodología: analiza, define tipos, crea mocks, implementa, integra y resume.

---
