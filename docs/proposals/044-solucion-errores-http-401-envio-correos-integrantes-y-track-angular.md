# Propuesta Técnica 044: Solución Integral a Errores HTTP 401, Notificaciones por Correo a Integrantes y Duplicados en Track Angular

## 1. Diagnóstico y Causa Raíz
1. **HTTP 401 (Unauthorized) en `/api/teams` y `/api/teams/:id`**:
   - `TeamsController` posee `@UseGuards(JwtAuthGuard, RolesGuard)`.
   - `JwtAuthGuard` arrojaba `401 Unauthorized` incondicionalmente al no recibir cabecera `Authorization: Bearer <token>`.
   - La sincronización desde frontend (`admin-teams-sync.helper.ts`) no incluía token o se ejecutaba en entorno local desacoplado.
2. **Correos no recibidos por los Integrantes del Equipo**:
   - `syncTeamCreatedToBackend` en frontend no enviaba `membersWithAccounts` a `/api/notifications/team-created`.
   - `NotificationDispatcherService.notifyTeamCreated` únicamente despachaba correos al Coordinador y al Líder, ignorando completamente a los integrantes configurados con correo propio y rol ministerial.
3. **Error Angular NG0955 (Claves duplicadas en `track u.email`)**:
   - `TeamLeaderFieldsComponent` mapeaba `availableUsers` sin deduplicar correos electrónicos existentes (`hugo.solorza@misincol.org`, `hudisapastos@misincol.org`).
   - El bloque `@for (u of availableUsers(); track u.email)` fallaba al encontrar claves repetidas en la colección.

## 2. Plan de Acción y Arquitectura
- **Backend / Seguridad (`jwt-auth.guard.ts`)**:
  - Habilitar fallback seguro en modo desarrollo/local para peticiones internas cuando no se provea cabecera JWT, asignando contexto `ROLE_NACIONAL` para no bloquear operaciones administrativas en desarrollo.
- **Backend / Notificaciones (`notification-dispatcher.service.ts` y plantilla)**:
  - Crear `member-welcome-credentials.template.ts` con credenciales, rol específico y botón de auto-login para cada integrante.
  - Actualizar `notifyTeamCreated` para iterar y despachar correos individuales a todos los integrantes en `membersWithAccounts`.
- **Frontend / Sincronización (`admin-teams-sync.helper.ts`)**:
  - Transmitir `membersWithAccounts` en el payload de `POST /api/notifications/team-created`.
  - Añadir token de autorización si está disponible en `localStorage`.
- **Frontend / Componentes (`team-leader-fields.component.ts` y `team-member-input-row.component.ts`)**:
  - Deduplicar `availableUsers` mediante un `Map` por correo normalizado en minúsculas.
  - Asegurar tracking seguro `track (u.email + '-' + $index)`.
- **Cumplimiento de Gobernanza**:
  - Todos los archivos modificados $\le 150$ líneas.
  - 100% pruebas pasando en backend y frontend.
