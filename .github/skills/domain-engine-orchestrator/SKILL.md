---
name: domain-engine-orchestrator
description: >
  Orquesta el pipeline completo de creación de dominio basado en DDD
  y arquitectura hexagonal. Gestiona la ejecución de skills en orden,
  pasando la salida de uno como entrada del siguiente, validando la
  consistencia y preparando una estructura de dominio lista para
  generar aggregates, bounded contexts, casos de uso y adapters.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Domain Engine Orchestrator — Meta-Skill de Pipeline DDD

## Objetivo

- Coordinar todos los skills del dominio en un flujo definido:

```

domain-discovery
↓
ubiquitous-language-builder
↓
bounded-context-definer
↓
aggregate-designer
↓
domain-event-designer
↓
use-case-designer
↓
port-definition
↓
adapter-mapping

```

- Garantizar **salida consistente** y lista para generación de código
- Proporcionar **logs de consistencia** y validaciones inter-skill

---

## Entradas esperadas

- Descripción en lenguaje natural de la idea o funcionalidad
- Información opcional de negocio: usuarios, procesos, reglas

---

## Proceso que debe seguir el agente

### 1. Ejecutar `domain-discovery`

- Extrae conceptos clave del dominio
- Genera glosario inicial y relaciones entre conceptos

### 2. Ejecutar `ubiquitous-language-builder`

- Refina el glosario
- Establece Lenguaje Ubicuo consistente
- Valida ambigüedades y sinónimos

### 3. Ejecutar `bounded-context-definer`

- Detecta contextos limitados usando el Lenguaje Ubicuo
- Define límites, responsabilidades y relaciones

### 4. Ejecutar `aggregate-designer`

- Modela aggregates y entities dentro de cada bounded context
- Define invariantes y reglas de negocio

### 5. Ejecutar `domain-event-designer`

- Extrae eventos del dominio
- Define payloads y condiciones de emisión

### 6. Ejecutar `use-case-designer`

- Define Application Services y comandos
- Orquesta la interacción entre aggregates y eventos

### 7. Ejecutar `port-definition` y `adapter-mapping`

- Define interfaces de puertos
- Mapea a adapters de infraestructura (DB, HTTP, Messaging)
- Prepara salida para framework específico si se desea

---

## Salida esperada

```json
{
"domain": {
  "glossary": [...],
  "ubiquitousLanguage": [...],
  "boundedContexts": [...],
  "aggregates": [...],
  "domainEvents": [...],
  "useCases": [...],
  "ports": [...],
  "adapters": [...]
},
"logs": [
  "domain-discovery completed successfully",
  "ubiquitous-language-builder: 2 ambiguous terms found and resolved",
  "bounded-context-definer: 3 contexts identified"
]
}
```

---

## Reglas importantes

- ❌ No saltarse skills intermedios
- ✅ Validar la salida de cada skill antes de pasar al siguiente
- ✅ Mantener trazabilidad: cada dato generado debe ser referenciable
- ✅ Evitar contaminación de dominio con detalles de infraestructura hasta el final

---

## Beneficios

- Permite crear **dominios completos** desde una simple idea
- Reduce errores de consistencia entre glosario, aggregates y bounded contexts
- Facilita generación de código para NestJS, NextJS u otros frameworks
- Se puede reutilizar para múltiples proyectos SaaS o PWA
