# 📄 Especificación de Contrato de API RESTful
**Proyecto:** Plan Ministerial Misincol (PDM) & Portal Territorial  
**Base URL:** `/api/v1`  
**Autor:** Agente 6 (Technical Writer & QA Specialist)  
**Estado:** Inmaculado / Especificación Completa

---

## 1. Visión General
Esta especificación define los contratos rigurosos de la API RESTful para la administración de equipos territoriales y planes ministeriales de **MISINCOL**. Consumo realizado mediante el cliente HTTP nativo (`src/shared/api/httpClient.ts`), cumpliendo con la prohibición estricta de SDKs comerciales empaquetados.

---

## 2. Endpoints de Equipos Ministeriales (`/api/v1/teams`)

### 2.1. Listar Equipos con Filtros y Métricas Nacionales
- **Ruta:** `GET /api/v1/teams`
- **Query Params (Opcionales):**
  - `search`: string (búsqueda por nombre, líder, etnia, municipio)
  - `phase`: enum (`investigacion`, `encarnacion`, `evangelizacion`, `entrenamiento`, `autocuidado`, `ALL`)
  - `health`: enum (`Optimo`, `Atención`, `Crítico`, `ALL`)
  - `region`: string

#### Matriz de Respuestas
- **`200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "team-wayuu",
      "slug": "team-wayuu",
      "name": "Misión Wayuu - Alta Guajira",
      "ethnicity": "Wayuu",
      "region": "Uribia, Manaure y Nazaret",
      "department": "La Guajira (Caribe)",
      "leader": "Pr. David Morales",
      "leaderPhone": "+57 312 458 9201",
      "membersCount": 4,
      "currentPhaseId": "investigacion",
      "currentPhaseName": "1. Investigación",
      "progressPercentage": 45,
      "totalBudget": 14900000,
      "executedBudget": 6705000,
      "themeColor": "#8B251E",
      "healthStatus": "Atención",
      "lastUpdate": "Hoy, 09:30 AM"
    }
  ],
  "kpis": {
    "totalTeams": 5,
    "totalMissionaries": 17,
    "totalNationalBudget": 83400000,
    "totalExecutedBudget": 40006000,
    "nationalAverageProgress": 48,
    "activeCriticalAlerts": 3,
    "totalActivities": 32,
    "completedActivities": 14
  }
}
```

- **`500 Internal Server Error`**:
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Fallo crítico al recuperar los equipos territoriales del servidor.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

---

### 2.2. Crear Nuevo Equipo Territorial
- **Ruta:** `POST /api/v1/teams`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
- **Payload de Entrada (JSON):**
```json
{
  "name": "Misión Misak - Silvia",
  "ethnicity": "Misak (Guambiano)",
  "region": "Resguardo Guambía, Silvia",
  "department": "Cauca (Andina)",
  "leader": "Pr. Taita Manuel Tunubalá",
  "leaderPhone": "+57 315 889 0142",
  "members": ["Manuel Tunubalá", "Mama Rosa Almendra", "Javier Morales"],
  "currentPhaseId": "investigacion",
  "totalBudget": 15000000,
  "themeColor": "#2563EB",
  "healthStatus": "Optimo",
  "slug": "team-misak"
}
```

#### Matriz de Respuestas
- **`201 Created`**:
```json
{
  "success": true,
  "message": "Equipo territorial creado exitosamente.",
  "data": {
    "id": "team-misak",
    "slug": "team-misak",
    "name": "Misión Misak - Silvia",
    "ethnicity": "Misak (Guambiano)",
    "region": "Resguardo Guambía, Silvia",
    "department": "Cauca (Andina)",
    "leader": "Pr. Taita Manuel Tunubalá",
    "leaderPhone": "+57 315 889 0142",
    "membersCount": 3,
    "currentPhaseId": "investigacion",
    "currentPhaseName": "1. Investigación",
    "progressPercentage": 0,
    "totalBudget": 15000000,
    "executedBudget": 0,
    "themeColor": "#2563EB",
    "healthStatus": "Optimo",
    "lastUpdate": "Justo ahora"
  }
}
```

- **`400 Bad Request`**:
```json
{
  "error": "MISSING_REQUIRED_FIELDS",
  "message": "Los campos 'name', 'ethnicity', 'region' y 'leader' son estrictamente obligatorios.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

- **`409 Conflict`**:
```json
{
  "error": "TEAM_ALREADY_EXISTS",
  "message": "Ya existe un equipo registrado con el identificador o nombre 'Misión Misak - Silvia'.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

- **`422 Unprocessable Entity`**:
```json
{
  "error": "SCHEMA_VALIDATION_ERROR",
  "message": "Formato de color hexadecimal o teléfono inválido.",
  "details": [
    { "field": "themeColor", "issue": "Debe cumplir el formato hexadecimal '#RRGGBB'." },
    { "field": "totalBudget", "issue": "El presupuesto debe ser un valor numérico no negativo." }
  ]
}
```

---

### 2.3. Actualizar Equipo Territorial
- **Ruta:** `PUT /api/v1/teams/:id`
- **Payload de Entrada (JSON):**
```json
{
  "name": "Misión Misak - Silvia y Piendamó",
  "region": "Resguardos Guambía y Las Delicias",
  "leader": "Pr. Taita Manuel Tunubalá",
  "leaderPhone": "+57 315 889 0142",
  "themeColor": "#1D4ED8",
  "healthStatus": "Atención",
  "totalBudget": 16500000
}
```

#### Matriz de Respuestas
- **`200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "team-misak",
    "name": "Misión Misak - Silvia y Piendamó",
    "region": "Resguardos Guambía y Las Delicias",
    "leader": "Pr. Taita Manuel Tunubalá",
    "leaderPhone": "+57 315 889 0142",
    "themeColor": "#1D4ED8",
    "healthStatus": "Atención",
    "totalBudget": 16500000,
    "lastUpdate": "Justo ahora"
  }
}
```

- **`404 Not Found`**:
```json
{
  "error": "TEAM_NOT_FOUND",
  "message": "No se encontró el equipo con identificador 'team-misak'.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

---

### 2.4. Cambio Rápido de Fase PDM
- **Ruta:** `PATCH /api/v1/teams/:id/phase`
- **Payload de Entrada (JSON):**
```json
{
  "currentPhaseId": "encarnacion"
}
```

#### Matriz de Respuestas
- **`200 OK`**:
```json
{
  "success": true,
  "message": "Fase PDM actualizada con éxito.",
  "data": {
    "id": "team-wayuu",
    "currentPhaseId": "encarnacion",
    "currentPhaseName": "2. Encarnación",
    "lastUpdate": "Justo ahora"
  }
}
```

---

### 2.5. Eliminar Equipo Territorial
- **Ruta:** `DELETE /api/v1/teams/:id`

#### Matriz de Respuestas
- **`200 OK`**:
```json
{
  "success": true,
  "message": "Equipo territorial 'team-misak' y sus planes asociados han sido eliminados correctamente."
}
```

- **`404 Not Found`**:
```json
{
  "error": "TEAM_NOT_FOUND",
  "message": "El equipo especificado no existe o ya fue eliminado.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

---

## 3. Endpoints de Objetivos Estratégicos (`/api/v1/phases/:phaseId/objectives`)

### 3.1. Crear Nuevo Objetivo Estratégico (Máximo 4 por Fase)
- **Ruta:** `POST /api/v1/phases/:phaseId/objectives`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
- **Payload de Entrada (JSON):**
```json
{
  "title": "Soberanía Hídrica y Salud Preventiva en Rancherías",
  "description": "Diagnóstico de pozos artesanales, instalación de filtros comunitarios y capacitación a promotoras indígenas."
}
```

#### Matriz de Respuestas
- **`201 Created`**:
```json
{
  "success": true,
  "message": "Objetivo estratégico creado exitosamente.",
  "data": {
    "number": 3,
    "title": "Soberanía Hídrica y Salud Preventiva en Rancherías",
    "description": "Diagnóstico de pozos artesanales, instalación de filtros comunitarios y capacitación a promotoras indígenas.",
    "activities": []
  }
}
```

- **`400 Bad Request (Regla de Negocio: Máximo 4 Objetivos)`**:
```json
{
  "error": "MAX_OBJECTIVES_REACHED",
  "message": "No es posible crear más de 4 objetivos estratégicos por fase ministerial del PDM.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

- **`422 Unprocessable Entity`**:
```json
{
  "error": "SCHEMA_VALIDATION_ERROR",
  "message": "El título y la descripción del objetivo son campos requeridos.",
  "details": [
    { "field": "title", "issue": "No puede estar vacío." },
    { "field": "description", "issue": "No puede estar vacío." }
  ]
}
```

---

### 3.2. Actualizar Objetivo Estratégico Existente
- **Ruta:** `PUT /api/v1/phases/:phaseId/objectives/:objectiveNumber`
- **Parámetros de Ruta:**
  - `phaseId`: string
  - `objectiveNumber`: integer (1, 2, 3 o 4)
- **Payload de Entrada (JSON):**
```json
{
  "title": "Mapeo Demográfico y Social de Rancherías (Actualizado)",
  "description": "Censo consolidado de 18 rancherías y diálogo con autoridades tradicionales."
}
```

#### Matriz de Respuestas
- **`200 OK`**:
```json
{
  "success": true,
  "message": "Objetivo estratégico actualizado correctamente.",
  "data": {
    "number": 1,
    "title": "Mapeo Demográfico y Social de Rancherías (Actualizado)",
    "description": "Censo consolidado de 18 rancherías y diálogo con autoridades tradicionales."
  }
}
```

- **`404 Not Found`**:
```json
{
  "error": "OBJECTIVE_NOT_FOUND",
  "message": "El objetivo número 1 no existe en la fase indicada.",
  "timestamp": "2026-10-14T03:00:00Z"
}
```

---

## 4. Endpoints de Autenticación y Verificación de Credenciales (`/api/v1/auth`)

### 4.1. Iniciar Sesión (Equipos Territoriales o Super Administrador)
- **Ruta:** `POST /api/v1/auth/login`
- **Headers:** `Content-Type: application/json`
- **Payload de Entrada (JSON) - Caso Administrador:**
```json
{
  "identifier": "admin",
  "password": "••••••••••••",
  "role": "admin"
}
```

- **Payload de Entrada (JSON) - Caso Equipo Territorial:**
```json
{
  "identifier": "team-wayuu",
  "password": "••••••••",
  "role": "team"
}
```

#### Matriz Estricta de Respuestas y Errores
- **`200 OK` (Autenticación Exitosa Administrador):**
```json
{
  "success": true,
  "role": "admin",
  "userName": "Super Administrador",
  "token": "simulated_secure_jwt_adm_2026",
  "message": "Acceso concedido al Tablero de Supervisión Nacional."
}
```

- **`200 OK` (Autenticación Exitosa Misión Territorial):**
```json
{
  "success": true,
  "role": "team",
  "teamId": "team-wayuu",
  "userName": "Pr. David Morales",
  "token": "simulated_secure_jwt_team_wayuu_2026",
  "message": "Acceso concedido al PDM de Misión Wayuu."
}
```

- **`400 Bad Request` (Credenciales Inválidas o Equipo no Encontrado):**
```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Contraseña de acceso incorrecta para el usuario o equipo indicado.",
  "timestamp": "2026-10-15T14:00:00Z"
}
```

- **`422 Unprocessable Entity` (Validación de Campos Requeridos):**
```json
{
  "error": "VALIDATION_FAILED",
  "message": "Los campos 'identifier' y 'password' son obligatorios para autenticar.",
  "details": [
    { "field": "password", "issue": "La contraseña no puede estar vacía." }
  ]
}
```

---

## 5. Endpoints de Notas y Agenda Territorial (`/api/v1/teams/:teamId/notes`)

### 5.1. Listar Notas y Peticiones del Equipo
- **Ruta:** `GET /api/v1/teams/:teamId/notes`
- **Headers:** `Authorization: Bearer <TOKEN>`

#### Matriz de Respuestas
- **`200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "teamId": "team-wayuu",
      "title": "Visita Pastoral a la Ranchería Nazareth",
      "content": "Llevar filtros de agua, revisar avance del curso bíblico bilingüe y coordinar reunión con el palabrero.",
      "category": "actividad",
      "isPinned": true,
      "author": "Pr. David Morales",
      "createdAt": "2026-10-15T10:00:00Z",
      "updatedAt": "2026-10-15T10:00:00Z"
    }
  ]
}
```

### 5.2. Crear Nueva Nota / Idea
- **Ruta:** `POST /api/v1/teams/:teamId/notes`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
- **Payload de Entrada (JSON):**
```json
{
  "title": "Taller de Liderazgo Juvenil",
  "content": "Conectar con maestros de la escuela rural para planificar jornada de capacitación.",
  "category": "idea",
  "isPinned": false,
  "author": "Misionero de Campo"
}
```

#### Matriz de Respuestas
- **`201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": "771e8400-e29b-41d4-a716-446655440099",
    "teamId": "team-wayuu",
    "title": "Taller de Liderazgo Juvenil",
    "content": "Conectar con maestros de la escuela rural para planificar jornada de capacitación.",
    "category": "idea",
    "isPinned": false,
    "author": "Misionero de Campo",
    "createdAt": "2026-10-15T12:00:00Z",
    "updatedAt": "2026-10-15T12:00:00Z"
  }
}
```
- **`422 Unprocessable Entity`**:
```json
{
  "error": "VALIDATION_FAILED",
  "message": "El título y el contenido son obligatorios para guardar la nota."
}
```

### 5.3. Eliminar Nota Territorial
- **Ruta:** `DELETE /api/v1/teams/:teamId/notes/:id`
- **`200 OK`**: `{ "success": true, "message": "Nota eliminada correctamente." }`


