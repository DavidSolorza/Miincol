# Propuesta Técnica 026: Corrección de Etapas de Proceso Misionero y Restricción de Banner de Salida Progresiva

## 1. Contexto y Requerimiento
El usuario ha detectado una inconsistencia de negocio ministerial:
> *"oye esto es desde encarnacion hasta entrenaminto no va en auto cuidado ni nada revisa eso porfa"*
> Adjunta captura del banner:
> `ETAPA DE SALIDA PROGRESIVA: En esta etapa se inicia la salida progresiva del equipo misionero y la consolidación de la autonomía del liderazgo indígena local.`

### Diagnóstico Técnico:
1. **Inyección Errónea en Autocuidado:**
   En [`PhaseViewComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/plans/infrastructure/phase-view.component.ts) (Línea 112), la condición computada era:
   ```typescript
   readonly isProgressiveExit = computed(() => {
     const s = (this.activeObjective()?.stage || '').toLowerCase();
     return s.includes('salida') || s.includes('progresiv') || this.plan().phaseId === 'autocuidado';
   });
   ```
   El operador `|| this.plan().phaseId === 'autocuidado'` provocaba que el banner de salida progresiva y consolidación de liderazgo indígena se mostrara siempre que se entraba al pilar de **Autocuidado**.
2. **Mapeo Incorrecto de Etapas en Frontend y Backend:**
   En [`frontend/.../plan.types.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/plans/domain/plan.types.ts) y [`backend/.../is-stage-consistent.validator.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/common/validators/is-stage-consistent.validator.ts):
   Las etapas `'ADN Multiplicador'` y `'Salida progresiva'` estaban asignadas erróneamente a `Autocuidado`.
   - **Autocuidado:** Es el pilar de salud espiritual, emocional, física y familiar del misionero (`'Auto-cuidado'`, `'Auto Cuidado del Misionero'`).
   - **Proceso Misionero de Plantación (Encarnación ➡️ Evangelización ➡️ Entrenamiento):** Aquí es donde se desarrolla el ciclo de plantación de iglesias y la etapa final de consolidación y traspaso de liderazgo a los ancianos locales indígenas (`'Liderazgo'`, `'Desarrollo eclesial'`, `'ADN Multiplicador'`, `'Salida progresiva'`).

---

## 2. Alcance de la Solución Técnica

### A. Corrección de Etapas por Área (Frontend y Backend)
1. **Frontend ([`plan.types.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/plans/domain/plan.types.ts)):**
   - **`Entrenamiento`:** `['Consolidar', 'Liderazgo', 'Desarrollo eclesial', 'ADN Multiplicador', 'Salida progresiva']`
   - **`Autocuidado`:** `['Auto-cuidado', 'Auto Cuidado del Misionero']`
2. **Backend ([`is-stage-consistent.validator.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/common/validators/is-stage-consistent.validator.ts)):**
   - Mover `'ADN Multiplicador'` y `'Salida progresiva'` a `Entrenamiento`.
   - Limpiar `Autocuidado` y `'Auto-cuidado'` para admitir únicamente `['Auto-cuidado', 'Auto Cuidado del Misionero']`.

### B. Corrección de la Condición del Banner de Salida Progresiva
En [`PhaseViewComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/plans/infrastructure/phase-view.component.ts):
- Eliminar de raíz la condición `|| this.plan().phaseId === 'autocuidado'`.
- Restringir la visualización del banner para que **NUNCA** aparezca en Autocuidado.
- Solo se mostrará cuando el objetivo activo pertenezca a los pilares de la ruta misionera (`encarnacion`, `evangelizacion`, `entrenamiento`) y su etapa explícita sea `Salida progresiva` o `ADN Multiplicador`.

---

## 3. Plan de Pruebas Unitarias
1. **Backend Validator Spec (`is-stage-consistent.validator.spec.ts`):**
   - Verificar que `'Salida progresiva'` y `'ADN Multiplicador'` sean válidas en `Entrenamiento`.
   - Verificar que `'Salida progresiva'` sea rechazada en `Autocuidado`.
2. **Frontend Component Tests:**
   - Verificar que `isProgressiveExit()` sea `false` en `autocuidado`.
3. Ejecutar `npm test` en frontend y backend verificando 100% de pruebas en verde.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Límite de Líneas:** Todos los archivos $\le 150$ líneas.
- **Estado:** PENDIENTE DE APROBACIÓN EXPLÍCITA DEL USUARIO.

