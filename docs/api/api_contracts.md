# Contratos de Servicios de API REST: MISINCOL PDM
**Versión de Gobernanza:** 2026.4.0  
**Cliente Consumidor:** `src/core/http/httpClient.ts` (Fetch Nativo, Cero SDKs comerciales)  
**Formato de Transferencia:** JSON (UTF-8)

---

## 1. Módulo: Autenticación & Equipos (`/api/v1/teams`)

### `GET /api/v1/teams`
Obtiene la lista de todos los equipos misioneros registrados y sus métricas ejecutivas.
* **Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "team-wayuu",
    "name": "Equipo Misionero Wayúu",
    "ethnicity": "Pueblo Wayúu",
    "region": "Alta Guajira",
    "department": "La Guajira",
    "leader": "Pastor Juan Gómez",
    "leaderPhone": "+573001234567",
    "themeColor": "#8B251E",
    "currentPhaseId": "investigacion",
    "healthStatus": "estable"
  }
]
```

---

## 2. Módulo: Planes PDM (`/api/v1/plans`)

### `GET /api/v1/teams/:teamId/phases/:phaseType`
Retorna el plan ministerial completo de una fase específica para un equipo misionero.
* **Respuesta Exitosa (200 OK):**
```json
{
  "id": "phase-investigacion-001",
  "teamId": "team-wayuu",
  "phaseType": "investigacion",
  "phaseNumber": 1,
  "title": "Fase 1: Investigación y Conexión Territorial",
  "totalBudget": 18500000,
  "objectives": [
    {
      "id": "obj-1",
      "objectiveNumber": 1,
      "title": "Mapeo Cultural y Social",
      "totalBudget": 4500000,
      "activities": [
        {
          "id": "act-1",
          "objectiveNumber": 1,
          "description": "Censo de familias y clanes en la comunidad",
          "stage": "General",
          "responsible": "Pastor Juan Gómez",
          "frequency": "Mensual",
          "timesPerYear": 12,
          "unitBudget": 300000,
          "totalBudget": 3600000,
          "startDate": "2026-03-01",
          "endDate": "2026-11-30",
          "totalWeeks": 39,
          "remainingWeeks": 12,
          "state": "En Progreso"
        }
      ]
    }
  ]
}
```

---

## 3. Módulo: Actividades (`/api/v1/activities`)

### `POST /api/v1/activities`
Crea una nueva actividad dentro de un objetivo.
* **Payload:**
```json
{
  "objectiveId": "obj-1",
  "description": "Taller de capacitación lingüística",
  "stage": "General",
  "responsible": "Hno. David Solorza",
  "frequency": "Bimestral",
  "timesPerYear": 6,
  "unitBudget": 250000,
  "startDate": "2026-04-01",
  "endDate": "2026-10-31",
  "state": "Pendiente"
}
```
* **Respuesta Exitosa (201 Created):** Retorna el objeto `Activity` creado con su ID autogenerado.

### `PUT /api/v1/activities/:id`
Actualiza campos parciales o totales de una actividad existente.
* **Respuesta Exitosa (200 OK):** Retorna el objeto `Activity` actualizado.

---

## 4. Módulo: Notas Territoriales (`/api/v1/teams/:teamId/notes`)

### `GET /api/v1/teams/:teamId/notes`
Lista las notas de campo del equipo.

### `POST /api/v1/teams/:teamId/notes`
Registra una nueva nota de campo.

---

## 5. Módulo: Auditoría y Telemetría (`/api/v1/audit`)

### `POST /api/v1/audit/logs`
Registra un evento de telemetría o cambio de estado.
* **Payload:**
```json
{
  "teamId": "team-wayuu",
  "action": "UPDATE_ACTIVITY_BUDGET",
  "details": { "activityId": "act-1", "oldBudget": 300000, "newBudget": 350000 }
}
```
* **Respuesta Exitosa (204 No Content)**
