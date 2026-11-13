# Propuesta Técnica 031: Unificación de Credencial de Acceso Compartida por Equipo Misionero

## 1. Contexto y Requerimiento
El usuario ha solicitado simplificar la gestión de credenciales para los integrantes de un mismo equipo:
> *"oye todos los usuarios del mismo equipo sin importar si es líder de equipo o usuarios entran con la misma para solo crear una que la usan todos los de ese equipo"*

### Diagnóstico Técnico Actual:
1. **Frontend:**
   - Tanto [`TeamLeaderFieldsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-leader-fields.component.ts) como [`TeamMemberInputRowComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-member-input-row.component.ts) y [`TeamSettingsFieldsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-settings-fields.component.ts) manejaban campos de contraseña independientes por cada integrante y líder, generando redundancia y sobrecarga cognitiva.
2. **Backend:**
   - [`TeamUsersProvisioner`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/helpers/team-users-provisioner.ts) admitía contraseñas individuales en cada DTO de integrante (`m.password` y `dto.leaderPassword`), con fallback al `accessPin`.

---

## 2. Alcance de la Solución Técnica

### A. Frontend: Simplificación de la UI y Credencial Única
1. **Eliminar Campos de Contraseña Individual:**
   - En [`TeamMemberInputRowComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-member-input-row.component.ts): Eliminar el input de contraseña individual. La fila de cada integrante solo requerirá:
     - **Nombre Completo**: Identificación del misionero.
     - **Correo Electrónico (Login)**: Con lista desplegable de autocompletado y validación de usuarios existentes.
     - **Rol en la Misión**: Especialidad o función ministerial.
   - En [`TeamLeaderFieldsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamModal/team-leader-fields.component.ts): Eliminar el campo de contraseña personal del líder; mantener Nombre, Teléfono Móvil y Correo de Acceso.
2. **Credencial de Acceso Única y Centralizada del Equipo:**
   - La contraseña de acceso del equipo se gestiona en la sección de acceso/seguridad (`accessPin` / Contraseña del Equipo).
   - Un aviso visual informativo aclara: *"Todos los integrantes y el líder del equipo ingresarán con su propio correo institucional y esta misma contraseña compartida."*

---

### B. Backend: Aprovisionamiento Homogéneo en `TeamUsersProvisioner`
1. **Unificación de Hash en [`TeamUsersProvisioner`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/helpers/team-users-provisioner.ts):**
   - Se toma la contraseña única del equipo: `teamPassword = dto.accessPin || 'misincol2026'`.
   - El líder se aprovisiona con:
     - `email`: `cleanLeaderEmail`
     - `role`: `UserRole.ROLE_LIDER`
     - `teamId`: `team.id`
     - `password`: `teamPassword`
   - Todos los integrantes se aprovisionan con:
     - `email`: `cleanEmail`
     - `role`: `UserRole.ROLE_USUARIO`
     - `teamId`: `team.id`
     - `password`: `teamPassword`
2. **Limpieza de DTOs:**
   - Limpieza de `leaderPassword` y `password` individual de `TeamMemberAccountDto` en [`CreateTeamDto`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/dto/create-team.dto.ts).

---

### C. Cumplimiento de Gobernanza y Reglas de Oro
- **Límite Estricto de 150 Líneas:** Todos los archivos modificados permanecerán $\le 150$ líneas.
- **Cero SDKs Comerciales:** Criptografía estándar con Node.js nativo.
- **POO y Tipado Estricto:** Código limpio sin variables huérfanas ni parámetros innecesarios.

---

## 3. Plan de Pruebas Unitarias
1. **Backend Tests:**
   - Actualizar `team-users-provisioner.spec.ts` para verificar que tanto el líder como todos los integrantes se creen y autentiquen con la contraseña unificada del equipo.
   - Verificar `teams.service.spec.ts` y suites completas (`npm test`).
2. **Frontend Tests:**
   - Actualizar `team-member-input-row.component.spec.ts` para validar la interfaz simplificada sin campo de contraseña individual.
   - Ejecutar suites completas (`npm test`).

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN EXPLÍCITA DEL USUARIO.
- **Pausa Obligatoria:** En estricto cumplimiento del Artículo 2.2 y 4 del Contrato de Gobernanza, el sistema se detiene y espera tu confirmación o ajustes antes de modificar el código.

