# Propuesta Técnica 030: Creación Integrada de Integrantes de Equipo con Cuentas de Acceso, Rol y Perfil Misionero

## 1. Contexto y Requerimiento
El usuario ha solicitado formalizar la provisión de usuarios desde el modal de administración de equipos:
> *"en la casilla de integrantes de equipo al crear nuevo equipo en la vista de administrador, pedir el correo y que los agregue de una vez como usuarios con rol y en el back se haga toda la configuración para que ese usuario con ese correo va a entrar a ese perfil con esa contraseña"*

### Diagnóstico Técnico:
1. **Frontend:**
   En [`TeamLeaderFieldsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-leader-fields.component.ts), los integrantes se ingresaban como una cadena plana separada por comas (`David Morales, Carlos Pushaina`), sin solicitar correo electrónico ni permitir asignar contraseña individual para cada obrero.
2. **Backend:**
   [`TeamsService.create`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/teams.service.ts) creaba la entidad `Team`, pero no provisionaba automáticamente las cuentas de usuario en [`UsersService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/users/users.service.ts). Como resultado, los integrantes del equipo no podían iniciar sesión con sus credenciales ni acceder al perfil territorial correspondiente.

---

## 2. Alcance de la Solución Técnica

### A. Frontend: Formulario Dinámico de Integrantes de Equipo
1. **Lista Estructurada de Miembros en `team-leader-fields.component.ts`:**
   - Cada integrante contará con:
     - `fullName`: Nombre y Apellido.
     - `email`: Correo institucional / personal para el login.
     - `roleInTeam`: Rol ministerial (ej. *Obrera Misionera*, *Evangelista*, *Discipulado*).
     - `password`: Contraseña de acceso (con opción de heredar el PIN del equipo o ingresar una personalizada).
   - Botón `+ Agregar Integrante` con campos limpios y botón para eliminar fila.
2. **Subcomponente Atómico de Fila (`team-member-input-row.component.ts`):**
   - Para no sobrepasar las 150 líneas en `team-leader-fields.component.ts`, crearemos un subcomponente reutilizable para cada tarjeta/fila de integrante. tambien agregar la lista desplegable de usuarios que estan ya en la base de datos para no ir a duplicar un usuario existente.

---

### B. Backend: Provisión Automática de Cuentas y Vinculación a Equipo
1. **DTO Extendido en `backend/src/teams/dto/create-team.dto.ts`:**
   - Definir `TeamMemberAccountDto`:
     ```typescript
     export class TeamMemberAccountDto {
       @IsString() @IsNotEmpty() fullName: string;
       @IsEmail() @IsNotEmpty() email: string;
       @IsString() @IsOptional() roleInTeam?: string;
       @IsString() @IsOptional() password?: string;
     }
     ```
   - Incluir `membersWithAccounts?: TeamMemberAccountDto[]` y `leaderEmail?: string` en `CreateTeamDto`.
2. **Aprovisionador Especializado (`team-users-provisioner.ts`):**
   - Ubicación: `backend/src/teams/helpers/team-users-provisioner.ts` ($\le 90$ líneas, SRP).
   - Recibe el `Team` creado y la lista de integrantes.
   - Para cada integrante y para el líder:
     - Crea la cuenta en `UsersService.create(...)` con:
       - `email`: normalizado en minúsculas.
       - `fullName`: nombre limpio.
       - `role`: `UserRole.ROLE_USUARIO` (para integrantes) o `UserRole.ROLE_LIDER` (para el líder).
       - `teamId`: el ID del equipo recién creado (`newTeam.id`).
       - `password`: la contraseña elegida o el PIN del equipo (`accessPin`).
   - Sincroniza los miembros en la lista `newTeam.members`.
3. **Flujo de Autenticación (`AuthService`):**
   - El usuario recién creado ya puede ingresar inmediatamente en `/api/auth/login` con su `email` y `password`, recibiendo el token JWT vinculado a `teamId`.

---

### C. Arquitectura y Regla Inviolable de 150 Líneas
- Todos los archivos nuevos y modificados se mantendrán estrictamente $\le 150$ líneas.
- Principios SOLID: El aprovisionamiento de usuarios se aísla en `TeamUsersProvisioner` sin inflar `TeamsService`.

---

## 3. Plan de Pruebas Unitarias e Integración
1. **Pruebas de Backend:**
   - `team-users-provisioner.spec.ts`: Verificar que al crear un equipo con 2 integrantes, se generen automáticamente 2 usuarios con rol `ROLE_USUARIO` asociados al `teamId`.
   - `teams.service.spec.ts`: Verificar la creación completa del equipo y provisión de cuentas.
   - `auth.service.spec.ts`: Validar que el nuevo usuario puede autenticarse exitosamente y recibir el perfil de su equipo.
2. **Pruebas de Frontend:**
   - Validar que el formulario agregue y emita los integrantes con nombre, correo y contraseña.
3. Ejecutar 100% de suites en verde.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Límite de Líneas:** Todos los archivos $\le 150$ líneas.
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN EXPLÍCITA DEL USUARIO.
- **Pausa Obligatoria:** No se modificará el código fuente hasta contar con la autorización explícita del usuario.

