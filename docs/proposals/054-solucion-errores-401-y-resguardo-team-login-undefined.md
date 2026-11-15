# Propuesta Técnica 054: Inyección Automática de Token JWT en HTTP Client y Resguardo Defensivo de Equipo en Inicio de Sesión

## 1. Diagnóstico del Error

### Mensajes en Consola Reportados
```
GET https://misincol-api.servidor.blog/api/users 401 (Unauthorized)
GET https://misincol-api.servidor.blog/api/teams 401 (Unauthorized)
ERROR TypeError: Cannot read properties of undefined (reading 'id')
    at e.handleTeamLogin (index-BHszpriZ.js:6:171108)
```

### Causas Raíz Identificadas
1. **Peticiones sin Encabezado `Authorization`:**
   En `frontend/src/core/http/httpClient.ts`, las peticiones HTTP (`GET /teams`, `GET /users`) no adjuntaban automáticamente el encabezado `Authorization: Bearer <token>` cuando el token existía en `localStorage`. Por esta razón, cualquier llamada de sincronización inicial era rechazada por el backend con HTTP 401.
2. **Arreglo de Equipos Vacío antes de Autenticar:**
   Al fallar `syncFromBackend()`, `dashboardService.allTeams()` permanecía en un arreglo vacío (`[]`).
3. **`team` Indefinido en `LoginViewComponent`:**
   Cuando el backend respondía exitosamente `view === 'TEAM_VIEW'` con `teamId: 'team-1794669236596'`, `this.allTeams.find(...)` no encontraba el equipo porque la lista estaba vacía, devolviendo `undefined` a `teamSuccess.emit({ team: undefined })`.
4. **Falta de Salvaguarda en `AppSessionService.handleTeamLogin`:**
   Al invocar `sessionService.handleTeamLogin(undefined)`, la sentencia `newSession = { teamId: team.id }` explotaba con `TypeError: Cannot read properties of undefined (reading 'id')`.

---

## 2. Solución Propuesta

### A. Inyección Global de Token en `NativeHttpClient` (`httpClient.ts`)
- En el método `request()` de `httpClient.ts`, inspeccionar si existe un token en `localStorage.getItem('misincol_auth_token')`.
- Si existe y la petición no define ya un encabezado `Authorization`, inyectar automáticamente `'Authorization': 'Bearer ' + token`.
- Esto garantiza que todas las peticiones a la API cuenten con credenciales válidas en cuanto el usuario inicia sesión.

### B. Objeto de Resguardo Garantizado en `LoginViewComponent` (`login-view.component.ts`)
- Si `this.allTeams` no contiene la misión del líder (`matched === undefined`):
  - Construir un objeto `TeamSupervisionSummary` completo y válido a partir de `res.user` (`id`, `teamId`, `fullName`, `email`).
  - Asegurar que `this.teamSuccess.emit({ team: matched, isNationalAdmin: false })` **jamás** emita `undefined`.
- Tras un login exitoso, invocar la sincronización autenticada de equipos.

### C. Guardas Defensivas en `AppSessionService` (`app-session.service.ts`)
- En `handleTeamLogin(team?: TeamSupervisionSummary, ...)`:
  - Validar que `team` exista antes de acceder a `team.id`.
  - Si no existe, construir un objeto de sesión con valores seguros o fallback.

---

## 3. Plan de Pruebas y Validación
1. Pruebas unitarias en `app-session.service.spec.ts` validando el manejo seguro de sesión cuando `team` no esté precargado.
2. Verificación estricta del límite $\le 150$ líneas por archivo.
3. Ejecución de `npm --prefix frontend test -- --run` y `npm --prefix frontend run build`.

