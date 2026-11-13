# Propuesta Técnica 032: Corrección Integral de Persistencia y Login para Correos y Cuentas de Equipos

## 1. Contexto y Diagnóstico del Problema
El usuario ha reportado:
> *"oye mira que no me esta guardando el correo ni agregandolo como usuario ni como lider de equipo revisa que pasa porfa"*

Tras realizar una auditoría de flujo de datos de extremo a extremo, se identificaron **4 causas raíz**:

1. **Pérdida de Atributos en `TeamSupervisionSummary` y Modal:**
   - La interfaz [`TeamSupervisionSummary`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/domain/admin.types.ts) no incluía `leaderEmail` ni `membersWithAccounts`.
   - En [`AdminDashboardService.handleCreateTeam`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/application/admin-dashboard.service.ts), al instanciar el nuevo equipo, no se guardaban `dto.leaderEmail` ni `dto.membersWithAccounts`.
   - En [`TeamModalComponent.ngOnChanges`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/team-modal.component.ts), al abrir un equipo para editarlo, se reiniciaban en duro `leaderEmail: ''` y `membersWithAccounts: []`, perdiendo visualmente lo ingresado.

2. **Falla de Actualización y Persistencia en `SecurityUsersService`:**
   - En [`ensureTeamLeaderAndMembers`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/security/application/security-users.service.ts), si el líder ya existía para ese equipo (`u.teamId === team.id`), se omitía cualquier actualización (no se actualizaba su correo ni su nombre).
   - Si no se agregaban nuevos usuarios (`toAdd.length === 0`), nunca se ejecutaba `this.persist(...)`, por lo que las actualizaciones a usuarios existentes no se guardaban en `localStorage` ni en el signal reactivo.
   - En [`handleUpdateTeam`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/application/admin-dashboard.service.ts), se llamaba a `ensureTeamLeaderAndMembers(merged)` sin pasar el `dto`, perdiendo los datos de cuentas.

3. **Autenticación sin Soporte de Correo Electrónico (`verifyAuthCredentials.ts`):**
   - [`verifyAuthCredentials`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/auth/application/verifyAuthCredentials.ts) solo buscaba equipos por slug/etnia/nombre. Si un misionero intentaba ingresar con su correo (`juan@misincol.org`), el sistema respondía que no se encontraba ninguna misión territorial.
 cuando llegues haz una pausa para organizar las credenciales me dices lo que se necesita para esas cosas porfa para poder veirifcar que es una cuenta usable y real con eso se organiza mucho mejor el tema de los correos y las notificaciones de la aplicacion a cada uno de lso usuarios 

4. **Sincronización con el Backend (`/api/teams`):**
   - El frontend operaba solo en memoria local sin enviar la petición HTTP `POST /api/teams` al backend dev server (`localhost:3000`).

---

## 2. Solución Técnica Propuesta

### A. Persistencia en Modelo de Dominio y Modal
1. Extender [`TeamSupervisionSummary`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/domain/admin.types.ts) con:
   - `leaderEmail?: string;`
   - `membersWithAccounts?: TeamMemberAccount[];`
2. En [`admin-dashboard.service.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/application/admin-dashboard.service.ts):
   - Al crear o actualizar equipo, persistir explícitamente `leaderEmail` y `membersWithAccounts`.
   - Enviar sincronización HTTP asíncrona hacia `http://localhost:3000/api/teams`.
   - En `handleUpdateTeam`, pasar el `dto` a `ensureTeamLeaderAndMembers(merged, updates as CreateTeamDto)`.
3. En [`team-modal.component.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/team-modal.component.ts):
   - En `ngOnChanges`, inicializar `leaderEmail` y `membersWithAccounts` a partir de `this.initialData`.

### B. Corrección de Aprovisionamiento en `SecurityUsersService`
1. Reestructurar `ensureTeamLeaderAndMembers`:
   - Si el líder ya existe por `teamId` o por `email`: actualizar inmutablemente su `email`, `fullName`, `phone` y asegurar su rol `team_leader`.
   - Si no existe: crearlo en `toAdd`.
   - Para integrantes: si ya existen por `email`, asociarlos al `teamId` y actualizar su nombre y rol `team_member`. Si no, crearlos.
   - Ejecutar siempre `this.persist(...)` con el nuevo arreglo de usuarios actualizado, garantizando reactividad instantánea en la tabla de Roles y Permisos.

### C. Soporte de Login con Correo en `verifyAuthCredentials.ts`
1. Permitir que el usuario ingrese su correo institucional/personal (`cleanUser`):
   - Buscar coincidencia con `t.leaderEmail` o con cualquier correo en `t.membersWithAccounts`.
   - Si coincide, validar la contraseña compartida del equipo y dar acceso exitoso al perfil de su misión.

---

## 3. Verificación de Calidad y Gobernanza
- Límite estricto de $\le 150$ líneas por archivo (.ts).
- 100% de suites de pruebas unitarias en verde en frontend y backend.
- Cero dependencias de SDKs comerciales opacos.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE APROBACIÓN EXPLÍCITA DEL USUARIO.
- **Pausa Obligatoria:** El sistema se detiene y espera tu confirmación o ajustes antes de aplicar los cambios.

