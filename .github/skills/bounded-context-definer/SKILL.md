---
name: bounded-context-definer
description: >
  Analiza el glosario y el Lenguaje Ubicuo del dominio para identificar
  bounded contexts (contextos limitados), definir sus responsabilidades
  y establecer relaciones entre contextos. Prepara la estructura para
  diseñar aggregates y casos de uso consistentes con DDD y
  arquitectura hexagonal.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Bounded Context Definer — Identificación de Contextos Limitados

## ¿Cuándo usar este skill?

- Después de ejecutar `domain-discovery` y `ubiquitous-language-builder`
- Cuando se necesita **dividir el dominio** en contextos claros y autónomos
- Antes de diseñar aggregates y domain events

⚠️ No saltar este skill, ya que los aggregates dependen de contextos bien definidos.

---

## Objetivo del skill

- Detectar y definir **bounded contexts** dentro del dominio
- Establecer **responsabilidades claras** para cada contexto
- Detectar relaciones entre contextos
- Generar una estructura lista para modelar aggregates y servicios de aplicación

---

## Entradas esperadas

- Glosario refinado y Lenguaje Ubicuo
- Relaciones preliminares entre conceptos
- Descripción opcional de procesos de negocio

Ejemplo de entrada:

```json
{
  "ubiquitousLanguage": [
    { "term": "Evento", "category": "Entidad" },
    { "term": "Participante", "category": "Entidad" },
    { "term": "Ticket", "category": "Valor" },
    { "term": "Pago", "category": "Proceso" }
  ],
  "relationships": [
    { "from": "Organizador", "to": "Evento", "type": "gestiona" },
    { "from": "Participante", "to": "Evento", "type": "asiste" },
    { "from": "Ticket", "to": "Pago", "type": "requiere" }
  ]
}
```
