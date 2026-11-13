# ADR-044: Ciclo de Cierre Anual, Respaldo en Historial y Reinicio Limpio de Período 2027

## Estado
Aceptado e Implementado

## Contexto
El usuario reportó que al avanzar el ciclo ministerial a 2027:
1. No se creaba un snapshot inmutable del año 2026 en el historial.
2. Los datos y actividades del período anterior no se limpiaban para iniciar el nuevo año.
3. La tabla multianual (`GeneralAnnualTableComponent`) mantenía encabezados y columnas estáticas donde el 2026 figuraba rígidamente como `(Activo)` y el 2027 como guiones `—`.

## Decisiones Técnicas
1. **Separación Modular y Helper de Historial:**
   - Creación de `frontend/src/features/general-info/domain/general-info-history.helper.ts` para extraer snapshots inmutables del año cerrado (`createHistorySnapshot`, `archiveYearCycle`, `backupPdmPlansSnapshot`).
   - Almacenamiento del historial bajo `annualMetricsHistory[year]` y en almacenamiento local de respaldo `misincol_pdm_history_[teamId]_[year]`.
2. **Helper de Reinicio de Ciclo:**
   - Creación de `frontend/src/features/general-info/domain/general-info-reset.helper.ts` (`createCleanCycleState`, `createCleanFieldMetrics`, `createCleanMinisterialTraining`, `createCleanChurchDevelopment`).
   - Reestablece los contadores a 0 y `executedTotalBudget: 0` para comenzar el nuevo año de ministerio.
   - Creación de `frontend/src/features/plans/application/planCycleReset.ts` para reiniciar las actividades de los planes al año nuevo preservando la estructura de objetivos estratégicos.
3. **Event Bus Decoupling:**
   - Emisión del evento `'cycle:year_changed'` a través del `serviceBus` para que `PlanService` y otros servicios reaccionen desacopladamente sin dependencias circulares.
4. **Tabla Multianual Dinámica:**
   - Extracción de filas oficiales en `frontend/src/features/general-info/domain/general-annual-table.rows.ts`.
   - `GeneralAnnualTableComponent` computa dinámicamente las columnas según `currentYear`:
     - Columna histórica base (Año 2025).
     - Columna año cerrado (Año 2026): Lee los valores guardados del historial archivado en modo lectura fija.
     - Columna año activo (Año {{ currentYear }} (Activo)): Resaltada con los inputs editables limpios para registrar el nuevo ciclo.
     - Columna futura (Año {{ currentYear + 1 }}): Guiones `—`.
5. **Gobernanza:**
   - 100% de archivos TypeScript $\le 150$ líneas.
   - 32/32 pruebas frontend + 27/27 pruebas backend aprobadas (59/59, 100%).

