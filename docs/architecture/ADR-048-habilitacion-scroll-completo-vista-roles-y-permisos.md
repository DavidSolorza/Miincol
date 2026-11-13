# ADR-048: Habilitación de Scroll Completo y Padding Inferior en la Vista de Roles y Permisos

## Estado
Aceptado e Implementado

## Contexto
El usuario reportó que la vista de Roles y Permisos (`security`) se encontraba visualmente cortada en la parte inferior, imposibilitando el scroll vertical hacia las últimas filas de la matriz de permisos y de la tabla de colaboradores.

## Causa Raíz
1. En `app-workspace.component.ts`, las clases `lg:h-screen lg:overflow-hidden` se aplicaban de forma global cuando la vista activa era `security`, bloqueando el scroll de la ventana en monitores grandes.
2. La etiqueta `<main>` carecía de padding inferior suficiente (`pb-24`) y no liberaba el scroll vertical para contenidos extensos.

## Decisiones Técnicas Implementadas
1. **Desacoplamiento de `lg:overflow-hidden` en el Contenedor Raíz:**
   - En `frontend/src/app/ui/app-workspace.component.ts`, se limitó `lg:h-screen` y `lg:overflow-hidden` exclusivamente a la vista de supervisión nacional tipo dashboard (`superadmin`), permitiendo que `security` y `audit` tengan scroll vertical libre y natural.
2. **Padding Inferior Protector en `<main>` y en la Vista:**
   - En `app-workspace.component.ts`, se configuró padding inferior `pb-24` para `security` y `audit`.
   - En `frontend/src/features/security/infrastructure/security-roles-view.component.ts`, se agregó `pb-20` para garantizar que la última fila de la tabla de permisos y de usuarios siempre quede con amplio margen visible sobre el borde inferior de la pantalla.
3. **Calidad y Gobernanza:**
   - 100% de archivos TypeScript $\le 150$ líneas.
   - 40/40 pruebas frontend + 36/36 pruebas backend aprobadas (76/76, 100%).
   - Compilación de producción ejecutada con éxito (código de salida 0).

