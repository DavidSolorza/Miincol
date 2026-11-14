# Propuesta Técnica 049: Login Centrado Minimalista en Colores Claros (Light Theme)

**Estado:** Propuesta formal para evaluación y feedback  
**Fecha:** 2026-11-13  
**Autor:** Orquestador Técnico & Staff Software Architect  
**Módulo:** `frontend/src/features/auth/infrastructure/`

---

## 1. Motivación y Nuevo Requerimiento del Usuario

El usuario solicita una simplificación radical y un cambio de esquema cromático:
1. **Eliminación del panel lateral / Hero Card:** Mantener únicamente el bloque del formulario de acceso central ("solo dejemos esta parte").
2. **Esquema de Colores Claros (Light Theme):** Cambiar de la estética oscura (dark) a una paleta clara, limpia, luminosa e institucional (`bg-slate-50` / blanco).
3. **Distribución Centrada:** Centrar vertical y horizontalmente la tarjeta de autenticación en la pantalla completa (`min-h-screen flex items-center justify-center`).
4. **Preservación de los Controles Clave:**
   - Logotipo oficial de MISINCOL centrado en la parte superior.
   - Título "Acceso al Sistema" y descripción ministerial.
   - Tabs de rol en estilo cápsula clara: *Misión en Campo* y *Super Admin*.
   - Inputs ergonómicos `h-12` en fondo claro con bordes nítidos y etiquetas visibles.
   - Botón Pill estilizado (`rounded-full h-12`) con tipografía bold/uppercase y el indicador visual.
   - Pie de asistencia con enlace directo a WhatsApp.

---

## 2. Arquitectura y Reorganización de Componentes

Para mantener el límite estricto de **$\le 150$ líneas por archivo**:

```
frontend/src/features/auth/infrastructure/
├── login-view.component.ts               # Contenedor centrado a pantalla completa con fondo claro (< 110 líneas)
└── login/
    ├── login-card-header.component.ts     # Logotipo MISINCOL + Título + Subtítulo (< 35 líneas)
    ├── login-role-tabs.component.ts       # Tabs cápsula claros: 'Misión en Campo' / 'Super Admin' (< 40 líneas)
    ├── login-form-fields.component.ts     # Inputs claros h-12 + Botón Pill oscuro de alto contraste (< 85 líneas)
    ├── password-input-field.component.ts  # Input claro con toggle de visibilidad (< 40 líneas)
    └── login-support-footer.component.ts  # Pie de soporte institucional claro (< 30 líneas)
```
*(Nota: `login-hero-card.component.ts` se retira o se desacopla del flujo activo, eliminando dependencias no utilizadas).*

---

## 3. Especificación de Estilo (Light Theme)

- **Fondo Global:** `bg-slate-50 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-slate-900 selection:text-white font-['Outfit']`.
- **Tarjeta de Acceso:** `w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/90 p-6 sm:p-8 space-y-6 sm:space-y-7`.
- **Selector de Rol (Tabs):**
  - Contenedor: `bg-slate-100 p-1.5 rounded-2xl gap-1.5 border border-slate-200/60`.
  - Pestaña Activa: `bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80`.
  - Pestaña Inactiva: `text-slate-500 hover:text-slate-800`.
- **Inputs Ergonomicos (`h-12`):**
  - `bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 text-slate-900 placeholder-slate-400`.
- **Botón Pill:**
  - `rounded-full h-12 bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-[0.98]`.
- **Pie de Soporte:**
  - `border-t border-slate-100 text-slate-500` con enlace a WhatsApp en `text-slate-900 font-bold`.

