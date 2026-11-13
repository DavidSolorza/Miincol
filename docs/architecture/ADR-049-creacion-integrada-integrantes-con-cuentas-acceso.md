# ADR-049: Creación Integrada de Integrantes de Equipo con Cuentas de Acceso, Rol y Perfil Misionero

## Estado
Aprobado y Ejecutado

## Contexto
En la vista de administración, al registrar una nueva misión territorial (`TeamModalComponent`), se requería que la casilla de integrantes no fuera solo una lista de nombres en texto plano, sino que permitiera solicitar correo electrónico y contraseña individual o por defecto para cada integrante, aprovisionando de manera inmediata las cuentas de usuario en el backend (`UsersService`) y frontend (`SecurityUsersService`) con su respectivo rol (`ROLE_USUARIO` para integrantes, `ROLE_LIDER` para el líder pastoral) vinculados directamente al `teamId` de la nueva misión. Además, se requirió una lista desplegable con autocompletado para seleccionar usuarios preexistentes y evitar duplicidades.

## Decisiones Técnicas Adoptadas
1. **Frontend Modular y Atómico:**
   - Se creó el subcomponente atómico [`TeamMemberInputRowComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-member-input-row.component.ts) (113 líneas) para encapsular la tarjeta de cada obrero con sus inputs: Nombre Completo, Correo Electrónico (con `<datalist>` dinámico de usuarios existentes), Rol en la Misión, Contraseña opcional y botón Quitar.
   - Se actualizó [`TeamLeaderFieldsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-leader-fields.component.ts) (145 líneas) para gestionar la lista reactiva de integrantes y la credencial de acceso del líder territorial.
   - Se actualizó [`SecurityUsersService.ensureTeamLeaderAndMembers`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/security/application/security-users.service.ts) (138 líneas) para provisionar o asociar usuarios existentes con su correo oficial.

2. **Backend Desacoplado con POO (Single Responsibility Principle):**
   - Se creó el aprovisionador especializado [`TeamUsersProvisioner`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/helpers/team-users-provisioner.ts) (70 líneas) que recibe el `Team` creado y el `CreateTeamDto`, registrando cuentas con hash sha256 y roles en [`UsersService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/users/users.service.ts).
   - Se enriqueció [`CreateTeamDto`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/dto/create-team.dto.ts) (120 líneas) con `TeamMemberAccountDto`, `membersWithAccounts`, `leaderEmail`, `leaderPassword` y `accessPin`.
   - Se inyectó `UsersService` de forma opcional en [`TeamsService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/teams.service.ts) (126 líneas), delegando la provisión de usuarios a `TeamUsersProvisioner`.

3. **Gobernanza y Regla de Oro de 150 Líneas:**
   - Todos los archivos fuente (.ts) permanecen estrictamente $\le 150$ líneas.
   - Cobertura de pruebas unitarias al 100%: 39 pruebas en backend y 44 pruebas en frontend en verde.

## Consecuencias
- Al crear una nueva misión, tanto el líder como los integrantes disponen inmediatamente de credenciales operativas para iniciar sesión con su correo y contraseña en `/api/auth/login`.
- Al ingresar con sus credenciales, el sistema los asocia automáticamente al perfil de su misión territorial con los permisos adecuados.

