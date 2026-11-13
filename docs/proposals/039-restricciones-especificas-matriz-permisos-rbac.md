# Propuesta Técnica 039: Restricciones Específicas vs Generalidades en Matriz de Roles y Permisos (RBAC)

## 1. Contexto y Requerimiento
El usuario ha solicitado:
> *"agrega ese tipo de cosas como restricciones en la parte de matriz de permisos porfa la idea es que estén unas generalidades pero hay otras que deben de ser más específicas, revisa esa lógica aplícala a la matriz de roles tanto en front como el back, revisa que funcione correctamente porfa. tienes luz verde para eso"*

### Diagnóstico de Necesidades:
1. **Diferenciación entre Generalidades y Restricciones Específicas:**
   - **Generalidades (Permisos Conmutables):** Privilegios operativos que el Coordinador de Equipos puede activar o desactivar según la dinámica territorial de cada misión (ej. exportación de informes, gestión de notas, asignación de tareas a miembros, etc.).
   - **Restricciones Específicas (Reglas de Gobernanza Inviolables):**
     - **Coordinador de Equipos (`national_director`):** Permisos raíz de seguridad y telemetría nacional protegidos permanentemente (`security.roles.manage`, `audit.history.view`, `reports.national.view`, `pdm.view`). No pueden ser desactivados para prevenir bloqueos del sistema.
     - **Director General (`director_general`):** Rol institucional de observación pasiva y auditoría. Restricción estricta bloqueada en FALSO para mutaciones operativas (`pdm.activities.edit`, `pdm.activities.delete`, `pdm.objectives.manage`, `security.roles.manage`, `team.members.manage`).
     - **Usuario de Equipo (`team_member`):** Personal operativo de campo. Restricción estricta bloqueada en FALSO para la administración de seguridad, auditoría, telemetría nacional y reestructuración de objetivos macro.
     - **Líder de Equipo (`team_leader`):** Pastor territorial. Con facultades locales de misión, pero con restricción estricta bloqueada en FALSO para la gestión de roles de sistema y telemetría nacional fuera de su territorio.
2. **Nuevos Permisos Específicos Relevantes:**
   - `cycle.year.manage`: Control y ajuste del año ministerial activo (restricción exclusiva de Dirección Nacional).
   - `budget.pillar.manage`: Asignación y modificación de techos presupuestales por pilar.
3. **Claridad Visual y Ergonómica en la Matriz (`app-security-matrix-table`):**
   - Distinción visual inmediata con 3 estados:
     1. **`PROTECTED` (✓ Verde/Oscuro con candado):** Privilegio esencial permanente y protegido.
     2. **`RESTRICTED` (✕ Gris atenuado no clickeable):** Acción fuera del alcance institucional del perfil.
     3. **`CONFIGURABLE` (Botón interactivo conmutable):** Generalidad adaptable por la Dirección Nacional.

---

## 2. Alcance de la Solución Técnica

### A. Frontend (`security.types.ts`, `security-matrix.service.ts`, `security-matrix-table.component.ts`)
1. **Definición de Restricciones en `security-constraints.helper.ts`:**
   - Función pura `getRolePermissionRestriction(roleId, permKey)` que dictamina si una casilla es:
     - `protected` (fijo en `true`, mensaje explicativo)
     - `restricted` (fijo en `false`, mensaje explicativo)
     - `configurable` (editable libremente por el administrador)
2. **Validación en `SecurityMatrixService.togglePermission()`:**
   - Si el usuario intenta alternar una casilla con restricción, se emite una advertencia visual (`ToastService`) con la razón de gobernanza correspondiente.
3. **Diseño Visual en `SecurityMatrixTableComponent`:**
   - Casillas protegidas: `bg-stone-900 text-[#E67324]` con ícono de verificación y tooltip *"Privilegio protegido obligatorio"*.
   - Casillas restringidas: `bg-stone-100 text-stone-300 border border-stone-200 cursor-not-allowed` con tooltip *"Restricción de perfil de seguridad"*.
   - Casillas configurables: botón interactivo verde (`✓`) o blanco (`✕`).

### B. Backend (`security.service.ts` y `security-matrix.entity.ts`)
1. **Validador de Restricciones en `SecurityService.updateMatrix()`:**
   - Aplica las mismas reglas de gobernanza en el servidor para evitar que peticiones externas o APIs vulneren los privilegios raíz o concedan facultades de seguridad a roles de campo.
2. **Persistencia en `backend/data/security-matrix.json`:**
   - Actualización del archivo de datos asegurando la coherencia completa de la matriz.

---

## 3. Plan de Pruebas y Validación
1. **Pruebas de la Matriz:**
   - Comprobar que las casillas restringidas del Director General y Usuario de Equipo no puedan activarse y muestren el distintivo atenuado.
   - Comprobar que los privilegios raíz del Coordinador de Equipos permanezcan protegidos en verde/oscuro.
   - Comprobar que las generalidades (ej. notas, reportes locales, tareas) sigan siendo conmutables con un clic y se guarden con el botón *"Guardar Matriz"*.
2. **Pruebas Unitarias Automatizadas:**
   - Ejecutar suites en frontend y backend (`npm test`).
   - Compilar frontend y backend sin errores.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** AUTORIZADO Y EN EJECUCIÓN (Luz verde explícita del usuario).

