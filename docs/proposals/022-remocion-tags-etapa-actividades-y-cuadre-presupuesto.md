# Propuesta Técnica 022: Remoción de Tags en Actividades, Contador de Objetivos en Pilares y Cuadre de Presupuesto

## 1. Contexto y Diagnóstico
En la revisión operativa del sistema se han detectado tres requerimientos específicos de interfaz y cálculo:
1. **Sobrecarga Visual en Tarjetas de Actividades:**
   Cada actividad renderiza en su cabecera un tag con el icono de capas (`layers`) y el nombre de la etapa (ejemplo: `Diagnóstico Territorial`, `Liderazgo`, `General`). Este tag resulta redundante, no aporta valor en la ejecución diaria y satura la interfaz visual del usuario.
2. **Métrica en Pilares de la Barra Lateral (Sidebar):**
   Actualmente los badges junto a cada pilar (Investigación, Encarnación, Evangelización, Entrenamiento, Autocuidado) muestran el conteo de `actividadesTotales / actividadesCompletadas` (ej: `5/1`, `4/0`). El usuario solicita cambiar esta métrica para mostrar **`objetivosTotales / objetivosCumplidos`** (donde un objetivo se considera cumplido cuando todas sus actividades están en estado `Completado`).
3. **Discrepancia en Cifras de Presupuesto Anual:**
   En la vista de supervisión de la Misión Pastos, la barra superior de Información General refleja **$11.210.000 COP** (fiel a la carátula oficial del Excel *PDM 2026 Pastos Vr1.xlsx*), mientras que la barra lateral izquierda mostraba **$10.760.000 COP**. Dicha diferencia de **$450.000 COP** corresponde a dos actividades del Excel que faltaban en la colección de actividades cargadas en el frontend (*Reuniones de integración eclesial* por $300.000 y *Reuniones de mujeres* por $150.000).

---

## 2. Alcance de la Solución Técnica

### A. Remoción del Tag de Etapa en Actividades
- **Archivo Impactado:** `frontend/src/features/plans/infrastructure/activityItem/activity-header-tags.component.ts`.
- **Modificación:** Eliminar el bloque visual:
  ```html
  <span class="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-stone-700 bg-stone-100/80 px-2.5 py-1 rounded-xl border border-stone-200/60 shadow-2xs">
    <app-icon name="layers" className="w-4 h-4 text-[#E67324]" />
    {{ stage() || 'General' }}
  </span>
  ```
- **Limpieza en Acordeón:** En `activity-details-accordion.component.ts`, simplificar la visualización de áreas esenciales para no concatenar texto innecesario de etapas.

### B. Contador de Objetivos en Pilares del Sidebar
- **Archivo Impactado:** `frontend/src/features/plans/infrastructure/sidebar/sidebar-phases-list.component.ts`.
- **Modificación:**
  Reemplazar el cálculo de `getPhaseCounts(phaseId)` para que contabilice objetivos:
  - `total`: Número de objetivos de la fase (`phasePlan.objectives.length`).
  - `completed`: Cantidad de objetivos que tienen actividades y todas están en estado `'Completado'` (`o.activities.length > 0 && o.activities.every(a => a.state === 'Completado')`).
  - Renderizado: `{{ counts.total }}/{{ counts.completed }}` (ej. `4/1` para 4 objetivos de los cuales 1 está completamente cumplido).

### C. Cuadre y Sincronización Matemática del Presupuesto Anual
- **Archivos Impactados:**
  - `frontend/src/features/plans/application/pastosPhases/pastosObj1And2.ts`: Incorporar la actividad de *Reuniones de integración eclesial* ($300.000 COP).
  - `frontend/src/features/plans/application/pastosPhases/pastosObj3And4.ts`: Incorporar la actividad de *Reuniones de oración y estudio con mujeres* ($150.000 COP).
  - `backend/data/activities.json`: Asegurar que el desglose de actividades coincida en ambos extremos.
- **Resultado:** La suma en vivo de las actividades del pilar en la barra lateral será exactamente **$11.210.000 COP**, cuadrando de forma idéntica con el presupuesto general de la carátula superior.

---

## 3. Plan de Pruebas y Validación
1. Ejecución de la suite completa de pruebas unitarias y de componentes en Frontend (`npm --prefix frontend run test`).
2. Ejecución de la suite en Backend (`npm --prefix backend run test`).
3. Auditoría estática estricta de **$\le 150$ líneas por archivo** en todos los archivos modificados.
4. Verificación visual en el navegador de la limpieza en la tarjeta de actividades, la nueva métrica de objetivos en el sidebar y el cuadre de cifras.

---

## 4. Estado de Gobernanza
- **Estado:** Pendiente de Aprobación Explícita del Usuario.
- **Pausa Obligatoria:** No se modificará ningún archivo de código fuente hasta recibir la confirmación del usuario.
