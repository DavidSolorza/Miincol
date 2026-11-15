# ADR-072: Ingreso Deliberado del Coordinador Bivalente según Contraseña Ingresada

## Estado
Propuesto (Pendiente de Aprobación del Usuario)

## Contexto
El coordinador nacional de equipos territoriales (Hugo Solorza, `hudisapastos@misincol.org`) cuenta con acceso dual bivalente:
1. Acceso a la supervisión general y dashboard nacional (`ADMIN_DASHBOARD`).
2. Acceso a la gestión operativa de su propia misión territorial (`Pastos` -> `TEAM_VIEW`).

En la versión actual, el formulario de login tenía precargada la contraseña `'admin2026'` por defecto en `login-view.component.ts`. Esto provocaba que cualquier intento de ingreso iniciara sesión automáticamente en el Dashboard de Administrador ("de una"), forzando al usuario a esta vista sin permitirle escribir el PIN de su misión si deseaba ingresar como líder de equipo.

## Decisión
1. **Limpieza estricta de señales en Login:**
   - `identifier` y `password` se inicializarán en `signal('')` en `LoginViewComponent`.
   - Ninguna contraseña se precargará en el cliente.
2. **Determinación estricta de vista por clave:**
   - La entrada a una vista u otra no será automática ni predeterminada: dependerá exclusivamente de la clave que el usuario ingrese en el campo de texto:
     - Clave administrativa (`admin2026` / `director2026`) ➡️ `ADMIN_DASHBOARD`.
     - PIN territorial (`Pastos2026` / `pastos2026`) ➡️ `TEAM_VIEW` de Pastos.
3. **Indicador de orientación contextual:**
   - `LoginFormFieldsComponent` mostrará una guía informativa discreta cuando el identificador corresponda a un usuario coordinador/dual para que recuerde con qué clave acceder a cada vista.

## Consecuencias
- **Positivas:** Cero inicios de sesión indeseados o automáticos; control deliberado y consciente del usuario sobre el rol y la vista con la que entra a la plataforma.
- **Límite de Líneas:** Todos los archivos permanecen estrictamente por debajo de las 150 líneas.

