# ADR-055: Botones Explícitos de Guardado y Persistencia en Backend para Matriz de Roles y Vistas del Sistema

## Estado
Aceptado e Implementado (2026-11-12)

## Contexto
El usuario reportó que al interactuar con el gestor de roles y seguridad territorial, las modificaciones no se guardaban de manera explícita y no existía un botón de guardado en la interfaz. Asimismo, en el backend, la matriz de permisos solo residía en memoria RAM (`this.matrix`) y no persistía en el archivo físico `backend/data/security-matrix.json`. Tampoco existía persistencia para la sincronización de usuarios hacia `backend/data/users.json`, ni botones de confirmación de guardado en la vista de Información General.

## Decisiones de Diseño

### 1. Extensión de `JsonDbService` para Objetos JSON
- Se incorporaron los métodos atómicos `readObject<T>()` y `writeObject<T>()` en `backend/src/common/db/json-db.service.ts` para permitir el almacenamiento y lectura de diccionarios JSON como `security-matrix.json`.

### 2. Persistencia en `SecurityService` y `SecurityController`
- `SecurityService` implementa `OnModuleInit` cargando la matriz desde `backend/data/security-matrix.json`.
- En `updateMatrix()`, se escribe la matriz a disco atómicamente.
- Se agregó el endpoint `POST /api/security/users/sync` para persistir los usuarios y asignaciones en `backend/data/users.json`.

### 3. Botones de Guardado en el Frontend (`SecurityRolesHeaderComponent` & `SecurityRolesViewComponent`)
- **Pestaña Matriz de Permisos:** Se incorporó el botón **"Guardar Matriz"** con icono de confirmación y estado reactivo `Guardando...` / `Guardado` que llama a `SecurityMatrixService.saveMatrixToBackend()`.
- **Pestaña Roles de Personas:** Se incorporó el botón **"Guardar Roles"** que ejecuta `SecurityUsersService.saveUsersToBackend()`, guardando simultáneamente en `localStorage` y en `backend/data/users.json`.

### 4. Botón de Confirmación en Vista General (`GeneralInfoViewComponent`)
- Se agregó una barra de acciones en la parte superior con el botón **"Guardar Cambios"** que confirma visualmente con `ToastService` la persistencia local de la misión activa.

## Consecuencias
- Certeza total para el usuario: Los cambios se persisten tanto en el navegador como en el servidor backend en archivos JSON estructurados.
- Se previene la pérdida de configuraciones de permisos y roles tras recargas de página o reinicio del backend.
- Cumplimiento estricto del límite de $\le 150$ líneas por archivo (.ts) según la Gobernanza Técnica v2026.4.0.

