---
name: ubiquitous-language-builder
description: >
  Construye y refina el Lenguaje Ubicuo del dominio a partir de un
  glosario preliminar y relaciones detectadas. Este skill normaliza
  términos, elimina ambigüedades, define significados únicos y
  establece el vocabulario oficial que debe usarse en todo el
  dominio, código y comunicación.
metadata:
  author: tu-organizacion
  version: '1.0'
---

# Ubiquitous Language Builder — Consolidación del Lenguaje de Dominio

## ¿Cuándo usar este skill?

Use este skill cuando:

1. Ya existe un glosario inicial generado por `domain-discovery`.
2. Hay términos ambiguos, sinónimos o conceptos solapados.
3. Se necesita definir un **lenguaje único y consistente**
   antes de diseñar bounded contexts, aggregates o casos de uso.

⚠️ No diseñe aggregates ni entidades sin pasar antes por este skill.

---

## Objetivo del skill

Este skill tiene como objetivo:

- Crear un **Lenguaje Ubicuo explícito**
- Garantizar que cada término tenga **un único significado**
- Establecer reglas de uso del lenguaje para:
  - Dominio
  - Código
  - Documentación
  - Comunicación del equipo

---

## Entradas esperadas

- Glosario inicial de términos del dominio
- Relaciones entre conceptos
- Descripción opcional del negocio o contexto

Ejemplo de entrada:

- Lista de términos con definiciones preliminares
- Relaciones detectadas entre conceptos

---

## Proceso que debe seguir el agente

### 1. Normalización de términos

- Unifica variaciones lingüísticas (singular/plural, verbos/sustantivos)
- Establece una forma canónica por término

Ejemplo:

- `Usuarios`, `User`, `Cliente` → **Cliente**

---

### 2. Detección de ambigüedad

- Identifica términos con:
  - Múltiples significados
  - Uso inconsistente
- Marca términos ambiguos para aclaración

---

### 3. Resolución de sinónimos

- Decide **un solo término oficial**
- Registra sinónimos como _prohibidos_ o _alternativos_

---

### 4. Definición semántica estricta

Para cada término:

- Nombre oficial
- Definición clara y no circular
- Contexto de uso
- Ejemplo real de negocio

---

### 5. Reglas de lenguaje

Define reglas explícitas como:

- Términos que **NO deben usarse**
- Diferencias claras entre conceptos cercanos
- Convenciones de nombres para código

---

## Salida esperada

La salida debe ser un **Lenguaje Ubicuo estructurado**, por ejemplo:

```json
{
  "ubiquitousLanguage": [
    {
      "term": "Evento",
      "definition": "Actividad programada con fecha, lugar y capacidad definida",
      "category": "Entidad",
      "allowedSynonyms": [],
      "forbiddenSynonyms": ["Actividad", "Reunión"],
      "usageExample": "El Evento acepta inscripciones hasta alcanzar su capacidad"
    },
    {
      "term": "Participante",
      "definition": "Persona registrada para asistir a un Evento",
      "category": "Entidad",
      "allowedSynonyms": [],
      "forbiddenSynonyms": ["Usuario", "Asistente"],
      "usageExample": "Un Participante puede cancelar su inscripción"
    }
  ],
  "languageRules": [
    "Nunca usar 'Usuario' cuando se refiere a un Participante",
    "Los términos del dominio deben reflejar el lenguaje del negocio, no el técnico",
    "Los nombres en código deben coincidir exactamente con el Lenguaje Ubicuo"
  ]
}
```
