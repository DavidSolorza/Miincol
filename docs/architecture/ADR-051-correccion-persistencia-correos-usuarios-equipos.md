# ADR-051: Corrección Integral de Persistencia y Login para Correos y Cuentas de Equipos

## Estado
Aprobado y Ejecutado

## Contexto
Se reportó que al crear o editar una misión territorial, el correo del líder y de los integrantes no se guardaba adecuadamente en el perfil del equipo ni se reflejaba como usuario en la vista de administración o de Roles y Permisos, y no era posible autenticarse en el sistema utilizando dicho correo electrónico.

## Decisiones Técnicas Adoptadas
1. **Persistencia en Dominio y Modal:**
   - Se agregaron las propiedades `leaderEmail?: string;` y `membersWithAccounts?: TeamMemberAccount[];` en [`TeamSupervisionSummary`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/domain/admin.types.ts) (86 líneas).
   - En [`AdminDashboardService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/application/admin-dashboard.service.ts) (143 líneas), se almacenan explícitamente `leaderEmail` y `membersWithAccounts` al crear o actualizar el equipo, y se dispara una sincronización asíncrona hacia el backend (`POST /api/teams`).
   - En [`TeamModalComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/team-modal.component.ts) (133 líneas), `ngOnChanges` inicializa y preserva `leaderEmail` y `membersWithAccounts` desde `initialData`.

2. **Aprovisionamiento Inmutable y Reactivo en `SecurityUsersService`:**
   - En [`SecurityUsersService.ensureTeamLeaderAndMembers`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/security/application/security-users.service.ts) (139 líneas):
     - Si el líder ya existe en el sistema o para ese `teamId`, se actualiza su correo (`leaderEmail`), nombre y teléfono, asignando el rol `team_leader`.
     - Si los integrantes con cuenta ya existen, se asocian a la misión y se actualiza su nombre y rol `team_member`; si no existen, se crean.
     - Se ejecuta siempre `this.persist(...)` con el nuevo arreglo inmutable de usuarios, actualizando de forma instantánea el `signal<SystemUser[]>` y la tabla de Roles y Permisos en `localStorage`.

3. **Autenticación con Correo Electrónico:**
   - En [`verifyAuthCredentials`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/auth/application/verifyAuthCredentials.ts) (92 líneas), se incorporó la verificación por correo tanto para el líder (`t.leaderEmail`) como para los integrantes (`t.membersWithAccounts`), permitiendo el inicio de sesión directo con la contraseña/PIN del equipo.

4. **Regla Inviolable de 150 Líneas y Pruebas Unitarias:**
   - Todos los archivos modificados cumplen estrictamente la regla $\le 150$ líneas.
   - 100% de suites de pruebas unitarias en verde (16 suites frontend con 53 pruebas; 9 suites backend con 39 pruebas).

## Consecuencias
- Los correos del líder y de los integrantes se guardan permanentemente en el equipo y se visualizan al reabrir el modal de edición.
- Los usuarios aparecen inmediatamente en la tabla de Roles y Permisos.
- Los colaboradores pueden iniciar sesión ingresando su correo electrónico y la clave compartida de su misión territorial.

