# Propuesta Técnica 053: Sincronización Dinámica del Presupuesto por Pilares y Eliminación de Valores Mock en Información General

## 1. Diagnóstico del Problema

### ¿Es problema del Backend o del Frontend?
**Confirmación empírica:** El backend (`misincolBack` en `https://misincol-api.servidor.blog/api/teams`) está **completamente limpio y correcto**.
Al consultar el equipo `Pastos` (`team-1794669236596`), el backend devuelve:
```json
{
  "id": "team-1794669236596",
  "name": "Pastos",
  "totalBudget": 15000000,
  "pillarBudgets": {
    "investigacion": 0,
    "encarnacion": 0,
    "evangelizacion": 0,
    "entrenamiento": 0,
    "autocuidado": 0
  }
}
```
El servidor tiene todos los pilares en **$ 0**. No es necesario modificar el backend.

### Causa Raíz en el Frontend
1. **Mock Hardcodeado en `createDefaultGeneralInfo` (`frontend/src/features/general-info/domain/general-info-defaults.ts`):**
   El código semilla heredado de prototipos anteriores asignaba por defecto:
   ```typescript
   budgetBreakdown: {
     investigacionBudget: 0, encarnacionBudget: 0, evangelizacionBudget: 0,
     entrenamientoBudget: 11210000, autocuidadoBudget: 0, executedTotalBudget: 4500000,
   }
   ```
2. **Persistencia en `localStorage` de Valores Ficticios:**
   `GeneralInfoService.loadTeamInfo` guardaba y leía ese objeto en `misincol_general_info_v3_${teamId}`, por lo que al abrir la misión Pastos se cargaba siempre `$ 11.210.000` en Entrenamiento y `$ 4.500.000 (40%)` en Gastado.
3. **Falta de Cálculo Dinámico desde los Planes PDM Reales:**
   `GeneralInfoService` no calculaba los presupuestos de cada pilar sumando las actividades reales de cada fase del plan (`investigacion`, `encarnacion`, `evangelizacion`, `entrenamiento`, `autocuidado`). Por tanto, si un equipo no tiene objetivos o actividades creadas, los pilares debían ser `$ 0`, y solo al agregar actividades con presupuesto debían reflejar ese valor.

---

## 2. Solución Propuesta

### A. Limpieza de Valores Semilla (`general-info-defaults.ts`)
- Inicializar `budgetBreakdown` en **0** absoluto para todos los pilares (`investigacionBudget: 0`, `encarnacionBudget: 0`, `evangelizacionBudget: 0`, `entrenamientoBudget: 0`, `autocuidadoBudget: 0`, `executedTotalBudget: 0`).
- Limpiar igualmente las métricas ficticias iniciales para que una misión nueva inicie en blanco.

### B. Cálculo Dinámico de Presupuesto por Pilar (`GeneralInfoService`)
- Al cargar o actualizar la información de un equipo (`loadTeamInfo`), computar el desglose real de pilares a partir de los planes PDM (`getPlansForTeam(teamId)`):
  - Cada pilar será la suma real de `totalBudget` de las actividades pertenecientes a los objetivos de esa fase.
  - Si un equipo no tiene objetivos creados, todos los pilares reflejarán automáticamente **$ 0**.
  - `executedTotalBudget` será la suma de las actividades cuyo estado sea `'Completado'`.
- Sobrescribir cualquier remanente corrupto o mock antiguo almacenado en `localStorage`.

### C. Conexión de Presupuesto Total Anual en `GeneralInfoViewComponent`
- Enviar a `app-general-budget-top`:
  - `totalBudget`: El presupuesto anual real asignado al equipo (ej. `$ 15.000.000`), o la suma de pilares si este no está definido.
  - `budget`: El desglose calculado de los 5 pilares (todos en $ 0 si no hay objetivos).
  - `budgetPercentage`: 0% si no hay ejecución.
  - `executedBudget`: $ 0 si no hay actividades completadas.
  - `Queda`: `$ 15.000.000 (100%)`.

---

## 3. Plan de Pruebas y Validación
1. Pruebas unitarias de cálculo presupuestal en `frontend/src/features/general-info/domain/general-info.calculations.spec.ts`.
2. Verificación de que todos los archivos modificados cumplan con la regla de $\le 150$ líneas.
3. Ejecución de `npm --prefix frontend test -- --run` y `npm --prefix frontend run build`.

