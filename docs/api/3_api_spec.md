# 📄 Especificación de Contrato de API RESTful y Cliente HTTP Nativo
**Proyecto:** Plan Ministerial Misincol (PDM) & Portal Territorial  
**Base URL:** `/api/v1`  
**Cliente HTTP:** `NativeFetchClient` (`src/core/http/httpClient.ts`) — Cero SDKs Comerciales  
**Autor:** Agente 5 (Technical Writer & Auditor de Calidad)  
**Versión:** 3.0.0 (Angular Edition)

---

## 1. Arquitectura de Red y Tolerancia Offline

Todas las integraciones de red del cliente Angular consumen exclusivamente `httpClient` ubicado en [`src/core/http/httpClient.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/core/http/httpClient.ts):
- Basado en el estándar nativo `fetch` con `AbortController` y timeout configurable (`8000ms` por defecto).
- Si el dispositivo en terreno pierde conexión (`!navigator.onLine` o error de red en mutaciones `POST`/`PUT`/`PATCH`/`DELETE`), la operación se encola automáticamente en `offlineQueue` (`src/core/offline/offlineQueue.ts`) y notifica a `NetworkBusService` (`src/core/bus/network-bus.service.ts`).
- Todas las respuestas de error HTTP se transforman en instancias tipadas de `AppError` (`src/core/errors/AppError.ts`) con códigos estándar (`400`, `401`, `403`, `404`, `422`, `500`).

---

## 2. Resumen de Endpoints RESTful

| Método | Ruta | Caso de Uso / Servicio Angular | Códigos de Respuesta |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Autenticación de Super Admin o Equipo Territorial (`LoginViewComponent` / `AppSessionService`) | `200`, `400`, `422` |
| `GET` | `/api/v1/teams` | Listado de equipos territoriales y KPIs nacionales (`AdminDashboardService`) | `200`, `500` |
| `POST` | `/api/v1/teams` | Creación de nueva misión territorial (`AdminDashboardService.createTeam`) | `201`, `400`, `409`, `422` |
| `PUT` | `/api/v1/teams/:id` | Actualización de misión existente (`AdminDashboardService.updateTeam`) | `200`, `404`, `422` |
| `PATCH` | `/api/v1/teams/:id/phase` | Cambio rápido de pilar PDM (`AdminDashboardService.quickChangePhase`) | `200`, `404` |
| `DELETE` | `/api/v1/teams/:id` | Eliminación de misión y sus planes (`AdminDashboardService.deleteTeam`) | `200`, `404` |
| `POST` | `/api/v1/phases/:phaseId/objectives` | Creación de objetivo estratégico — máx. 4 por fase (`PlanService.addObjective`) | `201`, `400`, `422` |
| `PUT` | `/api/v1/phases/:phaseId/objectives/:num` | Edición de título y descripción de objetivo (`PlanService.updateObjective`) | `200`, `404`, `422` |
| `DELETE` | `/api/v1/phases/:phaseId/objectives/:num` | Eliminación de objetivo estratégico (`PlanService.deleteObjective`) | `200`, `400`, `404` |
| `POST` | `/api/v1/teams/:teamId/phases/:phaseId/activities` | Creación de actividad / sub-objetivo (`PlanService.addActivity`) | `201`, `422` |
| `PUT` | `/api/v1/teams/:teamId/phases/:phaseId/activities/:actId` | Edición integral o rápida de actividad (`PlanService.updateActivity`) | `200`, `400`, `404`, `422` |
| `DELETE` | `/api/v1/teams/:teamId/phases/:phaseId/activities/:actId` | Eliminación de actividad (`PlanService.deleteActivity`) | `200`, `404` |
| `GET` / `POST` / `DELETE` | `/api/v1/teams/:teamId/notes` | Gestión de Notas y Agenda Territorial (`TeamNotesModalComponent`) | `200`, `201`, `422` |
| `GET` / `POST` | `/api/v1/teams/:teamId/audit-logs` | Bitácora de Auditoría y Telemetría (`TeamAuditModalComponent` / `auditStorage.ts`) | `200`, `201`, `404` |

*(Para el detalle exhaustivo de ejemplos JSON de solicitud/respuesta por endpoint, véase también [`docs/3_api_spec.md`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/docs/3_api_spec.md)).*

