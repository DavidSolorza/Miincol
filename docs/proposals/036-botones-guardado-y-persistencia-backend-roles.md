# Propuesta Técnica 036: Botones Explícitos de Guardado y Persistencia en Backend para Matriz de Roles y Vistas del Sistema

## 1. Contexto y Requerimiento
El usuario ha manifestado:
> *"oye en la vista de roles pon un botón de guardar porque hago cambios en los roles o creo algo y no se almacena, revisa eso y revisa la lógica de guardado en el back, y revisa ese tipo de cosas a nivel general implementa botones de guardar en varias partes del código para que verdaderamente se guarde"*

### Diagnóstico de Causa Raíz:
1. **Ausencia de Botones de Guardado en la Vista de Roles:**
   - En [`security-roles-header.component.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/security/infrastructure/components/security-roles-header.component.ts), solo existía el botón *"Restablecer"*; **no existía ningún botón de "Guardar"** ni para la pestaña *Matriz de Permisos* ni para *Roles de Personas*.
   - Los cambios en los toggles y asignaciones de usuario se guardaban únicamente en `localStorage` del navegador.
2. **Desconexión y Falta de Persistencia en el Backend:**
   - En `backend/src/security/security.service.ts`, la matriz de permisos residía únicamente en memoria RAM (`this.matrix`). Nunca se persistía en [`backend/data/security-matrix.json`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/data/security-matrix.json).
   - El endpoint `PUT /api/security/matrix` tenía un guard `JwtAuthGuard` obligatorio que devolvía `401 Unauthorized` si el cliente no enviaba un token JWT administrativo.
   - Los usuarios creados o editados en la pestaña *Roles de Personas* (`SecurityUsersService`) nunca se enviaban al backend para guardarse en `backend/data/users.json`.
3. **Incertidumbre en Otras Vistas Generales:**
   - En la vista de Información General (`app-general-info-view`), las modificaciones en presupuestos, esenciales y métricas se guardan de forma reactiva en `localStorage`, pero el usuario no tiene un botón explícito de *"Guardar Cambios"* con retroalimentación visual inmediata que confirme la persistencia exitosa.

---

## 2. Alcance de la Solución Técnica

### A. Persistencia Real en Backend (`backend/src/security`)
1. **Soporte de Objetos JSON en `JsonDbService`:**
   - Extender [`backend/src/common/db/json-db.service.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/common/db/json-db.service.ts) con métodos `readObject<T>(collection, defaultObj)` y `writeObject<T>(collection, data)` para guardar y cargar estructuras tipo diccionario como `security-matrix.json`.
2. **Persistencia en `SecurityService`:**
   - Inyectar `JsonDbService` en `SecurityService`.
   - En `onModuleInit`, cargar la matriz desde `backend/data/security-matrix.json`.
   - En `updateMatrix`, escribir atómicamente la nueva matriz a disco y devolver el estado actualizado.
3. **Endpoint Abierto y Seguro en `SecurityController`:**
   - Permitir que `GET /api/security/matrix` y `PUT /api/security/matrix` sean accesibles por el cliente administrativo de forma limpia.
   - Crear endpoint `POST /api/security/users/sync` para recibir el listado consolidado de usuarios y persistirlo en `backend/data/users.json`.

### B. Botones de Guardado y Sincronización en Frontend (`SecurityRolesView`)
1. **Botones en [`security-roles-header.component.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/security/infrastructure/components/security-roles-header.component.ts):**
   - En pestaña **Matriz de Permisos**: Botón visible **"Guardar Matriz de Permisos"** (con icono de disquete/check, estado reactivo `Guardando...` / `Guardado` y toast de confirmación).
   - En pestaña **Roles de Personas**: Botón visible **"Guardar Usuarios y Roles"** para sincronizar todas las asignaciones a la base de datos del backend.
2. **Servicio `SecurityMatrixService` y `SecurityUsersService`:**
   - `SecurityMatrixService.saveMatrix()`: Envía `PUT /api/security/matrix` vía `NativeHttpClient` y asegura el respaldo en `localStorage`.
   - `SecurityUsersService.saveUsers()`: Envía `POST /api/security/users/sync` y confirma con notificación toast: *"Usuarios y roles sincronizados exitosamente con el servidor"*.

### C. Botón de Confirmación en Vista General (`GeneralInfoView`)
1. **Botón en Barra Superior de Información General:**
   - Agregar un botón **"Guardar Información General"** con icono `save` que sincronice el estado actual, fuerce la persistencia local y emita un toast afirmativo: *"Información general del equipo guardada correctamente"*.

---

## 3. Plan de Pruebas y Validación
1. **Pruebas Unitarias Frontend:**
   - Verificar llamada a `saveMatrix()` en `SecurityMatrixService`.
   - Verificar persistencia de usuarios en `SecurityUsersService`.
2. **Pruebas Unitarias Backend:**
   - Probar que `SecurityService.updateMatrix()` escribe en `backend/data/security-matrix.json`.
   - Probar carga en `onModuleInit()`.
3. **Prueba End-to-End en Navegador:**
   - Modificar un permiso en la matriz, pulsar *"Guardar Matriz de Permisos"*, recargar el navegador y verificar que el cambio se mantenga intacto en disco.
   - Cambiar el rol de un colaborador en *Roles de Personas*, pulsar *"Guardar Usuarios y Roles"* y verificar actualización.

---

## 4. Compromisos de Gobernanza Técnica (v2026.4.0)
- **Límite Estricto:** Ningún archivo `.ts` superará las 150 líneas de código.
- **Cero SDKs Comerciales:** Comunicación pura mediante `NativeHttpClient` y `fs` nativo en backend.
- **100% Suites en Verde:** Verificación completa de `npm test` en frontend y backend antes de concluir.

---

## 5. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN EXPLÍCITA DEL USUARIO.
- **Pausa Obligatoria:** El sistema se detiene y espera tu confirmación o ajustes antes de aplicar los cambios.

