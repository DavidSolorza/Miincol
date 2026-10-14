# 📄 Especificación de Contrato de API RESTful
**Proyecto:** Plan Ministerial Misincol (PDM)  
**Base URL:** `/api/v1`  
**Autor:** Agente 6 (Technical Writer & QA Specialist)  
**Estado:** Inmaculado / Especificación Completa

---

## 1. Visión General
Esta especificación define los contratos estrictos de la API RESTful para la gestión del Plan de Desarrollo Ministerial (PDM) de **MISINCOL**. En cumplimiento estricto con las normas de gobernanza:
- Se utiliza el cliente HTTP nativo (`src/shared/api/httpClient.ts`) sin librerías comerciales.
- Se definen exhaustivamente los códigos de estado `200/201`, `400`, `401/403`, `422` y `500`.

---

## 2. Endpoints

### 2.1. Obtener Plan por Fase
- **Ruta:** `GET /api/v1/plans/:phaseId`
- **Parámetros de Ruta:**
  - `phaseId`: string (`investigacion` | `encarnacion` | `evangelizacion` | `entrenamiento` | `autocuidado`)

#### Matriz de Respuestas
- **`200 OK`**:
```json
{
  "phaseId": "investigacion",
  "phaseName": "Investigación y Diagnóstico Territorial",
  "startDate": "2026-02-01",
  "teamName": "Misión Wayuu - Alta Guajira",
  "teamLeader": "Pastor David Morales",
  "teamMembers": ["Misionero Juan Gómez", "Dra. Ruth Mendoza (Salud)", "Hno. Carlos Pushaina"],
  "objectives": [
    {
      "number": 1,
      "title": "Mapeo Demográfico y Social de Comunidades",
      "description": "Levantamiento censal, mapeo de clanes y detección de necesidades primarias de agua y salud.",
      "activities": [
        {
          "id": "act-101",
          "stage": "Diagnóstico Comunitario",
          "objectiveNumber": 1,
          "description": "Visita exploratoria y diálogo con palabreros en 5 rancherías",
          "currentSituation": "Acceso limitado a agua y falta de censos actualizados",
          "mediumTermGoal": "Relación de confianza con líderes locales",
          "longTermGoal": "Apertura comunitaria al evangelio y programas de desarrollo",
          "responsible": "David Morales & Carlos Pushaina",
          "frequency": "Mensual",
          "timesPerYear": 12,
          "startDate": "2026-02-15",
          "endDate": "2026-12-15",
          "totalWeeks": 44,
          "remainingWeeks": 32,
          "unitBudget": 350000.00,
          "totalBudget": 4200000.00,
          "state": "En Proceso",
          "obstacles": "Transporte en trocha y temporadas de lluvia"
        }
      ]
    }
  ]
}
```

- **`400 Bad Request`**:
```json
{
  "error": "BAD_REQUEST",
  "message": "El identificador de fase proporcionado 'fase_invalida' no corresponde a una fase ministerial reconocida.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

- **`401 Unauthorized`**:
```json
{
  "error": "UNAUTHORIZED",
  "message": "Token de sesión ausente o expirado. Debe iniciar sesión en el portal Misincol.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

- **`422 Unprocessable Entity`**:
```json
{
  "error": "VALIDATION_FAILED",
  "message": "Parámetro 'phaseId' no cumple el formato esperado.",
  "details": [
    { "field": "phaseId", "issue": "Valor esperado en el enum: ['investigacion', 'encarnacion', 'evangelizacion', 'entrenamiento', 'autocuidado']" }
  ]
}
```

- **`500 Internal Server Error`**:
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Error no controlado al consultar la base de datos de planes ministeriales.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

---

### 2.2. Actualizar Actividad (Inline Edit / Patch Rápido)
- **Ruta:** `PATCH /api/v1/activities/:activityId`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
- **Payload de Entrada (JSON):**
```json
{
  "state": "Completado",
  "unitBudget": 400000.00,
  "timesPerYear": 12,
  "obstacles": "Superados con apoyo de líderes comunitarios"
}
```

#### Matriz de Respuestas
- **`200 OK`**:
```json
{
  "success": true,
  "activity": {
    "id": "act-101",
    "state": "Completado",
    "unitBudget": 400000.00,
    "timesPerYear": 12,
    "totalBudget": 4800000.00,
    "obstacles": "Superados con apoyo de líderes comunitarios",
    "updatedAt": "2026-10-14T03:05:00Z"
  }
}
```

- **`400 Bad Request`**:
```json
{
  "error": "BUSINESS_RULE_VIOLATION",
  "message": "No se puede marcar la actividad como 'Completada' si no posee fecha de finalización válida o si el presupuesto total es negativo.",
  "timestamp": "2026-10-14T03:05:00Z"
}
```

- **`404 Not Found`**:
```json
{
  "error": "ACTIVITY_NOT_FOUND",
  "message": "La actividad con ID 'act-999' no existe en el sistema.",
  "timestamp": "2026-10-14T03:05:00Z"
}
```

- **`422 Unprocessable Entity`**:
```json
{
  "error": "SCHEMA_VALIDATION_ERROR",
  "message": "Datos de entrada inválidos.",
  "details": [
    { "field": "unitBudget", "issue": "Debe ser un número mayor o igual a 0." },
    { "field": "state", "issue": "Valores permitidos: ['Pendiente', 'En Proceso', 'Completado']" }
  ]
}
```

- **`500 Internal Server Error`**:
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Fallo crítico al sincronizar la actividad en el almacenamiento persistente.",
  "timestamp": "2026-10-14T03:05:00Z"
}
```

---

### 2.3. Crear Nueva Actividad en Objetivo
- **Ruta:** `POST /api/v1/objectives/:objectiveNumber/activities`
- **Payload de Entrada (JSON):**
```json
{
  "stage": "Relacionamiento",
  "description": "Taller de saneamiento básico y capacitación a promotores de salud",
  "responsible": "Dra. Ruth Mendoza",
  "frequency": "Bimensual",
  "timesPerYear": 6,
  "startDate": "2026-03-01",
  "endDate": "2026-11-30",
  "totalWeeks": 36,
  "remainingWeeks": 28,
  "unitBudget": 500000.00,
  "currentSituation": "Alta incidencia de enfermedades transmitidas por agua",
  "mediumTermGoal": "Capacitar a 15 promotores indígenas bilingües",
  "longTermGoal": "Reducción del 50% de infecciones gastrointestinales",
  "obstacles": "Dispersión geográfica de las comunidades"
}
```

#### Matriz de Respuestas
- **`201 Created`**:
```json
{
  "success": true,
  "activity": {
    "id": "c1f7b8b2-5f82-4fa8-a15e-3c22df674f1b",
    "stage": "Relacionamiento",
    "description": "Taller de saneamiento básico y capacitación a promotores de salud",
    "responsible": "Dra. Ruth Mendoza",
    "frequency": "Bimensual",
    "timesPerYear": 6,
    "startDate": "2026-03-01",
    "endDate": "2026-11-30",
    "totalWeeks": 36,
    "remainingWeeks": 28,
    "unitBudget": 500000.00,
    "totalBudget": 3000000.00,
    "state": "Pendiente",
    "obstacles": "Dispersión geográfica de las comunidades",
    "createdAt": "2026-10-14T03:07:00Z"
  }
}
```
