# Propuesta Técnica 058: Persistencia Real en Backend y PostgreSQL al Crear Colaboradores y Asignar Roles

## 1. Diagnóstico de la Causa Raíz
El usuario reportó:
> *"al crear un nuevo usuario no lo manda como guardado pero no lo guarda, revisa eso y tira un script de debug para buscar errores como eso porfa o dime si es error del servidor porfa"*

### Pruebas Realizadas y Conclusiones
Se diseñó y ejecutó el script de diagnóstico [scratch/debug-user-creation.js](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/scratch/debug-user-creation.js) directamente contra la API y base de datos en producción (`https://misincol-api.servidor.blog/api`):
1. **El servidor NO tiene ningún error:**
   - La API responde `HTTP 200` en `/health` y la base de datos PostgreSQL 15 (`misincol_db`) está conectada y operativa.
   - La ruta `POST /users` funciona con `HTTP 201 Created` y guarda usuarios correctamente en PostgreSQL.
   - La ruta `PATCH /users/:id/role` funciona con `HTTP 200 OK` y actualiza roles en PostgreSQL.
2. **La Falla está 100% en el Frontend:**
   - En `frontend/src/features/security/application/security-users.service.ts`:
     - El método `createUser(dto)` solo guardaba el nuevo usuario en el `localStorage` del navegador y mostraba el toast *"Colaborador registrado (Usuario Creado)"*.
     - **Nunca llamaba a `POST /users`** para enviar y persistir el usuario al servidor.
     - Al recargar la página, `syncFromBackend()` ejecutaba `GET /users` y, al no existir el usuario en el backend, la lista del servidor sobrescribía el `localStorage`, haciendo que el usuario creado desapareciera.
   - El método `updateUserRole` llamaba a `POST /security/users/sync` en lugar de `PATCH /users/:id/role`.

---

## 2. Solución Arquitectónica

### A. Crear Helper Especializado de Sincronización Backend
Archivo: `frontend/src/features/security/application/security-users-sync.helper.ts` (< 70 líneas):
- Mapeo bidireccional entre `SystemRoleId` (`national_director`, `director_general`, `team_leader`, `team_member`) y los roles del backend (`ROLE_NACIONAL`, `ROLE_DIRECTOR_GENERAL`, `ROLE_LIDER`, `ROLE_USUARIO`).
- `syncUserCreateToBackend(dto: CreateSystemUserDto)`: Ejecuta `POST /users` con `{ email, fullName, password, role, teamId }`.
- `syncUserRoleToBackend(userId: string, newRole: SystemRoleId)`: Ejecuta `PATCH /users/:id/role` con `{ role }`.

### B. Integración en `SecurityUsersService`
Archivo: `frontend/src/features/security/application/security-users.service.ts` (< 140 líneas):
- Al invocar `createUser(dto)`:
  1. Generar usuario local para respuesta inmediata de UI (optimistic update).
  2. Enviar a `syncUserCreateToBackend(dto)`.
  3. Si el backend retorna el ID persistido, actualizar el ID local del usuario.
- Al invocar `updateUserRole(userId, newRole)`:
  1. Actualizar estado local inmediatamente.
  2. Enviar mutación al servidor mediante `syncUserRoleToBackend(userId, newRole)`.
- En `syncFromBackend()`:
  - Mapear correctamente todos los roles (incluyendo `ROLE_DIRECTOR_GENERAL`).
  - Fusionar (merge) por correo electrónico para no perder usuarios locales válidos si el backend está en proceso de sincronización.

---

## 3. Gobernanza y Calidad
- Todos los archivos se mantienen estrictamente $\le 150$ líneas.
- Script de diagnóstico disponible en `scratch/debug-user-creation.js`.
- Pruebas unitarias de frontend y verificación de compilación.
