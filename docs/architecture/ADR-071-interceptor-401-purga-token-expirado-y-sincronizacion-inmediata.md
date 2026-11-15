# ADR-071: Interceptor 401 con Purga de Token Expirado y Sincronización Inmediata con la Base de Datos

## Estado
Propuesto (Esperando Aprobación)

## Contexto
El servidor actualizó su secreto de firma JWT (`JWT_SECRET`) y aplicó guardas estrictas en todos los controladores. Los navegadores con tokens emitidos antes del reinicio reciben `401 Token inválido o expirado`, bloqueando la persistencia de datos en la base de datos central.

## Decisión de Arquitectura
1. **Interceptor Reactivo 401:** Modificar `NativeHttpClient` para que ante cualquier respuesta 401 en rutas protegidas se purgue el token almacenado y se emita el evento `'auth:logout'`.
2. **Re-autenticación Limpia:** `AppSessionService` recibirá `'auth:logout'` y reiniciará la sesión para que el usuario ingrese nuevamente y reciba un JWT firmado con el secreto actual.
3. **Sincronización Reactiva Inmediata:** Despachar mutaciones pendientes hacia la base de datos central de forma inmediata al crearlas en el cliente.
4. **Cumplimiento de Gobernanza:** Mantener todos los módulos en $\le 150$ líneas.

## Consecuencias
- Cero sesiones bloqueadas por tokens caducados.
- Sincronización instantánea de objetivos y actividades con la base de datos del servidor.
- Experiencia fluida para líderes y administradores.

