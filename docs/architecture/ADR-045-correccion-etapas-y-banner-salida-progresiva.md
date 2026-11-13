# ADR-045: Corrección de Etapas de Proceso Misionero y Restricción del Banner de Salida Progresiva

## Estado
Aceptado e Implementado

## Contexto
El usuario reportó que el banner de alerta *"ETAPA DE SALIDA PROGRESIVA: En esta etapa se inicia la salida progresiva del equipo misionero y la consolidación de la autonomía del liderazgo indígena local"* se desplegaba de manera incorrecta dentro del pilar de **Autocuidado**.
Asimismo, en la definición de etapas por área tanto en frontend como en backend, las etapas de plantación `'ADN Multiplicador'` y `'Salida progresiva'` estaban asignadas por error al área de `Autocuidado`.

## Decisiones Técnicas
1. **Restricción Estricta en `PhaseViewComponent`:**
   - Se removió la condición residual `|| this.plan().phaseId === 'autocuidado'`.
   - Se estableció la regla de negocio: si la fase activa es `autocuidado`, `isProgressiveExit()` devuelve estrictamente `false`.
2. **Reubicación de Etapas del Proceso Misionero:**
   - En `frontend/src/features/plans/domain/plan.types.ts`:
     - `Entrenamiento`: Se agregaron `'ADN Multiplicador'` y `'Salida progresiva'`, correspondientes a la etapa final de madurez eclesial, autonomía y traspaso a los ancianos locales.
     - `Autocuidado`: Se restringió de forma exclusiva a `['Auto-cuidado', 'Auto Cuidado del Misionero']`.
   - En `backend/src/common/validators/is-stage-consistent.validator.ts`:
     - Se sincronizó el mapa `STAGES_BY_AREA_MAP` para que `Entrenamiento` valide `'ADN Multiplicador'` y `'Salida progresiva'`, y `Autocuidado` rechace cualquier etapa ajena a la salud integral del misionero.
3. **Calidad y Gobernanza:**
   - 100% de archivos TypeScript $\le 150$ líneas.
   - 35/35 pruebas frontend + 27/27 pruebas backend aprobadas (62/62, 100%).
   - Compilaciones de producción en 0 errores.

