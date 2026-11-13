# Propuesta Técnica 028: Depuración Profunda del Frontend, Estandarización POO & SOLID, Pruebas de Relación, Lógicas y Simulación de Uso Real

## 1. Contexto y Requerimiento
El usuario ha solicitado extender la depuración y estandarización al Frontend, complementándolo con un conjunto robusto de pruebas:
> *"ahora haz los mismo con el front y realiza pruebas de relacion pruebas logicas y pruebas unitarias simulando el uso real porfa"*

---

## 2. Diagnóstico Técnico del Frontend

1. **Componentes y Banners Residuales (Código Muerto):**
   - El componente `ProgressiveExitBannerComponent` y su lógica asociada en `PhaseViewComponent` quedaron obsoletos tras la unificación y remoción de la etapa `"Salida progresiva"`.
2. **Reutilización y POO en Frontend:**
   - La lógica de agregación jerárquica de presupuestos (`Fase ➡️ Objetivos ➡️ Actividades`) se puede estandarizar con una clase de cálculo pura (`HierarchicalPlanCalculator`) reutilizable tanto en planes como en métricas del sidebar y tarjetas.
3. **Consistencia de Etapas Canónicas en Formularios:**
   - Los modales de actividades (`activity-basic-fields.component.ts`) y objetivos (`objective-form-fields.component.ts`) deben validar estrictamente contra el mapa canónico de 5 pilares y 8 etapas únicas.
4. **Necesidad de Pruebas de Relación y Simulación de Uso Real:**
   - Se requiere una suite de pruebas que simule el viaje de usuario real de un Líder Territorial y Director Nacional, evaluando no solo funciones aisladas, sino la interacción entre módulos (Planes, Presupuestos, Control de Sobregiro, Cierre e Historial Multianual).

---

## 3. Alcance de la Solución Técnica

### A. Depuración y Eliminación de Código Muerto
- Remover `ProgressiveExitBannerComponent` y limpiar su importación en `PhaseViewComponent`.
- Limpiar el tipo `ActivityStage` y `STAGES_BY_AREA` para admitir única y exclusivamente las 8 etapas canónicas.
- Estandarización en nomenclatura: PascalCase para clases, modelos de dominio y etapas canónicas.

### B. Clase Pura de Agregación Jerárquica Recursiva (POO & SOLID)
- Crear `frontend/src/features/plans/domain/hierarchical-plan.calculator.ts` ($\le 90$ líneas):
  - Recorrido recursivo de planes para cálculo de presupuestos ejecutados, planeados, saldo restante y estado de completitud.
  - Aplicación de principios SRP y DRY.

### C. Suites de Pruebas Lógicas, de Relación y Simulación de Uso Real
1. **Pruebas de Relación Jerárquica (`plan-relationships.spec.ts`):**
   - Integridad relacional: Fase ➡️ Objetivos (máximo 4) ➡️ Actividades.
   - Pertenencia estricta de etapas a su área correspondiente.
   - Consistencia matemática entre presupuesto unitario, veces al año y presupuesto total de actividad.
2. **Pruebas de Relación de Ciclo Multianual (`annual-cycle-relationships.spec.ts`):**
   - Integridad del historial inmutable: los snapshots de años cerrados no se mutan al avanzar de ciclo.
   - Coherencia multianual en tabla Excel: visualización simultánea de línea base 2025, año cerrado 2026 y ciclo activo 2027.
3. **Simulación de Uso Real del Sistema (`real-usage-journey.spec.ts`):**
   - Simula el ciclo de vida anual completo de la **Misión Pastos**:
     1. Asignación inicial de presupuesto ($11.210.000 COP).
     2. Planificación de actividades por el líder pastoral.
     3. Detección y bloqueo reactivo ante intento de sobregiro presupuestal.
     4. Ejecución y marcado de actividades como 'Completado'.
     5. Cierre anual formal del año 2026.
     6. Apertura del año 2027 con contadores limpios y preservación del historial.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Límite de Líneas:** Todos los archivos nuevos o editados $\le 150$ líneas.
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN EXPLÍCITA DEL USUARIO.
- **Pausa Obligatoria:** No se modificará el código del frontend hasta recibir tu autorización formal.

