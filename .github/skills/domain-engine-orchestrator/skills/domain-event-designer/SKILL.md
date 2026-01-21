---
name: domain-event-designer
description: >
  Diseña los Domain Events del dominio basándose en los Aggregates
  previamente definidos. Identifica eventos relevantes, define sus
  payloads, condiciones de emisión y relaciones con otros contextos
  o Aggregates, asegurando trazabilidad y consistencia para la
  arquitectura hexagonal.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Domain Event Designer — Modelado de Eventos del Dominio

## ¿Cuándo usar este skill?

- Después de ejecutar `aggregate-designer`
- Antes de definir `use-case-designer` o `port-definition`
- Cuando se necesita **identificar eventos que representan hechos del negocio**

---

## Objetivo del skill

- Detectar eventos importantes dentro de cada Aggregate
- Definir payloads claros y consistentes
- Establecer condiciones de emisión
- Relacionar eventos con bounded contexts y posibles subscribers
- Preparar la salida para Application Services y Domain-Driven Architecture

---

## Entradas esperadas

- Salida de `aggregate-designer` con Aggregates, Entities, Value Objects e invariantes
- Glosario y Lenguaje Ubicuo
- Relaciones preliminares de contexto

Ejemplo de entrada:

```json
{
  "aggregates": [
    {
      "boundedContext": "Eventos",
      "root": "Evento",
      "entities": ["Participante", "Organizador"],
      "valueObjects": ["FechaEvento", "Ubicacion"],
      "invariants": ["Evento.capacidadMaxima >= Participantes.length"],
      "possibleEvents": ["ParticipanteRegistrado", "EventoCancelado"]
    },
    {
      "boundedContext": "Pagos",
      "root": "Ticket",
      "entities": ["Pago"],
      "valueObjects": ["Monto", "Moneda"],
      "invariants": ["Pago.monto > 0"],
      "possibleEvents": ["PagoProcesado", "PagoFallido"]
    }
  ]
}
```
