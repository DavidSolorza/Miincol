# Propuesta Técnica 029: Habilitación de Scroll Completo y Padding Inferior en Vista de Roles y Permisos

## 1. Contexto y Requerimiento
El usuario reporta un corte visual en la vista de Roles y Permisos:
> *"oye dale scroll a la vista de roles y permisos porfa porque se ve muy cortado en la parte inferior"*

### Diagnóstico Técnico:
1. **Contenedor Raíz con `lg:overflow-hidden`:**
   En [`frontend/src/app/ui/app-workspace.component.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/app/ui/app-workspace.component.ts) (Líneas 32-33), cuando `activeView === 'security'`, se aplican las clases `lg:h-screen lg:overflow-hidden`.
2. **Ausencia de `overflow-y-auto` en `<main>`:**
   La etiqueta `<main>` en `app-workspace.component.ts` (Línea 58) no tenía configurado `overflow-y-auto` ni padding inferior suficiente para la vista de seguridad, atrapando la tabla de matriz de permisos (18 filas) y la tabla de usuarios sin permitir scroll vertical.
3. **Corte en la Parte Inferior:**
   Al no haber scroll independiente en el área de contenido principal, las últimas filas y los botones de acción quedan inaccesibles o cortados por el borde inferior de la pantalla.

---

## 2. Alcance de la Solución Técnica

### A. Habilitación de Scroll en `app-workspace.component.ts`
1. Permitir scroll natural en el eje Y configurando `overflow-y-auto` en `<main>` o deshabilitar `lg:overflow-hidden` para la vista de seguridad:
   ```html
   <main [class]="... + (isScrollableView ? 'overflow-y-auto flex-1' : '')">
   ```
2. Garantizar que tanto la matriz de permisos como la tabla de colaboradores tengan desplazamiento vertical suave con `overflow-y-auto` y padding inferior (`pb-16 sm:pb-20`).

### B. Ajuste de Contenedor en `security-roles-view.component.ts`
En [`security-roles-view.component.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/security/infrastructure/security-roles-view.component.ts):
- Agregar padding inferior protector `pb-16 sm:pb-20` para que el final de la tabla nunca quede pegado al borde del navegador.

---

## 3. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Límite de Líneas:** Archivos $\le 150$ líneas.
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN EXPLÍCITA DEL USUARIO.

