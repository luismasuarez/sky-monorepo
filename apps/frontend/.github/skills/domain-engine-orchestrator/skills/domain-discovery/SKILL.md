---
name: domain-discovery
description: >
  Analiza una descripción de negocio en lenguaje natural y extrae
  los conceptos clave de dominio, actores, eventos, procesos y
  dependencias. Use when the user provides an idea de producto,
  funcionalidad o requerimiento de negocio y necesita transformar
  esa descripción en una primera estructura de dominio.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Domain Discovery — Extrae conceptos clave de dominio

## ¿Cuándo usar este skill?

Use este skill cuando:

1. El usuario tiene una idea, requerimiento de negocio,
   historia de usuario o funcionalidad en lenguaje natural.
2. Se necesita identificar los conceptos de dominio
   relevantes antes de modelar aggregates, bounded contexts o eventos.
3. Se quiere transformar “texto de negocio” en un
   **glosario de términos y relaciones de dominio**.

## ¿Qué hace este skill?

Este skill:

1. Identifica términos importantes del dominio
2. Clasifica roles de negocio, procesos y conceptos
3. Genera un glosario estructurado
4. Detecta posibles eventos de negocio implicados
5. Saca relaciones de dependencia entre conceptos

## Instrucciones paso a paso

1. **Entrada Esperada**
   - Una descripción en lenguaje natural con contexto de negocio,
     metas, restricciones o escenarios de uso.

2. **Extrae Términos de Dominio**
   - Filtra y normaliza palabras clave relevantes
   - Elimina palabras genéricas

3. **Clasificación de Conceptos**
   - Clasifica cada término como: Actor, Entidad, Proceso,
     Regla de Negocio, Evento o Valor

4. **Construye Glosario**
   - Para cada término clasificado, genera:
     - Nombre del concepto
     - Categoría
     - Definición en lenguaje claro
     - Ejemplos de uso

5. **Relaciones y Dependencias**
   - Detecta relaciones tipo: “usa”, “genera”, “depende de”,
     “es parte de”, y “requiere”

## Ejemplo de entrada/salida

### Entrada

> “Crear una plataforma para organizar eventos, donde los
> organizadores puedan gestionar participantes, tickets,
> notificaciones y pagos.”

### Salida esperada

```json
{
  "glossary": [
    { "term": "Organizador", "type": "Actor", "definition": "Usuario que gestiona eventos" },
    { "term": "Evento", "type": "Entidad", "definition": "Instancia de evento con fecha y lugar" },
    { "term": "Participante", "type": "Entidad", "definition": "Persona inscrita al evento" },
    { "term": "Ticket", "type": "Valor", "definition": "Token de acceso al evento" },
    {
      "term": "Pago",
      "type": "Proceso",
      "definition": "Transacción monetaria asociada a un ticket"
    }
  ],
  "relationships": [
    { "from": "Organizador", "to": "Evento", "type": "gestiona" },
    { "from": "Participante", "to": "Evento", "type": "asiste" },
    { "from": "Ticket", "to": "Pago", "type": "requiere" }
  ]
}
```

### Edge Cases & Consejos

- Si la entrada no contiene términos claros de negocio, pide aclaraciones específicas (“¿Quién usa esto?”, “¿Qué representa este concepto?”).

- Vigila ambigüedades y normaliza sinónimos de dominio.
