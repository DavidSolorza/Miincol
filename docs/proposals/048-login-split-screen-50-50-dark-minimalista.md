# Propuesta Técnica 048: Rediseño de Login a Split-Screen 50/50 Full-Height Dark Minimalista

**Estado:** Propuesta formal para evaluación y feedback  
**Fecha:** 2026-11-13  
**Autor:** Orquestador Técnico & Staff Software Architect  
**Módulo:** `frontend/src/features/auth/infrastructure/`

---

## 1. Motivación y Análisis de la Referencia Visual

El usuario solicita evolucionar la pantalla de autenticación hacia un diseño **Split-Screen (50/50) a pantalla completa (full-height)** inspirado en la estética visual de referencia proporcionada (*Gratafy UI*):

1. **Estructura Split-Screen 50/50:**
   - En lugar de una tarjeta centrada sobre un fondo vacío, la pantalla se divide en dos columnas simétricas de ancho 50% en escritorio (`w-full md:w-1/2 min-h-screen`).
   - Ambas columnas aprovechan el 100% de la altura de la ventana, sin barras de desplazamiento innecesarias ni sensación de compresión.
2. **Estética Dark Minimalista de Alta Gama:**
   - Paleta cromática profunda en tonos Slate / Navy (`#0B0F19`, `#0F172A`, `#1E293B`).
   - Composición gráfica con formas orgánicas y cápsulas geométricas redondeadas en degradado superpuesto, estrellas y cruces geométricas minimalistas (`+`).
   - Tarjeta de formulario flotante o integrada en el cuadrante derecho, con inputs oscuros refinados (`bg-slate-800/60`, `border-slate-700/70`, texto nítido blanco).
   - Botón de acción con estilo "Pill" de alto contraste (`rounded-full`, blanco o cyan/ámbar vibrante, tipografía bold y sombra difusa).

---

## 2. Arquitectura de Componentes Propuesta

Manteniendo el **límite estricto de 150 líneas por archivo** y la cohesión modular de Angular Standalone:

```
frontend/src/features/auth/infrastructure/
├── login-view.component.ts               # Contenedor Split-Screen 50/50 (Layout flex/grid md:flex-row) (< 120 líneas)
└── login/
    ├── login-hero-split-panel.component.ts # Panel Izquierdo 50%: Cápsulas abstractas oscuras, marca MISINCOL (< 100 líneas)
    ├── login-card-header.component.ts     # Encabezado con logo blanco/transparente o tipográfico (< 40 líneas)
    ├── login-role-tabs.component.ts       # Tabs cápsula oscura para alternar 'Misión en Campo' y 'Super Admin' (< 45 líneas)
    ├── login-form-fields.component.ts     # Inputs oscuros ergonómicos + botón Pill blanco (< 90 líneas)
    ├── password-input-field.component.ts  # Campo de contraseña con toggle visual (< 45 líneas)
    └── login-support-footer.component.ts  # Enlace minimalista a soporte (< 35 líneas)
```

---

## 3. Especificación Visual y de Estilo

### A. Panel Izquierdo (Hero 50% Width / Full Height)
- **Fondo:** `#080C14` a `#0F172A` con degradado radial suave.
- **Arte Abstracto Geométrico:**
  - Cápsulas / pills redondeadas gigantes inclinadas (`rounded-full rotate-[-35deg] bg-slate-800/40`) emulando exactamente la composición de la imagen de referencia.
  - Símbolos decorativos minimalistas: cruces geométricas `+`, círculos translúcidos y destellos luminosos.
- **Contenido Institucional:**
  - Emblema **MISINCOL** con insignia dorada.
  - Título editorial: *«Plan de Desarrollo Ministerial»*.
  - Indicadores clave: *5 Pilares • 6 Etapas • Supervisión Territorial*.
  - Cita inspiradora de Mateo 9:37-38.

### B. Panel Derecho (Formulario 50% Width / Full Height)
- **Fondo:** `#0D111D` (Navy profundo consistente con el panel izquierdo).
- **Contenedor Central:** Tarjeta flotante sutil con bordes `border-slate-800/80` y fondo `bg-slate-900/60 backdrop-blur-md` o integrado limpiamente.
- **Campos de Texto:**
  - Altura `h-12`, esquinas redondeadas `rounded-xl`, fondo `bg-slate-800/50`, borde fino `border-slate-700/60`, texto blanco y placeholders `text-slate-500`.
- **Botón Principal:**
  - Estilo Pill (`rounded-full h-12`), fondo blanco puro `bg-white hover:bg-slate-100 text-slate-950 font-extrabold tracking-wider text-xs uppercase shadow-lg shadow-white/10 active:scale-98`.

---

## 4. Plan de Ejecución
1. Actualizar `login-hero-split-panel.component.ts` (o adaptar `login-hero-card.component.ts`).
2. Adaptar `login-view.component.ts` al layout `50/50` (`w-full md:w-1/2 min-h-screen`).
3. Ajustar `login-card-header.component.ts`, `login-role-tabs.component.ts`, `login-form-fields.component.ts`, `password-input-field.component.ts` y `login-support-footer.component.ts` al tema dark refinado.
4. Ejecución de pruebas unitarias (`npm test`) y build de producción (`npm run build`).
5. Confirmación del límite de 150 líneas por archivo.

