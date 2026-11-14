# Esquema de Base de Datos Local IndexedDB (misincol_offline_db v1)

## 1. Definición de la Base de Datos
* **Nombre:** `misincol_offline_db`
* **Versión:** `1`
* **Mecanismo:** W3C IndexedDB API nativa en navegador

## 2. Object Stores e Índices

### 2.1. Store: `outbox`
Almacena las mutaciones pendientes de envío al backend remoto.
* **KeyPath:** `id` (string, UUIDv4)
* **Índices:**
  * `by_status`: `status` (`pending`, `syncing`, `failed`, `conflict`)
  * `by_createdAt`: `clientCreatedAt` (ISO string)
  * `by_entity`: `entityType` (`team`, `objective`, `activity`, `report`, `note`)

```json
{
  "id": "outbox-550e8400-e29b-41d4-a716-446655440000",
  "entityType": "activity",
  "entityId": "act-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "action": "CREATE",
  "endpoint": "/activities",
  "method": "POST",
  "payload": { "...": "..." },
  "clientCreatedAt": "2026-11-13T21:30:00.000Z",
  "attempts": 0,
  "status": "pending"
}
```

### 2.2. Store: `teams`
Copia local de los equipos y presupuestos.
* **KeyPath:** `id` (string)
* **Índices:** `by_slug`: `slug`

### 2.3. Store: `objectives`
Objetivos estratégicos por fase y equipo.
* **KeyPath:** `id` (string)
* **Índices:**
  * `by_teamId`: `teamId`
  * `by_phase`: `phaseId`

### 2.4. Store: `activities`
Actividades operativas de campo.
* **KeyPath:** `id` (string)
* **Índices:**
  * `by_objectiveId`: `objectiveId`
  * `by_teamId`: `teamId`
  * `by_status`: `status`

### 2.5. Store: `reports`
Informes de supervisión generados localmente.
* **KeyPath:** `id` (string)
* **Índices:** `by_teamId`: `teamId`

### 2.6. Store: `notes`
Agenda pastoral y notas territoriales.
* **KeyPath:** `id` (string)
* **Índices:** `by_teamId`: `teamId`

