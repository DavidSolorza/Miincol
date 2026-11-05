# Propuesta Técnica 006: Arquitectura Integral Backend NestJS, Conexión Frontend y Colección Postman

**Fecha:** 2026-11-04  
**Estado:** PENDIENTE DE REVISIÓN Y FEEDBACK DEL USUARIO  
**Gobernanza:** Technical Governance Contract v2026.4.0 (Regla 2.1 < 150 líneas, Regla 2.2 Ciclo Propuesta ➡️ Feedback ➡️ Ejecución, Regla 2.3 Cero SDKs comerciales)

---

## 1. Contexto y Requerimiento

El usuario solicita implementar de forma exclusiva en el backend (`backend/` vinculado a `https://github.com/DavidSolorza/misincolBack.git`) la arquitectura completa del Diagrama de Clases y módulos recomendados en NestJS, conectar el frontend (`frontend/`) exclusivamente mediante endpoints HTTP nativos, y generar un archivo de colección Postman (`backend/postman/`) para pruebas de integración de todas las rutas.

---

## 2. Diagrama de Clases y Entidades del Backend

Conforme al diagrama del cliente:

1. **`User`**: Identidad y autenticación (`id: UUID`, `email`, `passwordHash`, `role: 'admin' | 'team'`, `teamId: UUID`).
2. **`Team`**: Misiones y macrodatos territoriales (`id: UUID`, `name`, `location`, `population`, `evangelicaCongregations`, `evangelicalsCount`).
3. **`TeamMember`**: Miembros de equipo misionero (`id: UUID`, `teamId: UUID`, `fullName`, `contactInfo`, `roleInTeam`).
4. **`Pillar`**: Los 5 pilares del PDM (`id: UUID`, `name`, `totalBudget`).
5. **`Objective`**: Objetivos estratégicos con **autoenumeración dinámica** (`id: UUID`, `teamId: UUID`, `pillarId: UUID`, `dynamicPosition: number`, `title`, `description`, `essentialArea`, `level`, `stage`).
6. **`Activity`**: Actividades territoriales (`id: UUID`, `objectiveId: UUID`, `description`, `status`, `stage`, `unitBudget`, `totalBudget`, `frequency`, `timesPerYear`, `startDate`, `endDate`).
7. **`FieldReport`**: Métricas de avance de campo y evangelismo (`id: UUID`, `teamId: UUID`, `year`, `firstTimeContacts`, `interestedPeople`, `heardGospel`, `baptizedCount`, `activeBibleStudies`).

---

## 3. Estructura de Módulos en `backend/src/`

Para respetar estrictamente la regla de **máximo 150 líneas por archivo**, cada módulo se fragmenta en `controllers`, `services`, `dto`, `entities`:

```text
backend/src/
├── common/
│   ├── guards/                    # JwtAuthGuard, RolesGuard (< 150 líneas)
│   ├── filters/                   # HttpExceptionFilter (< 150 líneas)
│   └── validators/                # IsStageConsistentWithAreaConstraint (< 150 líneas)
├── config/                        # Configuración segura JWT y variables de entorno
├── auth/                          # Login, generación JWT y validación de tokens
│   ├── dto/login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── teams/                         # Equipos, integrantes y datos macro territoriales
│   ├── dto/create-team.dto.ts
│   ├── entities/team.entity.ts
│   ├── teams.controller.ts
│   ├── teams.service.ts
│   └── teams.module.ts
├── objectives/                    # Objetivos estratégicos con lógica de autoenumeración
│   ├── dto/create-objective.dto.ts
│   ├── entities/objective.entity.ts
│   ├── objectives.controller.ts
│   ├── objectives.service.ts
│   └── objectives.module.ts
├── activities/                    # Actividades, cronogramas y presupuesto (sin obstáculos)
│   ├── dto/create-activity.dto.ts
│   ├── entities/activity.entity.ts
│   ├── activities.controller.ts
│   ├── activities.service.ts
│   └── activities.module.ts
├── reports/                       # Consolidación ejecutiva y exportación
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   └── reports.module.ts
├── app.module.ts
└── main.ts                        # ValidationPipe global, CORS, prefix '/api'
```

---

## 4. Lógica Clave del Backend

### 4.1. Autoenumeración Dinámica de Objetivos (`ObjectivesService`)
- Al crear un objetivo: se asigna `dynamicPosition = count(teamId, pillarId) + 1` (máximo 4).
- Al eliminar un objetivo: se reordenan secuencialmente todos los objetivos restantes de ese equipo y pilar (`1, 2, 3...`) garantizando integridad posicional sin números huérfanos.

### 4.2. Mapeo Canónico de Etapas por Pilar
- Validación estricta con `@IsStageConsistentWithArea()` para rechazar cualquier combinación inválida en los DTOs.

### 4.3. Seguridad y JWT
- `@nestjs/jwt` para emitir tokens firmados en `/api/auth/login`.
- Endpoints protegidos mediante decorador `@UseGuards(JwtAuthGuard)`.

---

## 5. Colección Postman (`backend/postman/`)

Se creará el archivo `backend/postman/misincol_api_collection.json` con:
- Variables de entorno (`baseUrl = http://localhost:3000/api`, `authToken`).
- Peticiones documentadas para cada endpoint:
  - `POST /api/auth/login` (Guarda automáticamente el token en `authToken`).
  - `GET /api/teams` y `POST /api/teams`.
  - `GET /api/objectives` y `POST /api/objectives` (con validación de áreas y autoenumeración).
  - `DELETE /api/objectives/:id` (con recálculo de posición).
  - `POST /api/activities` (con validación de área y etapa coherente, sin obstáculos).
  - `GET /api/reports/field/:teamId`.

---

## 6. Conexión del Frontend (`frontend/`) con la API

- En `frontend/src/core/config/env.config.ts`: se configura `API_BASE_URL: 'http://localhost:3000/api'`.
- En `frontend/src/core/http/httpClient.ts`: el cliente HTTP nativo consumirá los endpoints del backend manteniendo el control de errores tipados y soporte offline.
- Servicios del frontend sincronizados con el backend:
  - `AppSessionService` / `verifyAuthCredentials` conecta con `/api/auth/login`.
  - `PlanService` interactúa con los endpoints REST `/api/objectives` y `/api/activities`.
  - `GeneralInfoService` interactúa con `/api/teams/:id/general-info`.

---

## 7. Plan de Ejecución

1. **Backend Scaffolding & Módulos**:
   - Crear entidades, DTOs, servicios y controladores en `backend/src/` con tipado estricto y < 150 líneas por archivo.
2. **Generación de Colección Postman**:
   - Crear `backend/postman/misincol_api_collection.json`.
3. **Conexión Frontend**:
   - Actualizar configuración de entorno y servicios en `frontend/` para comunicarse con la API.
4. **Verificación y Pruebas**:
   - Compilación exitosa en `backend/` (`npm run build`).
   - Compilación exitosa en `frontend/` (`npm run build`).
   - Linter `oxlint` 0 errores y 0 warnings.
   - Verificación de 100% archivos `< 150` líneas.
5. **Git Commit & Push**:
   - Push de commits al backend (`misincolBack.git`) y al monorepo (`Miincol.git` en `featurePrueba`).

---

Por favor confírmanos tu aprobación para proceder con la ejecución.

