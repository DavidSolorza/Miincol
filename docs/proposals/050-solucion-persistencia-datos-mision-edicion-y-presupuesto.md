# Propuesta Técnica 050: Solución Integral a Persistencia de Datos de Misiones, Edición y Presupuesto

**Estado:** Propuesta formal para evaluación y feedback  
**Fecha:** 2026-11-14  
**Autor:** Orquestador Técnico & Staff Software Architect  
**Módulos:** `frontend/src/features/admin/`, `frontend/src/features/plans/`, `backend/src/teams/`

---

## 1. Diagnóstico de Causa Raíz

El usuario reporta dos fallos críticos en la gestión de misiones territoriales:
1. Al crear una misión e intentar editarla, los campos **Etnia**, **Municipio / Territorio** y **Teléfono** aparecen vacíos, forzando al usuario a completarlos nuevamente y bloqueando el guardado por validación HTML5.
2. El valor del **Presupuesto Anual** no aparece en la tarjeta del equipo o se reinicia a 0.

### Análisis Técnico Detallado:
1. **Pérdida de campos territoriales en la sincronización backend:**
   - En `admin-teams-sync.helper.ts` (`syncTeamCreatedToBackend`), la petición `POST /teams` enviaba un payload incompleto: omitía `ethnicity`, `region`, `department`, `leaderPhone` y `themeColor`.
   - Al ejecutarse `syncFromBackend()` en `AdminDashboardService`, el backend devolvía la lista de equipos donde estos campos eran `undefined`.
   - La lista local reactiva se sobreescribía con datos incompletos del backend, dejando `ethnicity`, `region` y `leaderPhone` en blanco.
2. **Falta de endpoint de actualización (`PUT/PATCH /teams/:id`):**
   - El controlador backend `TeamsController` no exponía `@Put(':id')` ni `@Patch(':id')`, por lo que las ediciones locales nunca se persistían en el servidor.
3. **Sobreescritura del Presupuesto Anual por métricas de fase:**
   - En `admin-dashboard.service.ts`, al mapear los equipos se aplicaba:
     `...t, ...getTeamPhaseMetrics(t.id, t.currentPhaseId, t)`.
   - `getTeamPhaseMetrics` calcula `totalBudget` a partir de la sumatoria de actividades planificadas. Para una misión recién creada (con 0 actividades), esta función retorna `totalBudget: 0`.
   - Al propagar `...getTeamPhaseMetrics` **después** de `...t`, el `0` de las actividades sobreescribía el presupuesto anual asignado (ej. $15.000.000 COP), haciendo que en la tarjeta se mostrara `$ 0` de presupuesto.

---

## 2. Plan de Solución Arquitectónica

### A. Frontend (`features/admin/`)
1. **`admin-teams-sync.helper.ts`:**
   - Enviar el payload completo en `syncTeamCreatedToBackend`: `name`, `ethnicity`, `region`, `department`, `location`, `leader`, `leaderPhone`, `leaderEmail`, `totalBudget`, `themeColor`, `accessPin`, `currentPhaseId`, `membersWithAccounts`.
   - Implementar `syncTeamUpdatedToBackend(teamId, updates)` con llamada `PUT /teams/:id`.
2. **`admin-dashboard.service.ts`:**
   - En `handleUpdateTeam`: Invocar `syncTeamUpdatedToBackend`.
   - En `syncFromBackend`: Implementar *Smart Merge*. Si el backend retorna campos vacíos, preservar los valores locales existentes (`ethnicity`, `region`, `department`, `leaderPhone`). Parsear `location` (ej. `"Nariño - Cumbal"`) si `department` o `region` faltasen.
   - **Blindaje del Presupuesto:** Al mapear `getTeamPhaseMetrics`, preservar estrictamente el `totalBudget` anual del equipo:
     `totalBudget: (t.totalBudget && t.totalBudget > 0) ? t.totalBudget : (phaseMetrics.totalBudget || 15000000)`.

### B. Backend (`backend/src/teams/`)
1. **`TeamsController`:** Exponer `@Put(':id')` con guardia `@Roles(UserRole.ROLE_NACIONAL)` para actualizar misiones existentes.
2. **`CreateTeamDto` & `Team` entity:** Permitir y persistir `id`, `slug`, `ethnicity`, `region`, `department`, `leaderPhone`, `themeColor`.

---

## 3. Impacto y Gobernanza
- **Límite de Líneas:** Todos los archivos modificados permanecerán estrictamente $\le 150$ líneas.
- **Transparencia:** Cero pérdida de datos al crear, consultar o editar misiones territoriales.

