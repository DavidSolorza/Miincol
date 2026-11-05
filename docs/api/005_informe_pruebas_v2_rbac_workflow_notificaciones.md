# Informe Técnico de Pruebas Backend V2: RBAC, LockWorkflow, Notificaciones y Reportes
**Proyecto:** MISINCOL - Plan de Desarrollo Ministerial (PDM)  
**Versión:** 2026.4.0  
**Fecha de Ejecución:** 04 de Noviembre de 2026  
**Servidor Objetivo:** `http://localhost:3000/api`  
**Resultado Global:** ✅ **100% EXITOSO (11 de 11 pruebas superadas)**

---

## 1. Resumen de la Ejecución

Se validó la implementación integral de los lineamientos del backend exigidos por el cliente en NestJS, incluyendo autenticación RBAC con JWT, gestión de usuarios protegida, flujo de sellado y aprobación de planes (`LockWorkflow`), auditoría programada con `@nestjs/schedule` y respaldos masivos.

| ID | Módulo | Caso de Prueba | Detalle de Ejecución | Resultado | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **V2-01** | **Auth** | Login exitoso de Coordinador Nacional | `admin@misincol.org` emite token con `role: ROLE_NACIONAL` | HTTP 200 | ✅ PASSED |
| **V2-02** | **Auth** | Login exitoso de Líder Territorial | `wayuu@misincol.org` emite token con `role: ROLE_LIDER` y `teamId: team-wayuu` | HTTP 200 | ✅ PASSED |
| **V2-03** | **Users** | Creación de usuario por Coordinador | `POST /api/users` crea `lider.arhuaco@misincol.org` con hash seguro y auditoría | HTTP 201 | ✅ PASSED |
| **V2-04** | **RBAC** | Bloqueo a Líder para crear usuarios | `ROLE_LIDER` intenta `POST /api/users` y es rechazado con `ForbiddenException` | HTTP 403 | ✅ PASSED |
| **V2-05** | **Workflow** | Consulta de estado inicial de planeación | `GET /api/teams/team-wayuu/plan-status` retorna `status: DRAFT`, `isLocked: false` | HTTP 200 | ✅ PASSED |
| **V2-06** | **Workflow** | Sellado del plan como Terminado | `POST /api/teams/team-wayuu/finish-plan` cambia estado a `FINISHED` e `isLocked: true` | HTTP 201 | ✅ PASSED |
| **V2-07** | **Workflow** | Registro de Solicitud de Cambio | `POST /api/change-requests` registra solicitud en estado `PENDING` para plan bloqueado | HTTP 201 | ✅ PASSED |
| **V2-08** | **Workflow** | Aprobación de cambio por Coordinador | `POST /api/change-requests/:id/approve` por `ROLE_NACIONAL` cambia a `APPROVED` | HTTP 201 | ✅ PASSED |
| **V2-09** | **Notif** | Auditoría automática por Cron | `POST /api/notifications/trigger-audit` evalúa faltantes y fechas de vencimiento | HTTP 201 | ✅ PASSED |
| **V2-10** | **Notif** | Consulta de alertas activas | `GET /api/notifications` lista recordatorios y avisos dirigidos | HTTP 200 | ✅ PASSED |
| **V2-11** | **Reports** | Histórico anual y respaldo masivo | `GET /api/reports/backup/json` y `/backup/excel` generan respaldos completos | HTTP 200 | ✅ PASSED |

---

## 2. Evidencias de Funcionamiento

### 2.1. Control de Accesos y Seguridad (RBAC)
- **Token ROLE_NACIONAL:**
  ```json
  {
    "sub": "usr-admin-2",
    "email": "admin@misincol.org",
    "role": "ROLE_NACIONAL"
  }
  ```
- **Protección contra Líder Territorial (HTTP 403 Forbidden):**
  ```json
  {
    "success": false,
    "statusCode": 403,
    "error": {
      "message": "Acceso denegado: Se requiere uno de los roles [ROLE_NACIONAL]",
      "error": "Forbidden",
      "statusCode": 403
    }
  }
  ```

### 2.2. Flujo de Bloqueo de Planes (`LockWorkflow`)
- **Sellado del Plan (`POST /api/teams/team-wayuu/finish-plan`):**
  ```json
  {
    "teamId": "team-wayuu",
    "year": 2026,
    "status": "FINISHED",
    "isLocked": true,
    "lockedAt": "2026-11-05T03:31:00.123Z",
    "lockedBy": "wayuu@misincol.org"
  }
  ```
- **Solicitud de Modificación Aprobada (`ChangeRequest`):**
  ```json
  {
    "id": "e0510cac-34f0-4e61-ae3e-ad0debdca665",
    "teamId": "team-wayuu",
    "entityType": "ACTIVITY",
    "action": "UPDATE",
    "status": "APPROVED",
    "requestedBy": "wayuu@misincol.org",
    "resolvedBy": "admin@misincol.org"
  }
  ```

### 2.3. Auditoría Automática y Tareas Programadas (`@nestjs/schedule`)
- La tarea Cron evalúa automáticamente todas las actividades con fecha de término en un rango menor o igual a 7 días y reportes anuales pendientes por equipo, despachando alertas instantáneas a los destinatarios.

---

## 3. Estado de Gobernanza Técnica

- **Regla de 150 líneas por archivo:** 100% de cumplimiento en todos los archivos `.ts` creados y actualizados.
- **Compilación TypeScript:** Exitosa sin advertencias ni errores en `backend/` y `frontend/`.
- **Colección Postman:** Actualizada y documentada en [`misincol_api_collection.json`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/postman/misincol_api_collection.json).

