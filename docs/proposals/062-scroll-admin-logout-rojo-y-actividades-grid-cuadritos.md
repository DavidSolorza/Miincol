# Propuesta Técnica 062: Scrollbar Admin Oscuro, Botón Logout Rojo Vivo y Grid de Actividades en Cuadritos

## 1. Contexto y Diagnóstico
El usuario ha solicitado tres mejoras de diseño y experiencia de usuario (UI/UX) para enriquecer la usabilidad y la claridad visual:
1. **Scrollbar del Dashboard de Coordinación:** La barra de desplazamiento lateral donde se listan los equipos territoriales no tiene el color negro/oscuro esperado, ya que utiliza un gradiente naranja translúcido (`.custom-scrollbar` en `fluidity.css`) que resulta poco visible.
2. **Botón de Cierre de Sesión (Logout):** En la cabecera de la vista de equipo, el botón de la puerta (`log-out`) tiene actualmente un estilo gris atenuado (`bg-stone-100 text-stone-500`) que pasa desapercibido. Se solicita transformarlo en un botón llamativo con **rojo vivo y alta notoriedad**.
3. **Visualización de Actividades en Cuadritos (Grid estilo Dashboard Nacional):**
   - Actualmente, las actividades se despliegan en una lista vertical con tarjetas anchas y horizontales, separadas del encabezado del objetivo.
   - El usuario solicita que sea más intuitivo que las actividades pertenecen al objetivo (contenedor unificado tipo tabla/panel) y que se presenten en formato de **cuadritos (grid de tarjetas)** con una estética similar a las tarjetas de equipos del Coordinador Nacional (`team-overview-card`).

---

## 2. Plan de Implementación Modular

### A. Scrollbar Oscuro en Dashboard Admin (`fluidity.css`)
- Actualizar la clase `.custom-scrollbar`:
  - `scrollbar-color: #1c1917 rgba(0, 0, 0, 0.04);`
  - `::-webkit-scrollbar-thumb`: Color negro carbón `#1c1917` visible con hover `#000000`.
  - Ancho de 7px para accesibilidad y visualización clara en monitores y portátiles.

### B. Botón de Logout en Rojo Vivo (`app-header-user-profile.component.ts`)
- Rediseñar el botón de la puerta en la cabecera:
  - Estilo llamativo: `bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm ring-2 ring-red-400/40 hover:ring-red-500`.
  - Icono `log-out` en blanco brillante contrastado con animación hover de apertura/salida.
  - Etiqueta opcional "Salir" en pantallas sm/md para máxima claridad cognitiva.

### C. Contenedor Unificado y Grid de Actividades en Cuadritos
1. **Unificación Objetivo-Actividades (`objective-card.component.ts`):**
   - Agrupar la cabecera del objetivo, la barra de filtros y la zona de actividades dentro de una misma tarjeta contenedora principal o sección integrada con cabecera de sección distinguida.
2. **Grid de Cuadritos (`objective-activities-list.component.ts`):**
   - Reemplazar el contenedor vertical `space-y-3` por una cuadrícula responsiva:
     `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4.5`.
3. **Diseño de Tarjeta de Actividad en Cuadro (`activity-item.component.ts`):**
   - Adaptar la tarjeta para layout vertical tipo cuadro:
     - Borde superior de acento temático según el estado/frecuencia (similar a `team-overview-card`).
     - Cabecera con selector de estado y acciones rápidas (editar, eliminar, presupuesto).
     - Cuerpo central con título y descripción en tipografía destacada.
     - Bloque inferior de chips: Responsable con avatar, Rango de fechas con calendario, badge de semanas restantes.
     - Presupuesto claramente visualizado y acordeón expandible de diagnóstico y metas.

---

## 3. Cumplimiento de Gobernanza Técnica
- Límite estricto $\le 150$ líneas por archivo modificado.
- Clean Code y TypeScript estricto.
- Verificación exhaustiva con Vitest (85+ pruebas) y compilación Vite de producción.

---

## 4. Estado de Ejecución y Pruebas
- [x] Análisis técnico y diseño conceptual completado.
- [x] Scrollbar oscuro/negro `#1c1917` implementado en `fluidity.css` para `.custom-scrollbar`.
- [x] Botón de Logout rediseñado en rojo vivo con puerta destacada y texto visible en `app-header-user-profile.component.ts`.
- [x] Objetivo y actividades integrados en un contenedor unificado en `objective-card.component.ts`.
- [x] Actividades reorganizadas en cuadrícula de "cuadritos" responsiva (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`) en `objective-activities-list.component.ts`.
- [x] Tarjeta de actividad adaptada a formato cuadrado con acento superior de color y diseño compacto en `activity-item.component.ts`.
- [x] Verificación de pruebas unitarias: 23 suites y 85/85 pruebas aprobadas con éxito en Vitest.
- [x] Compilación de producción (`vite build`) completada en 10.00s.
