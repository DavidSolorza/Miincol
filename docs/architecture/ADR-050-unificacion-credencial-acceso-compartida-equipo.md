# ADR-050: Unificación de Credencial de Acceso Compartida por Equipo Misionero

## Estado
Aprobado y Ejecutado

## Contexto
El usuario solicitó que todos los integrantes de un mismo equipo (tanto el líder como los usuarios obreros) utilicen la misma contraseña de acceso para simplificar la creación y evitar la dispersión de contraseñas individuales por persona:
> *"todos los usuarios del mismo equipo sin importar si es lider de equipo o usuarios entran con la misma para solo crear una que la usan todos los de ese equipo"*

## Decisiones Técnicas Adoptadas
1. **Frontend Simplificado:**
   - En [`TeamMemberInputRowComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-member-input-row.component.ts) (101 líneas), se eliminó la casilla de contraseña individual. La fila solicita exclusivamente: **Nombre Completo**, **Correo Electrónico (Login)** con autocompletado y validación de duplicados, y **Rol en la Misión**.
   - En [`TeamLeaderFieldsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-leader-fields.component.ts) (138 líneas), se eliminó la casilla de contraseña personal del líder y se incluyó un aviso visual indicando que todos los miembros del equipo acceden con su propio correo y la contraseña compartida del equipo (`accessPin`).
   - En [`admin.types.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/domain/admin.types.ts) y [`TeamModalComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/team-modal.component.ts), se removieron los atributos obsoletos de contraseñas individuales.

2. **Backend Unificado en `TeamUsersProvisioner`:**
   - En [`TeamUsersProvisioner`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/helpers/team-users-provisioner.ts) (70 líneas), se extrae la credencial única del equipo `teamPassword = dto.accessPin?.trim() || 'misincol2026'`.
   - Tanto el líder (`ROLE_LIDER`) como todos los integrantes (`ROLE_USUARIO`) se aprovisionan en [`UsersService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/users/users.service.ts) con su respectivo correo y el mismo hash SHA-256 de `teamPassword`.
   - En [`CreateTeamDto`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/dto/create-team.dto.ts) (112 líneas), se removieron `leaderPassword` y `password` individual de `TeamMemberAccountDto`.

3. **Gobernanza y Regla de 150 Líneas:**
   - Todos los archivos modificados cumplen estrictamente la regla $\le 150$ líneas.
   - 100% de pruebas unitarias pasando (39 en backend, 50 en frontend).

## Consecuencias
- El proceso de alta de una misión territorial es mucho más ágil y libre de errores.
- Se evita la gestión de múltiples contraseñas por equipo; cada misionero entra con su correo propio y la clave única del equipo, accediendo directamente a su perfil territorial.

