# Propuesta Técnica 025: Ciclo de Cierre Anual, Histórico Multianual y Reinicio Limpio de Período 2027

## 1. Contexto y Requerimiento
El usuario ha solicitado formalizar la transición de ciclo ministerial:
> *"revisa que cuando se cierre el año todo lo referente a 2026 se guarda como historial porfa y se limpia todo para empezar el 2027 maneja esa logica porfa"*

### Diagnóstico Técnico:
1. **Falta de Snapshot de Cierre:** Al presionar *"Iniciar Año 2027"*, `GeneralInfoService.startNewYear(nextYear)` únicamente incrementaba el número del año en `teamData.year`, pero **no** respaldaba los datos del 2026 (`fieldMetrics`, `ministerialTraining`, `churchDevelopment`, `budgetBreakdown` y planes PDM) en el historial persistente.
2. **Campos no Limpiados:** Los datos y métricas del 2026 permanecían en los campos activos en lugar de archivarse y limpiarse para comenzar el 2027 en blanco.
3. **Columnas Rígidas en la Tabla Multianual:** `GeneralAnnualTableComponent` tenía encabezados y celdas hardcodeadas (`Año 2025 | Año 2026 (Activo) | Año 2027`). Al cambiar el ciclo a 2027, la tabla continuaba mostrando `Año 2026 (Activo)` como columna editable y el 2027 con guiones `—` (evidenciado en la captura adjunta por el usuario).

---

## 2. Alcance de la Solución Técnica

### A. Snapshot Automático en Historial al Cerrar / Iniciar Ciclo
En [`GeneralInfoService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/general-info/application/general-info.service.ts):
1. **Método `closeYear()` & `startNewYear(nextYear)`:**
   - Toma el estado actual del año que termina (ej. 2026) y lo guarda de forma inmutable en `annualMetricsHistory[closingYear]`:
     - Métricas de campo (`fieldMetrics`).
     - Entrenamiento ministerial (`ministerialTraining`).
     - Desarrollo eclesial (`churchDevelopment`).
     - Presupuesto y gasto ejecutado (`budgetBreakdown`).
     - Esenciales desarrollados (`essentialsToDevelop`).
   - Se respalda el snapshot de planes PDM del año cerrado en `misincol_pdm_history_[teamId]_[closingYear]`.
2. **Reinicio Limpio del Nuevo Ciclo (2027):**
   - `teamData.year = nextYear` (2027) y `isYearClosed = false`.
   - `fieldMetrics`: Se inicializan en 0 todos los contadores de campo (contactados, interesados, bautizados, mentoreados, etc.).
   - `ministerialTraining` & `churchDevelopment`: Se inicializan en 0 para el nuevo período.
   - `budgetBreakdown.executedTotalBudget`: Se reinicia en **$0 COP** para registrar el nuevo gasto del año.
   - `plans`: Se inicializa un ciclo de actividades limpio para 2027 manteniendo los objetivos estratégicos base pero con metas y actividades listas para ser planificadas desde cero.

---

### B. Tabla Multianual Dinámica (`GeneralAnnualTableComponent`)
- Reemplazar las columnas fijas por columnas **dinámicas calculadas** según el `teamData.year`:
  - **Columna Histórica Base:** Año 2025 (valores de línea base).
  - **Columna Año Anterior (`currentYear - 1`, ej. 2026):** Muestra los datos leídos del historial archivado (`annualMetricsHistory[2026]`) en modo lectura (fijos y guardados).
  - **Columna Año Activo (`currentYear`, ej. 2027):** Resaltada como `(Activo)` con los inputs numéricos editables limpios para ingresar los avances del año en curso.
  - **Columna Año Futuro (`currentYear + 1`, ej. 2028):** Muestra `—` (proyección futura).
- Si el año actual cambia a 2027 o superior, la tabla reacciona automáticamente y desplaza las columnas correctamente sin código duro.

---

### C. Persistencia y Respaldo en Backend
- En [`backend/src/reports/reports.service.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/reports/reports.service.ts):
  - Al realizar el cierre, se sincroniza un `FieldReport` oficial con el año 2026 en el backend para que quede registrado en los backups y reportes consolidados nacionales (`/api/reports`).

---

## 3. Arquitectura y Regla de 150 Líneas
- Los helpers de reseteo e historial se aislarán en submódulos especializados:
  - `frontend/src/features/general-info/domain/general-info-history.helper.ts` ($\le 100$ líneas).
  - `frontend/src/features/general-info/domain/general-info-reset.helper.ts` ($\le 90$ líneas).
- `general-annual-table.component.ts` se refactoriza con columnas computadas dinámicas ($\le 140$ líneas).
- Todos los archivos se mantienen estrictamente $\le 150$ líneas.

---

## 4. Plan de Pruebas Unitarias
1. **Pruebas de Transición de Ciclo:**
   - Verificar que al invocar `startNewYear(2027)`, el año 2026 queda guardado íntegro en `annualMetricsHistory[2026]`.
   - Verificar que los contadores de 2027 se limpian a 0 y la ejecución presupuestal a $0 COP.
2. **Pruebas de Tabla Multianual:**
   - Verificar que para `currentYear = 2027`, la columna activa sea 2027 y la columna 2026 muestre los valores del historial archivado.
3. **Ejecución de test suites:** Frontend y backend al 100% en verde.

---

## 5. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN DEL USUARIO.
- **Acción:** No se modificará ningún archivo de código fuente hasta que el usuario otorgue su visto bueno explícito.

