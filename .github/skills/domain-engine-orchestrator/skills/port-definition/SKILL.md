---
name: port-definition
description: >
  Define los puertos/interfaces de la arquitectura hexagonal basándose
  en los Use Cases previamente definidos. Establece contratos claros
  entre la capa de aplicación y la infraestructura (DB, servicios
  externos, mensajería), asegurando separación de responsabilidades
  y consistencia con Domain-Driven Design.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Port Definition — Definición de Puertos/Interfaces

## ¿Cuándo usar este skill?

- Después de ejecutar `use-case-designer`
- Antes de generar adapters concretos (`adapter-mapping`)
- Cuando se necesita definir **interfaces claras entre Application Services y la infraestructura**

---

## Objetivo del skill

- Definir puertos (interfaces) para cada Application Service
- Especificar métodos, inputs, outputs y excepciones
- Mantener la independencia del dominio respecto de la infraestructura
- Preparar entrada para la generación de adapters específicos (DB, HTTP, Messaging)

---

## Entradas esperadas

- Salida de `use-case-designer` con Use Cases, comandos, queries y eventos
- Glosario y Lenguaje Ubicuo
- Bounded Contexts y Aggregates

Ejemplo de entrada:

```json
{
  "useCases": [
    {
      "name": "RegistrarParticipante",
      "boundedContext": "Eventos",
      "aggregateRoot": "Evento",
      "command": ["eventoId", "participanteId", "datosParticipante"],
      "output": ["confirmacion", "eventoActualizado"],
      "triggersEvents": ["ParticipanteRegistrado"]
    },
    {
      "name": "ProcesarPagoTicket",
      "boundedContext": "Pagos",
      "aggregateRoot": "Ticket",
      "command": ["ticketId", "monto", "moneda"],
      "output": ["confirmacionPago", "ticketActualizado"],
      "triggersEvents": ["PagoProcesado", "PagoFallido"]
    }
  ]
}
```
