# Propuesta Técnica 042: Gestión de Año Ministerial 2026 desde Admin y Soporte de Rol Dual (Hugo)

## 1. Diagnóstico de los Requerimientos Visuales

A partir de las dos capturas de pantalla suministradas por el usuario:

### A. Imagen 1: Seguimiento Multianual de Campo en Año 2029
- **Problema:** La tabla comparativa multianual tiene fijado como activo el **"Año 2029 (Activo)"**, desplazando el año en curso (2026) y mostrando métricas vacías o no editables para el período real.
- **Causa:** No existe en el **Tablero de Supervisión Nacional (Admin)** un panel o control centralizado para organizar, supervisar y fijar el ciclo ministerial activo de las misiones. Al avanzar de año en una misión particular o en pruebas, el valor quedó en 2029 en el almacenamiento local.
- **Solución Requerida:** 
  1. Habilitar en la vista de Admin (`super-admin-view.component.ts` / cabecera) un control de **"Ciclo Ministerial Nacional"** para seleccionar el año ministerial activo (2025, 2026, 2027, etc.) y un botón **"↺ Fijar Año Oficial 2026 para Todas las Misiones"**.
  2. Sincronizar de inmediato el año activo en `GeneralInfoService` y en todas las misiones territoriales para que la tabla multianual presente:
     - `Año 2025 (Histórico)`
     - `Año 2026 (Activo Oficial)`
     - `Año 2027 (Proyectado)`

---

### B. Imagen 2: Asignación de Roles por Colaborador y Rol Dual de Hugo
- **Problema:** Al intentar cambiar el rol de Hugo (`hudisapastos@misincol.org`) a Administrador/Director Nacional en la tabla de asignación de roles, el sistema lo devuelve a "Líder equipo".
- **Causa:** En `resolveTeamUsersToProvision.ts` y `admin-dashboard.service.ts`, cada vez que se cargan los equipos o se reasignan roles, el helper busca al líder de `team-pastos` y degrada forzosamente a quien esté vinculado al equipo al rol `team_leader`. Además, `verifyAuthCredentials.ts` solo permitía acceso de admin a correos duros (`director@misincol.org`, `admin@misincol.org`), bloqueando a Hugo o no reconociendo su rol superior.
- **Solución Requerida:**
  1. **Protección del Rol Máximo (`ROLE_RANK`):** Si un usuario tiene rango superior (`national_director` o `director_general`), **jamás se degrada a `team_leader`**, pero conserva su vínculo territorial (`teamId: 'team-pastos'`).
  2. **Autenticación Bivalente en Login:** Hugo puede iniciar sesión desde la pestaña **Admin** o **Equipo**, usando:
     - La contraseña/PIN de su equipo (`pastos2026`).
     - O la contraseña de administración nacional (`director2026` / `admin2026`).
  3. **Redirección Coherente y Navegación Cruzada:**
     - Si ingresa por pestaña Admin (o contraseña admin) ➡️ Se le redirige al Tablero de Supervisión Nacional (`superadmin`).
     - Si ingresa por pestaña Equipo (o contraseña de equipo) ➡️ Se le redirige a la vista de su Misión (`general`/`plans`).
     - En ambas vistas dispone de los botones para alternar entre el Tablero Nacional y su misión sin cerrar sesión.

---

## 2. Plan de Implementación Modular (< 150 líneas por archivo)

| Módulo / Archivo | Acción Técnica |
| :--- | :--- |
| `frontend/src/features/admin/infrastructure/superAdmin/admin-year-cycle-control.component.ts` | **Nuevo Componente (< 100 líneas):** Selector de año ministerial y botón de restablecimiento rápido a 2026 en el panel de administración. |
| `frontend/src/features/admin/infrastructure/super-admin-view.component.ts` | Integrar el control de ciclo anual en la cabecera de supervisión. |
| `frontend/src/features/general-info/application/general-info.service.ts` | Asegurar que `setActiveYear(2026)` y `resetAllTeamsToOfficialYear(2026)` alineen las misiones al año en curso. |
| `frontend/src/features/security/application/security-users-provision.helper.ts` | Respetar jerarquía: jamás degradar un usuario con rol de `national_director` o `director_general` a `team_leader`. |
| `frontend/src/features/security/application/security-users.service.ts` | Persistir de forma atómica y evitar sobreescritura accidental del rol de Hugo. |
| `frontend/src/features/auth/application/verifyAuthCredentials.ts` | Reconocer rol dual para login con contraseña de equipo o admin y redirección apropiada. |

---

## 3. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PROPUESTA FORMAL GENERADA. Esperando confirmación y aprobación explícita del usuario para iniciar la fase de ejecución.

