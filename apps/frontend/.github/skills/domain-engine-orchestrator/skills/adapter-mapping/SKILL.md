---
name: adapter-mapping
description: >
  Mapea los puertos previamente definidos a adapters concretos, como
  repositorios de base de datos, servicios HTTP, mensajería o
  eventos. Permite que los Application Services interactúen con la
  infraestructura sin romper la independencia del dominio y respetando
  la arquitectura hexagonal.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Adapter Mapping — Implementación de Adapters

## ¿Cuándo usar este skill?

- Después de ejecutar `port-definition`
- Cuando se necesita **implementar la infraestructura concreta**
- Antes de integrar los Application Services con DB, APIs o sistemas externos

---

## Objetivo del skill

- Mapear cada puerto a su adapter concreto
- Mantener la independencia del dominio
- Preparar código o stubs listos para integración
- Garantizar consistencia con Use Cases, Aggregates y Domain Events

---

## Entradas esperadas

- Salida de `port-definition` con puertos e interfaces
- Lenguaje Ubicuo y Aggregates
- Use Cases y Domain Events

Ejemplo de entrada:

```json
{
  "ports": [
    {
      "name": "EventoRepository",
      "type": "Repository",
      "boundedContext": "Eventos",
      "methods": [
        { "name": "save", "input": ["Evento"], "output": "Evento" },
        { "name": "findById", "input": ["eventoId"], "output": "Evento" }
      ]
    },
    {
      "name": "PagoService",
      "type": "ExternalService",
      "boundedContext": "Pagos",
      "methods": [
        {
          "name": "procesarPago",
          "input": ["ticketId", "monto", "moneda"],
          "output": "ResultadoPago"
        }
      ]
    }
  ]
}
```
