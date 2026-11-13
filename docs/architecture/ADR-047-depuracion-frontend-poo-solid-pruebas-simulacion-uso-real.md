# ADR-047: Depuración Profunda del Frontend, Estandarización POO & SOLID, Pruebas de Relación, Lógicas y Simulación de Uso Real

## Estado
Aceptado e Implementado

## Contexto
Siguiendo la exitosa depuración del backend (ADR-046), el usuario solicitó aplicar la misma rigurosidad técnica al Frontend:
1. Depurar y simplificar el código usando recursividad y POO.
2. Eliminar componentes obsoletos y código no utilizado.
3. Crear un conjunto exhaustivo de pruebas lógicas, pruebas de relación y pruebas simulando el uso real del sistema.

## Decisiones Técnicas Implementadas
1. **Eliminación de Componentes Obsoletos:**
   - Se removió `ProgressiveExitBannerComponent` y sus referencias en `PhaseViewComponent`, dado que las etapas se redujeron a los 8 términos canónicos y no existe la etapa "Salida progresiva".
2. **Calculador Jerárquico con POO y Métodos Puros:**
   - Creación de `HierarchicalPlanCalculator` (`frontend/src/features/plans/domain/hierarchical-plan.calculator.ts`) aplicando POO pura y recursividad para la agregación de presupuestos de planes (`calculateObjectiveBudget`, `calculatePhaseBudget`, `calculateGlobalPlannedBudget`, `calculatePhaseMetrics`).
   - `planCalculations.ts` ahora delega limpiamente a este calculador (DRY).
3. **Batería de Pruebas de Relación, Lógicas y Simulación Real:**
   - **Pruebas de Relación (`plan-relationships.spec.ts`):** Valida la integridad de la jerarquía Fase ➡️ Objetivos (máximo 4) ➡️ Actividades y el mapeo estricto de etapas a su área esencial.
   - **Pruebas de Ciclo Multianual (`annual-cycle-relationships.spec.ts`):** Valida la inmutabilidad de los snapshots anuales y la relación dinámica de columnas en la tabla multianual de campo.
   - **Simulación de Uso Real (`real-usage-journey.spec.ts`):** Simula el ciclo anual completo de la Misión Pastos ($11.210.000 COP) desde la asignación inicial, la planificación de actividades, el control reactivo anti-sobregiro, el cumplimiento al 100% y la transición limpia a 2027 con resguardo histórico.
4. **Gobernanza:**
   - 100% de archivos TypeScript $\le 150$ líneas.
   - 40/40 pruebas frontend + 36/36 pruebas backend aprobadas (76/76, 100%).
   - Compilaciones en modo producción ejecutadas sin errores (código de salida 0).

