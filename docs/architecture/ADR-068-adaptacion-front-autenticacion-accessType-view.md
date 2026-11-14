# ADR-068: Adaptación del Frontend a la Autenticación Basada en accessType y view del Backend

## Estado
Propuesto (Esperando Aprobación)

## Contexto
El servicio de autenticación del backend (`/auth/login`) fue estandarizado para clasificar de manera determinista la sesión y la vista de destino mediante los campos `accessType` ('COORDINADOR' | 'LIDER') y `view` ('ADMIN_DASHBOARD' | 'TEAM_VIEW').

Anteriormente, el frontend ignoraba esta respuesta e invocaba un verificador local síncrono con listas duras donde `pastos2026` figuraba como clave de administrador y el correo `hudisapastos@misincol.org` se forzaba siempre al rol de administrador nacional, impidiendo que el pastor/líder ingresara a la vista de su propio equipo al escribir su PIN.

## Decisión de Arquitectura
1. Consumir de forma prioritaria y asíncrona la respuesta del endpoint nativo `/auth/login`.
2. Rutear la interfaz según `res.view`:
   - `ADMIN_DASHBOARD` ➔ `adminSuccess` (Tablero Nacional de Supervisión).
   - `TEAM_VIEW` ➔ `teamSuccess` con `isNationalAdmin: false` (Espacio de trabajo del equipo).
3. Eliminar de las listas locales de administrador cualquier clave de equipo territorial (`pastos2026`) y soportar comparación insensible a mayúsculas/minúsculas para los PINs.
4. Mostrar errores de credenciales devueltos por el backend (HTTP 401) de forma directa sin alterar la vista.

## Consecuencias
- Coherencia total entre backend y frontend.
- Hugo Solorza (`hudisapastos@misincol.org`) ingresa a la vista del equipo Pastos con `Pastos2026`/`pastos2026` y al dashboard nacional con `admin2026`.
- El ingreso con identificador de equipo (`team-...`) y clave `admin2026` es rechazado limpiamente.
- Cumplimiento de las reglas de gobernanza: archivos $\le 150$ líneas, cero SDKs comerciales, tipado estricto.

