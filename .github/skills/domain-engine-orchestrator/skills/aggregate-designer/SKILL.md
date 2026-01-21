---
name: aggregate-designer
description: >
  Diseña los Aggregates y Entities del dominio basándose en los
  bounded contexts previamente definidos. Define Aggregates Root,
  Entities internas, Value Objects, invariantes y reglas de negocio
  para que la estructura del dominio sea consistente y preparada
  para casos de uso y eventos.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Aggregate Designer — Modelado de Aggregates y Entities

## ¿Cuándo usar este skill?

- Después de ejecutar `bounded-context-definer`
- Antes de definir `domain-events` y `use-cases`
- Cuando se necesita **estructurar el dominio en objetos consistentes** con DDD y Arquitectura Hexagonal

---

## Objetivo del skill

- Definir Aggregates Root de cada bounded context
- Identificar Entities internas y Value Objects
- Establecer invariantes y reglas de negocio por Aggregate
- Preparar la estructura para Application Services y Ports/Adapters

---

## Entradas esperadas

- Salida de `bounded-context-definer`
- Glosario de Lenguaje Ubicuo
- Relaciones preliminares entre conceptos

Ejemplo de entrada:

```json
{
  "boundedContexts": [
    {
      "name": "Eventos",
      "concepts": ["Evento", "Participante", "Organizador"],
      "responsibilities": [
        "Gestionar información de eventos",
        "Administrar inscripciones de participantes"
      ]
    },
    {
      "name": "Pagos",
      "concepts": ["Ticket", "Pago"],
      "responsibilities": ["Procesar pagos de tickets", "Emitir comprobantes a participantes"]
    }
  ]
}
```
