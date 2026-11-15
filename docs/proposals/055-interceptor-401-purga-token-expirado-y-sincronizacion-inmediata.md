# Propuesta Técnica 055: Interceptor 401 con Purga de Token Expirado y Sincronización Inmediata con la Base de Datos

## 1. Contexto y Diagnóstico

### El Mensaje del Servidor
El equipo de infraestructura del backend confirmó:
- El contenedor backend está saludable y activo.
- El endpoint `https://misincol-api.servidor.blog/api/health` responde 200.
- El login funciona y devuelve el token firmado con el nuevo `JWT_SECRET`.
- **Causa raíz:** Tras el despliegue de seguridad de hoy, todas las rutas exigen token y se cambió el `JWT_SECRET`. Los tokens generados previamente quedaron invalidados. Cuando el navegador intenta sincronizar usando ese token antiguo, el servidor responde:
  `401 (Unauthorized): Token inválido o expirado`.

### Problema en el Frontend
1. Si el frontend recibe un 401 en peticiones de datos (equipos, objetivos, actividades), mantenía el token viejo en `localStorage`, dejando al usuario atrapado en una sesión "zombie" donde ninguna mutación sube a la base de datos central.
2. El servicio de sincronización (`SyncCoordinatorService`) ejecutaba en lotes cada 45 segundos en lugar de despachar inmediatamente las mutaciones cuando el usuario crea o edita un objetivo o actividad.

---

## 2. Solución Propuesta

### A. Interceptor 401 en `NativeHttpClient` (`httpClient.ts`)
- Cuando cualquier petición a un endpoint protegido (distinto de `/auth/login`) retorne HTTP 401:
  - Eliminar de inmediato `misincol_auth_token` de `localStorage`.
  - Publicar el evento `'auth:logout'` a través del `serviceBus`.
  - Con esto, el frontend detecta que el token caducó y devuelve al usuario a la pantalla de login para obtener un token nuevo y válido.

### B. Suscripción en `AppSessionService` (`app-session.service.ts`)
- Escuchar el evento `'auth:logout'` en `AppSessionService` para cerrar la sesión local y notificar al usuario con un mensaje claro:
  `"Tu sesión ha expirado o las credenciales del servidor cambiaron. Por favor ingresa nuevamente."`

### C. Despacho Inmediato en `SyncCoordinatorService` (`sync-coordinator.service.ts`)
- Inyectar el token en cada mutación de la cola outbox.
- Al encolar una nueva mutación en `queueActivityMutation` o `queueObjectiveMutation`, activar `syncNow()` de inmediato si hay conexión a internet para subir los datos a la base de datos sin esperas.

---

## 3. Plan de Pruebas y Validación
1. Pruebas unitarias de cliente HTTP y sincronización.
2. Verificación del límite $\le 150$ líneas por archivo.
3. Compilación de producción con `npm run build`.

