# Propuesta Técnica 040: Soporte de Rol Dual (Líder Nacional con Equipo Local) y Autenticación Bivalente

## 1. Contexto y Requerimiento
El usuario ha detectado un comportamiento no deseado y ha solicitado una mejora estructural:
> *"oye mira que le cambio el rol a hugo, se lo pongo como admin, y me lo vuelve a poner como usuario de lider de equipo, pon esa relacion que un lider nacional puede tener un equipo y se muestra o se selecciona el rol más alto pero usar la contraseña de su rol de equipo o de admin redirigiéndolo a cualquiera de las dos vistas"*

### Diagnóstico de la Causa Raíz:
1. **Reversión Forzada del Rol de Hugo:**
   - En `frontend/src/features/security/application/security-users-provision.helper.ts` (línea 22), cada vez que `admin-dashboard.service.ts` arranca, ejecuta:
     ```typescript
     this.allTeams().forEach((t) => this.securityUsersSvc.ensureTeamLeaderAndMembers(t));
     ```
   - Al encontrar al líder del equipo (`existingLeader`), sobreescribe incondicionalmente:
     ```typescript
     existingLeader.role = 'team_leader';
     ```
   - Esto degrada a Hugo de `national_director` a `team_leader` de forma destructiva cada vez que se cargan los equipos o se recarga la aplicación.

2. **Falta de Reconocimiento del Rol Jerárquico Más Alto:**
   - Un usuario puede ser simultáneamente **Pastor/Líder de un equipo territorial local** (ej. Misión Pastos) y **Coordinador de Equipos / Director Nacional** a nivel país.
   - En estos casos, el sistema debe preservar siempre el **rol de mayor rango (`national_director`)**, manteniendo intacta la vinculación a su equipo (`teamId: 'team-pastos'`).

3. **Autenticación y Redirección Bivalente:**
   - Actualmente, el login valida estrictamente contraseñas por pestaña (`admin` vs `team`).
   - Un líder nacional con equipo debe poder ingresar con:
     - La contraseña de su equipo territorial (ej. `pastos2026`).
     - O la contraseña de administración nacional (`director2026`, `admin2026`).
   - El sistema debe redirigir de forma coherente según la vía de acceso (o permitir alternar fluidamente entre el Dashboard Nacional y el PDM de su misión).

---

## 2. Solución Técnica Propuesta

### A. Jerarquía de Roles y Protección de Rango Máximo (`security-users-provision.helper.ts`)
1. Implementar función de comparación de rangos:
   - Rango 4: `national_director` (Coordinador de Equipos)
   - Rango 3: `director_general` (Director General)
   - Rango 2: `team_leader` (Líder de Equipo)
   - Rango 1: `team_member` (Usuario de Equipo)
2. En `resolveTeamUsersToProvision`:
   - Si `existingLeader` ya posee un rol de mayor o igual jerarquía (ej. `national_director`), **no degradar su rol a `team_leader`**.
   - Preservar su `teamId`, `teamName`, y datos de contacto, respetando su estatus de Coordinador Nacional con equipo asignado.

### B. Persistencia y Sincronización en Backend (`security-users.service.ts`)
- Asegurar que al ejecutar `updateUserRole(userId, 'national_director')`, el cambio se almacene inmediatamente en `localStorage` y en la persistencia del backend sin ser revertido por sincronizaciones en segundo plano.

### C. Autenticación Bivalente (`verifyAuthCredentials.ts`)
1. Si las credenciales corresponden a un usuario que es `national_director` y además tiene un `teamId` asignado:
   - Validar exitosamente si ingresa con la contraseña del equipo territorial (ej. `accessPin` / `${slug}2026`).
   - O si ingresa con la contraseña maestra de administración (`director2026` / `admin2026`).
2. Generar una sesión enriquecida en `AppSessionService`:
   ```typescript
   {
     role: 'admin',
     teamId: 'team-pastos',
     userName: 'Hugo (Coordinador Pastos)'
   }
   ```
3. Comportamiento de redirección según el origen:
   - Si inició sesión en la pestaña **Administración**: dirigir a `superadmin` (Dashboard Nacional).
   - Si inició sesión en la pestaña **Equipo Territorial**: dirigir a `general` (Información de su Misión).
   - En ambas vistas, el usuario cuenta con el botón **`[Volver al Dashboard]`** o **`[Ver Mi Misión]`** para alternar instantáneamente entre su labor territorial y su labor nacional.

### D. Navegación Fluida en Barra Superior y Lateral (`app-header.component.ts`, `plan-sidebar.component.ts`)
- Habilitar el acceso directo al **Tablero Nacional** en el header y sidebar siempre que `session.role === 'admin'`, sin requerir que esté activado el modo "preview".
- Si el administrador tiene un equipo propio (`teamId`), incluir un acceso directo tipo pill: *"Mi Misión: Pastos"* para ir directamente a su propio PDM con un solo clic.

---

## 3. Plan de Pruebas y Validación
1. **Prueba de Asignación de Rol:**
   - Asignar a Hugo como `Coordinador de equipos`.
   - Recargar la página y verificar que el rol permanezca en `COORDINADOR DE EQUIPOS` con su distintivo oscuro/dorado y su equipo `Pastos`.
2. **Prueba de Login Bivalente:**
   - Iniciar sesión con `hugopastos@misincol.org` usando la contraseña territorial `pastos2026` ➡️ Acceso concedido con facultades de admin y equipo.
   - Iniciar sesión con `hugopastos@misincol.org` usando la contraseña nacional `director2026` ➡️ Acceso concedido directo al Dashboard Nacional.
3. **Prueba de Navegación Cruzada:**
   - Desde el Dashboard Nacional, ingresar a Misión Pastos.
   - Desde Misión Pastos, pulsar "Volver al Dashboard" y regresar sin perder sesión.
4. **Pruebas Automatizadas:**
   - Ejecutar suites de pruebas frontend y backend (`npm test`).
   - Verificar compilación (`npm run build`).
   - Verificar límite de 150 líneas por archivo en todos los archivos modificados.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PROPUESTA GENERADA - Esperando aprobación / luz verde del usuario para iniciar la fase de ejecución.
