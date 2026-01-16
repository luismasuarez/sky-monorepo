# Plan de Migración a Next.js

**Fecha:** 16 de enero de 2026  
**Proyecto:** dokkap-app  
**Objetivo:** Migrar proyecto React SPA a Next.js App Router

---

## 🎯 Estrategia de Migración

### **Fase 1: Layout y Estructura Base (Sin funcionalidad)**

1. **Layout Principal de Next.js**
   - Migrar el `app-layout.tsx` al `app/layout.tsx` de Next.js
   - Configurar `app-sidebar.tsx` como componente del layout
   - Adaptar `dashboard-layout.tsx` para las páginas internas
   - Implementar `theme-provider.tsx` (Client Component)

2. **Estilos Glass Morphism**
   - Extraer y adaptar los estilos glass del proyecto original (`to_migrate_to_nextjs/src/globals.css`)
   - Aplicarlos a `app/globals.css` del proyecto Next.js
   - Mantener la estética visual pero con código limpio

### **Fase 2: Componentes con Shadcn MCP**

- **NO reutilizar componentes UI existentes directamente**
- Usar el MCP de Shadcn para generar componentes desde cero
- Tomar solo la **lógica** del componente original como referencia
- Aplicar estilos glass a los componentes de Shadcn
- Ejemplo: Si hay un `Button` custom → usar Shadcn Button + aplicar glass styles

### **Fase 3: Configuración de Infraestructura**

1. **Prisma + Base de Datos Real**
   - Configurar Prisma como ORM
   - Crear esquemas basados en los tipos existentes
   - Migrar de repositorios locales a queries de BD real

2. **React Query (TanStack Query)**
   - Mantener el patrón de React Query para data fetching
   - Configurar QueryClientProvider en layout
   - Adaptar hooks existentes para usar React Query con Next.js

### **Fase 4: Implementación de Lógica por Features**

- Migrar feature por feature después de tener el shell listo
- Cada feature mantiene su estructura modular
- Adaptar repositorios a Prisma
- Server Actions para mutaciones
- Server Components donde sea posible

---

## 📋 Consideraciones Importantes

### **✅ Puntos Clave:**

#### 1. **Componentes Shadcn + Glass**

- Shadcn como base → personalizar con glass morphism
- Variables CSS para mantener consistencia

#### 2. **Prisma Setup**

- Definir modelos basándote en `types/` existentes
- Server Actions para operaciones de BD
- Type safety end-to-end

#### 3. **React Query**

- Client Components para queries interactivas
- Server Components para datos iniciales
- Optimistic updates donde aplique

#### 4. **Arquitectura Next.js 14/15**

- App Router
- Server Components por defecto
- `'use client'` solo cuando sea necesario (contexts, hooks de estado)
- Server Actions para formularios y mutaciones

#### 5. **Internacionalización**

- Adaptar sistema de locales a Next.js i18n
- Server-side translations donde sea posible

#### 6. **Sync/Offline (si aplica)**

- Evaluar si mantener lógica de sync offline
- Podría simplificarse con Prisma + real DB

---

## 🚀 Plan de Acción

### **Paso 1: Setup Base**

- [x] Configurar Prisma (schema inicial)
- [x] Configurar React Query Provider
- [x] Migrar globals.css con estilos glass
- [x] Configurar variables de entorno

### **Paso 2: Layout Shell**

- [x] app/layout.tsx (Provider tree)
- [x] Sidebar component (Client Component)
- [x] Dashboard layout structure
- [x] Theme provider
- [x] Navigation básica (sin rutas funcionales)

### **Paso 3: Componentes Base con Shadcn**

- [ ] Identificar componentes UI necesarios
- [ ] Agregar vía MCP Shadcn
- [ ] Aplicar glass styles personalizados
- [ ] Crear variants necesarios

### **Paso 4: Features (Iterativo)**

- [ ] Auth (primera feature crítica)
- [ ] Workspaces/Tenants
- [ ] Projects
- [ ] Kanban
- [ ] Bookmarks
- [ ] Metrics
- [ ] Organizations
- [ ] Servers
- [ ] Teams
- [ ] System

---

## 📁 Estructura de Directorios

### **Proyecto Original**

```
to_migrate_to_nextjs/src/
├── core/           # Lógica compartida
├── features/       # Features modulares
├── pages/          # Páginas React Router
└── assets/         # Assets estáticos
```

### **Proyecto Next.js (Target)**

```
app/
├── (auth)/         # Grupo de rutas de auth
├── (dashboard)/    # Grupo de rutas protegidas
│   ├── layout.tsx
│   ├── projects/
│   ├── teams/
│   └── ...
├── api/            # API Routes
├── layout.tsx      # Root layout
└── globals.css

components/
├── ui/             # Componentes Shadcn + glass
└── [feature]/      # Componentes específicos

lib/
├── prisma.ts       # Cliente Prisma
├── auth.ts         # Auth utilities
└── utils.ts        # Utilidades

prisma/
└── schema.prisma   # Modelos de BD
```

---

## 🔄 Flujo de Migración por Feature

Para cada feature:

1. **Analizar tipos y modelos**
   - Revisar `features/[feature]/types/`
   - Crear/actualizar modelos Prisma

2. **Crear estructura en Next.js**
   - Crear rutas en `app/(dashboard)/[feature]/`
   - Definir layouts específicos si es necesario

3. **Migrar componentes**
   - Identificar componentes UI necesarios
   - Usar Shadcn MCP para componentes base
   - Adaptar lógica de componentes originales

4. **Implementar data layer**
   - Crear Server Actions para mutaciones
   - Adaptar hooks de React Query
   - Configurar queries con Prisma

5. **Testing y refinamiento**
   - Verificar funcionalidad
   - Optimizar rendimiento
   - Ajustar estilos glass

---

## 🎨 Sistema de Estilos Glass

### **Variables CSS a definir:**

```css
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
--glass-backdrop: blur(10px);
```

### **Clases Utility:**

- `.glass-panel`
- `.glass-card`
- `.glass-button`
- `.glass-input`

---

## 📝 Notas Adicionales

### **Dependencias a Agregar:**

```json
{
  "@prisma/client": "^5.x",
  "@tanstack/react-query": "^5.x",
  "prisma": "^5.x",
  "next-auth": "^5.x" // Si se usa para auth
}
```

### **Decisiones de Arquitectura:**

- **ORM:** Prisma
- **State Management:** React Query + Context API
- **Auth:** NextAuth.js (por definir)
- **UI Components:** Shadcn/ui + Glass custom styles
- **Routing:** Next.js App Router
- **Database:** PostgreSQL (recomendado)

---

## 🚦 Estado Actual

- [x] Plan definido
- [x] Setup base
- [x] Layout shell
- [ ] Primer feature migrado
- [ ] Features restantes
- [ ] Testing completo
- [ ] Deployment

---

**Última actualización:** 16 de enero de 2026
