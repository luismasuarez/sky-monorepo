---
name: use-case-designer
description: >
  Diseña los casos de uso del dominio (Application Services) basándose
  en Aggregates y Domain Events previamente definidos. Define comandos,
  queries, flujos de interacción y reglas de aplicación para que los
  casos de uso sean consistentes con DDD y preparados para los puertos
  y adapters de la arquitectura hexagonal.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Use Case Designer — Modelado de Casos de Uso

## ¿Cuándo usar este skill?

- Después de ejecutar `domain-event-designer`
- Antes de definir `port-definition` y `adapter-mapping`
- Cuando se necesita **traducir eventos y aggregates en acciones de aplicación concretas**

---

## Objetivo del skill

- Definir Application Services por bounded context
- Identificar comandos y queries
- Mapear flujos de interacción entre Aggregates y Domain Events
- Preparar la salida para la generación de puertos y adapters

---

## Entradas esperadas

- Salida de `aggregate-designer` y `domain-event-designer`
- Bounded Contexts y Lenguaje Ubicuo
- Relaciones y reglas de negocio

Ejemplo de entrada:

```json
{
  "aggregates": [
    {
      "root": "Evento",
      "entities": ["Participante"],
      "valueObjects": ["FechaEvento", "Ubicacion"],
      "possibleEvents": ["ParticipanteRegistrado", "EventoCancelado"]
    },
    {
      "root": "Ticket",
      "entities": ["Pago"],
      "valueObjects": ["Monto", "Moneda"],
      "possibleEvents": ["PagoProcesado", "PagoFallido"]
    }
  ],
  "domainEvents": [
    {
      "name": "ParticipanteRegistrado",
      "aggregate": "Evento",
      "boundedContext": "Eventos",
      "payload": ["eventoId", "participanteId", "fechaRegistro"]
    },
    {
      "name": "PagoProcesado",
      "aggregate": "Ticket",
      "boundedContext": "Pagos",
      "payload": ["ticketId", "monto", "moneda", "fecha"]
    }
  ]
}
```
