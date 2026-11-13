# Propuesta Técnica 038: Control Administrativo del Año Ministerial Activo y Restablecimiento a 2026

## 1. Contexto y Requerimiento
El usuario ha manifestado mediante captura de pantalla y texto:
> *"oye esto acá estamos en el año 2026 porfa que haya forma de organizar eso desde la vista de admin porfa"*
> *(Imagen adjunta: La tabla multianual muestra "Año 2029 (Activo)" y no permite al usuario retornar al año 2026).*

### Diagnóstico de Causa Raíz:
1. **Avance Irreversible en el Ciclo Anual:**
   - En [`GeneralYearCycleComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/general-info/infrastructure/components/general-year-cycle.component.ts), el botón *"Iniciar Año [Año + 1]"* permitía avanzar el ciclo hacia adelante sucesivamente (2026 ➡️ 2027 ➡️ 2028 ➡️ 2029), guardando el valor en `teamData.year` dentro de `localStorage`.
2. **Falta de Selector o Ajuste de Año para Administradores:**
   - No existía en la interfaz ningún mecanismo para que el Administrador Nacional pudiera corregir, seleccionar o fijar el año ministerial activo a **2026** (o cualquier otro año del período ministerial).
3. **Impacto en el Seguimiento Multianual:**
   - La tabla [`GeneralAnnualTableComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/general-info/infrastructure/components/general-annual-table.component.ts) evalúa sus columnas dinámicamente según `teamData.year`. Al estar en 2029, marcaba 2029 como columna activa y desplazaba el modelo Excel.

---

## 2. Alcance de la Solución Técnica

### A. Selector y Acciones de Año en `GeneralYearCycleComponent`
1. **Control de Selección de Año Ministerial:**
   - Para usuarios con rol de Administrador (`@if (isAdmin())`):
     - Un selector desplegable elegante con los años ministeriales del Plan Nacional: `[2025, 2026 (Oficial), 2027, 2028, 2029, 2030]`.
   - **Botón de Restablecimiento Rápido:**
     - Si el año activo no es 2026, mostrar un botón destacado con ícono de calendario/retorno: **"↺ Fijar Año Oficial 2026"**, que con un solo clic devuelva la misión al año en curso.
2. **Confirmación Asistida:**
   - Solicitar confirmación con `ToastService.confirmAction` para evitar cambios accidentales en los datos de las métricas.

### B. Lógica en `GeneralInfoService` y `GeneralInfoViewComponent`
1. **Método `setActiveYear(year: number)` en `GeneralInfoService`:**
   - Actualiza de forma segura `teamData.year` y `teamData.isYearClosed: false`.
   - Persiste de inmediato en `localStorage` (`misincol_general_info_v3_[teamId]`).
   - Emite notificación toast de éxito: *"Año ministerial ajustado a [Año]"*.
2. **Conexión en `GeneralInfoViewComponent`:**
   - Enlazar el evento `(changeYear)="infoService.setActiveYear($event)"` desde `app-general-year-cycle`.

---

## 3. Plan de Pruebas y Validación
1. **Prueba Visual y Operativa:**
   - Abrir la misión en pantalla (que actualmente marca 2029).
   - Pulsar el botón **"↺ Fijar Año Oficial 2026"** o seleccionarlo del dropdown.
   - Verificar que el Ciclo Ministerial cambie a **Año 2026 (Período Activo)**.
   - Verificar que la tabla multianual organice sus columnas en:
     - `Año 2025`
     - `Año 2026 (Activo)`
     - `Año 2027`
2. **Pruebas Automatizadas:**
   - Ejecutar la suite de pruebas unitarias de frontend (`16 suites`).
   - Compilar producción con Vite (`npm --prefix frontend run build`).

---

## 4. Compromisos de Gobernanza Técnica (v2026.4.0)
- Límite estricto de $\le 150$ líneas por archivo (.ts).
- Cero dependencias externas adicionales.

---

## 5. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN EXPLÍCITA DEL USUARIO.
- **Pausa Obligatoria:** El sistema se detiene y espera tu confirmación o ajustes antes de aplicar los cambios.

