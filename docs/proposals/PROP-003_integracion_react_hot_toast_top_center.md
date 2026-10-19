# Propuesta Técnica: Integración de react-hot-toast con Diseño Minimalista en Top-Center
**Código:** PROP-003  
**Fecha:** 2026-10-19  
**Autor:** Orquestador Técnico (VP of Engineering) & Staff Software Architect  
**Estado:** APROBADO Y EJECUTADO CON ÉXITO  

---

## 1. Resumen Ejecutivo (El Qué y El Por Qué)

### El Qué:
Adoptar la librería estándar [`react-hot-toast`](https://github.com/timolins/react-hot-toast) para gestionar todas las notificaciones del sistema de forma ultra-ligera (~4KB), configurando su visualización en la posición **superior central (`position="top-center"`)** con una estética minimalista, elegante y estilizada.

### El Por Qué:
1. **Solicitud Explícita del Usuario:** *"oye usasta libreria para los tosataa los quieor minimaliestas en la parte superior en el centro de la pantalla porfa eso seria top center https://github.com/timolins/react-hot-toast.git"*.
2. **Jerarquía Visual Superior (Top-Center):** La posición superior central es el estándar de oro en aplicaciones web modernas y suites ejecutivas (tipo Vercel, Linear, Supabase), ya que no colisiona con el pie de página ni con las tarjetas laterales del sidebar.
3. **Diseño Minimalista & Glassmorphism:** Notificaciones compactas tipo cápsula/píldora con fondo blanco cálido translúcido (`bg-white/95 backdrop-blur-md`), sombras suaves (`shadow-lg`), bordes sutiles y tipografía `Outfit`.
4. **Preservación del Contrato de Fachada:** Mantener la interfaz existente del hook `useToast()` (`toast.success`, `toast.error`, `toast.warning`, `confirmAction`), de modo que **ningún componente de la aplicación sufra rupturas de contrato ni requiera reescritura**.

---

## 2. Puntos de Intervención y Diseño

| Componente | Rol en la Solución | Líneas Estimadas |
|---|---|:---:|
| **`package.json`** | Adición de dependencia de producción `react-hot-toast` | - |
| **`src/shared/components/Toast.tsx`** | Proveedor y Toaster montado en `position="top-center"` con configuración minimalista global | < 85 líneas |
| **`src/shared/components/toast/ToastMinimalConfirmView.tsx`** | Componente de confirmación minimalista para `confirmAction` renderizado dentro de `toast.custom()` en el centro superior | < 90 líneas |
| **`src/shared/components/toast/toast.types.ts`** | Contratos tipados limpios adaptados al motor de `react-hot-toast` | < 75 líneas |

---

## 3. Especificación Visual Minimalista (Top-Center)

* **Contenedor:** Cápsula flotante centrada en la parte superior (`top-4 sm:top-6 mx-auto`).
* **Estilo General:**
  * Fondo: `bg-white/95 backdrop-blur-md`
  * Borde: `border border-stone-200/90`
  * Sombra: `shadow-md shadow-stone-900/5`
  * Tipografía: `font-['Outfit']`
* **Toasts Informativos/Éxito:** Compactos, en una sola línea elegante con ícono nativo de alta resolución.
* **Toasts de Verificación (`confirmAction`):** Cápsula expandida centrada con título conciso, botones minimalistas `[Cancelar]` y `[Confirmar]` de respuesta táctil rápida.

---

## 4. Criterios de Aceptación
1. `npm install react-hot-toast` ejecutado limpiamente.
2. `npm run build` con **0 errores de TypeScript**.
3. Todos los archivos modificados o creados con **estricto cumplimiento del límite < 150 líneas**.
4. Verificación visual en vivo en `http://localhost:5173/` confirmando posición `top-center` y estética minimalista.

---

## 5. Solicitud de Feedback

> [!IMPORTANT]
> En cumplimiento del **Contrato de Gobernanza Técnica v2026.4.0 (Regla 2.2)**, se requiere tu visto bueno antes de instalar la dependencia y aplicar los cambios.
> 
> ¿Das tu aprobación para instalar `react-hot-toast` y reconfigurar el sistema de toasts en `top-center` con diseño minimalista?
