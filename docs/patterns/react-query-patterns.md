# Patrones y Guías de React Query

> **Documento de referencia para el uso consistente de React Query en el proyecto**

---

## 📖 Tabla de Contenidos

1. [Principios Fundamentales](#principios-fundamentales)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Patrones de Queries](#patrones-de-queries)
4. [Patrones de Mutations](#patrones-de-mutations)
5. [Query Keys](#query-keys)
6. [Invalidación de Cache](#invalidación-de-cache)
7. [Optimistic Updates](#optimistic-updates)
8. [Manejo de Errores](#manejo-de-errores)
9. [Configuración de StaleTime](#configuración-de-staletime)
10. [Prefetching](#prefetching)
11. [Checklist de Implementación](#checklist-de-implementación)

---

## Principios Fundamentales

### 1. Separación de Responsabilidades

```typescript
lib/
├── queries/        # Solo operaciones GET (lectura)
├── mutations/      # Solo operaciones POST/PUT/DELETE (escritura)
├── services/       # Lógica de comunicación API
└── utils/          # Utilidades compartidas
```

**Regla de Oro**: Las queries nunca mutan datos, las mutations nunca leen datos.

### 2. Single Source of Truth

- **Query Keys**: Definidas centralizadamente en `lib/services/query-keys.ts`
- **API Service**: Un solo punto de entrada para todas las llamadas HTTP
- **Tipos**: Compartidos desde `types/api-response-schemas.ts`

### 3. Convención sobre Configuración

- Seguir nombres y patrones predecibles
- Configuración por defecto en `query-client.ts`
- Sobrescribir solo cuando sea necesario

---

## Estructura de Carpetas

### Organización por Entidad

Cada entidad del dominio debe tener:

```
lib/
├── queries/
│   └── [entity].ts          # Hooks de lectura
├── mutations/
│   └── [entity].ts          # Hooks de escritura
└── services/
    └── api-service.ts       # Métodos API para la entidad
```

### Ejemplo: Entidad "Teams"

```
lib/
├── queries/
│   └── teams.ts            # useTeams, useTeam, useTeamMembers
├── mutations/
│   └── teams.ts            # useCreateTeam, useUpdateTeam, useDeleteTeam
└── services/
    └── api-service.ts      # getTeams(), createTeam(), etc.
```

---

## Patrones de Queries

### Patrón 1: Query de Lista

```typescript
// lib/queries/teams.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/services/query-keys';
import { apiService } from '@/lib/services/api-service';

export const useTeams = () => {
  return useQuery({
    queryKey: queryKeys.teams,
    queryFn: apiService.getTeams,
    staleTime: 5 * 60 * 1000, // 5 minutos
    select: (data) => data.data || [],
  });
};
```

**Características obligatorias**:

- ✅ Usar `queryKeys` centralizado
- ✅ Método del `apiService`
- ✅ Definir `staleTime` apropiado
- ✅ Usar `select` para extraer `.data`

### Patrón 2: Query de Detalle

```typescript
// lib/queries/teams.ts
export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: queryKeys.team(teamId),
    queryFn: () => apiService.getTeam(teamId),
    staleTime: 5 * 60 * 1000,
    select: (data) => data.data,
    enabled: !!teamId, // Solo ejecutar si hay ID
  });
};
```

**Características obligatorias**:

- ✅ Query key parametrizada
- ✅ Arrow function en `queryFn` para pasar parámetros
- ✅ Usar `enabled` para validar parámetros requeridos

### Patrón 3: Query Relacional

```typescript
// lib/queries/teams.ts
export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: queryKeys.teamMembers(teamId),
    queryFn: () => apiService.getTeamMembers(teamId),
    staleTime: 2 * 60 * 1000, // 2 minutos (más dinámico)
    select: (data) => data.data || [],
    enabled: !!teamId,
  });
};
```

**Características obligatorias**:

- ✅ Query key jerárquica: `['teams', teamId, 'members']`
- ✅ `staleTime` menor para datos más dinámicos
- ✅ Validación con `enabled`

### Patrón 4: Query con Polling (Live Data)

```typescript
// lib/queries/live-data.ts
export const useLiveTeams = () => {
  return useQuery({
    queryKey: queryKeys.teams,
    queryFn: apiService.getTeams,
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Refetch cada 60 segundos
    refetchIntervalInBackground: false,
    select: (data) => data.data || [],
  });
};
```

**Características obligatorias**:

- ✅ `staleTime` corto (15-60 segundos)
- ✅ `refetchInterval` definido
- ✅ `refetchIntervalInBackground: false` (evitar consumo innecesario)

---

## Patrones de Mutations

### Patrón 1: Create Mutation

```typescript
// lib/mutations/teams.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/services/query-keys';
import { apiService } from '@/lib/services/api-service';
import { toast } from 'sonner';

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createTeam,
    onSuccess: (data) => {
      // 1. Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: queryKeys.teams });
      
      // 2. Notificar al usuario
      toast.success('Equipo creado exitosamente');
    },
    onError: (error: any) => {
      // 3. Manejo de errores consistente
      const message = error?.response?.data?.message || 'Error al crear equipo';
      toast.error(message);
    },
  });
};
```

**Estructura obligatoria**:

1. ✅ Obtener `queryClient` con `useQueryClient()`
2. ✅ `onSuccess`: Invalidar queries + Notificación
3. ✅ `onError`: Toast con mensaje descriptivo

### Patrón 2: Update Mutation

```typescript
// lib/mutations/teams.ts
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamDto }) =>
      apiService.updateTeam(id, data),
    onSuccess: (_, variables) => {
      // Invalidar lista y detalle específico
      queryClient.invalidateQueries({ queryKey: queryKeys.teams });
      queryClient.invalidateQueries({ queryKey: queryKeys.team(variables.id) });
      
      toast.success('Equipo actualizado exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al actualizar equipo';
      toast.error(message);
    },
  });
};
```

**Características obligatorias**:

- ✅ Invalidar tanto lista como detalle
- ✅ Usar `variables` en `onSuccess` para obtener el ID

### Patrón 3: Delete Mutation

```typescript
// lib/mutations/teams.ts
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.deleteTeam,
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams });
      queryClient.removeQueries({ queryKey: queryKeys.team(teamId) });
      
      toast.success('Equipo eliminado exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al eliminar equipo';
      toast.error(message);
    },
  });
};
```

**Características obligatorias**:

- ✅ `invalidateQueries` para la lista
- ✅ `removeQueries` para el detalle eliminado
- ✅ Usar `_` para ignorar la respuesta si no se usa

### Patrón 4: Mutation con Optimistic Update

```typescript
// lib/mutations/teams.ts
export const useCreateTeamOptimistic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createTeam,
    onMutate: async (newTeam) => {
      // 1. Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: queryKeys.teams });
      
      // 2. Guardar snapshot del estado anterior
      const previousTeams = queryClient.getQueryData(queryKeys.teams);
      
      // 3. Actualizar optimísticamente
      queryClient.setQueryData(queryKeys.teams, (old: any) => {
        const optimisticTeam = {
          ...newTeam,
          id: `temp-${Date.now()}`,
          _isOptimistic: true,
        };
        return [...(old?.data || []), optimisticTeam];
      });
      
      // 4. Retornar contexto para rollback
      return { previousTeams };
    },
    onError: (error, variables, context) => {
      // 5. Revertir en caso de error
      if (context?.previousTeams) {
        queryClient.setQueryData(queryKeys.teams, context.previousTeams);
      }
      
      toast.error('Error al crear equipo');
    },
    onSettled: () => {
      // 6. Refetch para sincronizar con servidor
      queryClient.invalidateQueries({ queryKey: queryKeys.teams });
    },
  });
};
```

**Flujo obligatorio**:

1. ✅ `onMutate`: Cancelar queries → Guardar snapshot → Update optimístico
2. ✅ `onError`: Revertir usando el contexto
3. ✅ `onSettled`: Invalidar para sincronizar

---

## Query Keys

### Patrón de Definición

```typescript
// lib/services/query-keys.ts
export const queryKeys = {
  // Lista de entidades
  teams: ['teams'] as const,
  categories: ['categories'] as const,
  members: ['members'] as const,
  
  // Detalle de entidad (función)
  team: (id: string) => [...queryKeys.teams, id] as const,
  category: (id: string) => [...queryKeys.categories, id] as const,
  
  // Relaciones (función jerárquica)
  teamMembers: (teamId: string) => [...queryKeys.teams, teamId, 'members'] as const,
  categorySubcategories: (categoryId: string) => 
    [...queryKeys.categories, categoryId, 'subcategories'] as const,
    
  // Queries filtradas
  teamsByStatus: (status: string) => [...queryKeys.teams, 'status', status] as const,
};
```

### Reglas de Query Keys

1. ✅ **Listas**: Array simple `['entity']`
2. ✅ **Detalle**: Función que extiende la lista `[...queryKeys.entity, id]`
3. ✅ **Relaciones**: Jerarquía clara `[...queryKeys.parent, parentId, 'child']`
4. ✅ **Filtros**: Agregar al final `[...queryKeys.entity, 'filter', value]`
5. ✅ **Usar `as const`**: Para type-safety

### ❌ Anti-patrones

```typescript
// ❌ NO: Keys hardcoded
queryKey: ['teams']

// ✅ SÍ: Keys centralizadas
queryKey: queryKeys.teams

// ❌ NO: Keys inconsistentes
queryKey: ['team', id]
queryKey: [id, 'team']

// ✅ SÍ: Jerarquía consistente
queryKey: queryKeys.team(id)
```

---

## Invalidación de Cache

### Patrón de Invalidación por Operación

```typescript
// CREATE: Invalidar solo la lista
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.teams });
}

// UPDATE: Invalidar lista y detalle
onSuccess: (_, variables) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.teams });
  queryClient.invalidateQueries({ queryKey: queryKeys.team(variables.id) });
}

// DELETE: Invalidar lista y remover detalle
onSuccess: (_, teamId) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.teams });
  queryClient.removeQueries({ queryKey: queryKeys.team(teamId) });
}

// Relaciones: Invalidar queries padre e hijo
onSuccess: (_, { teamId }) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.teams });
  queryClient.invalidateQueries({ queryKey: queryKeys.team(teamId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.teamMembers(teamId) });
}
```

### Invalidación en Cascada

```typescript
// Cuando una subcategoría cambia, invalidar:
// 1. Lista de subcategorías
// 2. Detalle de la subcategoría
// 3. Categoría padre
// 4. Lista de categorías

onSuccess: (_, { categoryId, subcategoryId }) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.subcategories });
  queryClient.invalidateQueries({ queryKey: queryKeys.subcategory(subcategoryId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.category(categoryId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.categories });
}
```

### Invalidación Selectiva vs Global

```typescript
// ✅ Selectiva (preferida)
queryClient.invalidateQueries({ queryKey: queryKeys.teams });

// ⚠️ Global (usar con precaución)
queryClient.invalidateQueries(); // Invalida TODAS las queries

// ✅ Por prefijo (útil para relaciones)
queryClient.invalidateQueries({ 
  queryKey: queryKeys.teams,
  refetchType: 'all' // Incluye queries inactivas
});
```

---

## Optimistic Updates

### ¿Cuándo usar Optimistic Updates?

✅ **Usar cuando**:

- Operaciones rápidas (< 500ms esperado)
- Alta probabilidad de éxito (> 95%)
- Mejora significativa de UX (like, favorite, toggle)

❌ **NO usar cuando**:

- Operaciones complejas con validación del servidor
- Baja probabilidad de éxito
- Datos críticos (financieros, legales)

### Template de Optimistic Update

```typescript
export const useOptimisticMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.mutateData,
    
    // PASO 1: Preparar update optimístico
    onMutate: async (newData) => {
      // Cancelar refetches en curso
      await queryClient.cancelQueries({ queryKey: queryKeys.entity });
      
      // Snapshot del estado actual
      const previous = queryClient.getQueryData(queryKeys.entity);
      
      // Update optimístico
      queryClient.setQueryData(queryKeys.entity, (old: any) => {
        // Lógica de transformación
        return transformData(old, newData);
      });
      
      return { previous };
    },
    
    // PASO 2: Manejar error (rollback)
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.entity, context.previous);
      }
      toast.error('Error en la operación');
    },
    
    // PASO 3: Sincronizar con servidor
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entity });
    },
  });
};
```

---

## Manejo de Errores

### Patrón de Error Handling

```typescript
// Estructura estándar de error
onError: (error: any) => {
  // 1. Extraer mensaje del backend
  const message = error?.response?.data?.message 
    || error?.message 
    || 'Error desconocido';
  
  // 2. Notificar al usuario
  toast.error(message);
  
  // 3. Log para debugging (solo en dev)
  if (process.env.NODE_ENV === 'development') {
    console.error('Mutation error:', error);
  }
}
```

### Manejo de Errores HTTP Específicos

```typescript
onError: (error: any) => {
  const status = error?.response?.status;
  
  switch (status) {
    case 400:
      toast.error('Datos inválidos. Verifica la información.');
      break;
    case 401:
      toast.error('Sesión expirada. Por favor, inicia sesión.');
      // Redirect a login
      break;
    case 403:
      toast.error('No tienes permisos para esta acción.');
      break;
    case 404:
      toast.error('Recurso no encontrado.');
      break;
    case 409:
      toast.error('Conflicto: El recurso ya existe.');
      break;
    case 500:
      toast.error('Error del servidor. Intenta más tarde.');
      break;
    default:
      toast.error(error?.response?.data?.message || 'Error desconocido');
  }
}
```

### Boundary de Errores en Queries

```typescript
// Componente con error handling
export function TeamsList() {
  const { data, isLoading, isError, error } = useTeams();
  
  if (isLoading) return <Skeleton />;
  
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error al cargar equipos</AlertTitle>
        <AlertDescription>
          {error?.message || 'Error desconocido'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return <div>{/* Renderizar data */}</div>;
}
```

---

## Configuración de StaleTime

### Guía de StaleTime por Tipo de Dato

| Tipo de Dato | StaleTime | Razón |
|--------------|-----------|-------|
| **Configuración del sistema** | 30 minutos | Raramente cambia |
| **Categorías/Subcategorías** | 10 minutos | Cambios poco frecuentes |
| **Equipos/Subequipos** | 5 minutos | Moderadamente dinámico |
| **Miembros** | 2-3 minutos | Datos más dinámicos |
| **Eventos/Calendario** | 1-2 minutos | Alta dinamicidad |
| **Live/Real-time** | 15-30 segundos | Requiere frescura |
| **User Profile** | 5 minutos | Cambios ocasionales |

### Configuración en Query Client (Defaults)

```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos por defecto
      gcTime: 10 * 60 * 1000,   // 10 minutos en caché
      retry: 1,                  // 1 reintento
      refetchOnWindowFocus: false, // No refetch al cambiar ventana
    },
  },
});
```

### Sobrescribir por Query

```typescript
// Datos muy estáticos
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: apiService.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Datos en tiempo real
export const useLiveEvents = () => {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: apiService.getEvents,
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Polling cada minuto
  });
};
```

---

## Prefetching

### Patrón de Prefetch en Navegación

```typescript
// lib/utils/prefetch.ts
import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/services/query-keys';
import { apiService } from '@/lib/services/api-service';

export class PrefetchUtils {
  constructor(private queryClient: QueryClient) {}
  
  // Prefetch para dashboard
  async prefetchDashboardData() {
    await Promise.all([
      this.queryClient.prefetchQuery({
        queryKey: queryKeys.teams,
        queryFn: apiService.getTeams,
        staleTime: 5 * 60 * 1000,
      }),
      this.queryClient.prefetchQuery({
        queryKey: queryKeys.categories,
        queryFn: apiService.getCategories,
        staleTime: 10 * 60 * 1000,
      }),
    ]);
  }
  
  // Prefetch para detalle
  async prefetchTeamDetails(teamId: string) {
    await Promise.all([
      this.queryClient.prefetchQuery({
        queryKey: queryKeys.team(teamId),
        queryFn: () => apiService.getTeam(teamId),
      }),
      this.queryClient.prefetchQuery({
        queryKey: queryKeys.teamMembers(teamId),
        queryFn: () => apiService.getTeamMembers(teamId),
      }),
    ]);
  }
}
```

### Uso en Componentes

```typescript
// app/dashboard/page.tsx
export default function Dashboard() {
  const queryClient = useQueryClient();
  const prefetch = new PrefetchUtils(queryClient);
  
  useEffect(() => {
    prefetch.prefetchDashboardData();
  }, []);
  
  return <div>{/* Dashboard */}</div>;
}

// En links con hover
<Link 
  href={`/teams/${team.id}`}
  onMouseEnter={() => prefetch.prefetchTeamDetails(team.id)}
>
  {team.name}
</Link>
```

### Prefetch en Server Components (Next.js)

```typescript
// app/teams/[id]/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/services/query-keys';
import { apiService } from '@/lib/services/api-service';

export default async function TeamPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  
  // Prefetch en servidor
  await queryClient.prefetchQuery({
    queryKey: queryKeys.team(params.id),
    queryFn: () => apiService.getTeam(params.id),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamDetails teamId={params.id} />
    </HydrationBoundary>
  );
}
```

---

## Checklist de Implementación

### ✅ Crear Nueva Entidad

- [ ] **1. Definir Query Keys** en `lib/services/query-keys.ts`

  ```typescript
  export const queryKeys = {
    // ...
    newEntity: ['newEntity'] as const,
    newEntityDetail: (id: string) => [...queryKeys.newEntity, id] as const,
  };
  ```

- [ ] **2. Crear Métodos API** en `lib/services/api-service.ts`

  ```typescript
  class ApiService {
    async getNewEntity() { /* ... */ }
    async createNewEntity(data: CreateDto) { /* ... */ }
    async updateNewEntity(id: string, data: UpdateDto) { /* ... */ }
    async deleteNewEntity(id: string) { /* ... */ }
  }
  ```

- [ ] **3. Crear Queries** en `lib/queries/new-entity.ts`

  ```typescript
  export const useNewEntity = () => { /* ... */ };
  export const useNewEntityDetail = (id: string) => { /* ... */ };
  ```

- [ ] **4. Crear Mutations** en `lib/mutations/new-entity.ts`

  ```typescript
  export const useCreateNewEntity = () => { /* ... */ };
  export const useUpdateNewEntity = () => { /* ... */ };
  export const useDeleteNewEntity = () => { /* ... */ };
  ```

- [ ] **5. Definir Tipos** en `types/api-response-schemas.ts`

  ```typescript
  export interface NewEntity { /* ... */ }
  export interface CreateNewEntityDto { /* ... */ }
  export interface UpdateNewEntityDto { /* ... */ }
  ```

- [ ] **6. Implementar en Componentes**

  ```typescript
  const { data } = useNewEntity();
  const createMutation = useCreateNewEntity();
  ```

### ✅ Validación de Query

- [ ] Usa `queryKeys` centralizado (no hardcoded)
- [ ] Define `staleTime` apropiado
- [ ] Usa `select` para transformar datos
- [ ] Usa `enabled` si depende de parámetros
- [ ] Maneja estados: `isLoading`, `isError`, `data`

### ✅ Validación de Mutation

- [ ] Obtiene `queryClient` con `useQueryClient()`
- [ ] Invalida queries en `onSuccess`
- [ ] Muestra toast en `onSuccess` y `onError`
- [ ] Maneja errores con mensaje descriptivo
- [ ] Si es critical, implementa optimistic update

### ✅ Validación de Código

- [ ] TypeScript sin `any` (excepto en error handling)
- [ ] Nombres consistentes: `use[Entity]`, `useCreate[Entity]`
- [ ] Imports desde aliases (`@/lib/...`)
- [ ] Documentación JSDoc en funciones complejas
- [ ] Tests unitarios para mutations críticas

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)

### Referencias del Proyecto

- `lib/README.md` - Documentación de arquitectura
- `lib/query-client.ts` - Configuración global
- `lib/services/query-keys.ts` - Query keys centralizadas
- Ejemplos: `lib/queries/teams.ts`, `lib/mutations/teams.ts`

---

## 🔄 Versionado

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2026-01-09 | Documento inicial |

---

**Mantenido por**: Equipo de Desarrollo  
**Última actualización**: 9 de enero de 2026
