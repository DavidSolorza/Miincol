# Propuesta Técnica 052: Adaptación del Frontend a la Autenticación Basada en accessType y view del Backend

## 1. Contexto y Diagnóstico
El backend de autenticación (`misincolBack` / `/auth/login`) fue actualizado con las siguientes mejoras críticas:
1. Se retiró `pastos2026` de la lista de claves antiguas de coordinador.
2. El PIN del equipo se valida sin distinguir mayúsculas/minúsculas (`Pastos2026` vs `pastos2026`).
3. Se eliminó la ambigüedad de permisos: cuando se ingresa con el PIN del equipo, la sesión se genera con `isCoordinator: false`, `accessType: 'LIDER'`, `role: 'ROLE_LIDER'` y `view: 'TEAM_VIEW'`.
4. Cuando se ingresa con contraseña de coordinador institucional (`admin2026`), la sesión responde con `isCoordinator: true`, `accessType: 'COORDINADOR'`, `role: 'ROLE_NACIONAL'` y `view: 'ADMIN_DASHBOARD'`.
5. Si se ingresa con el ID de equipo (`team-...`) como usuario, solo se admite el PIN; cualquier intento de usar la clave de coordinador es rechazado con HTTP 401.

### Problema en el Frontend
En el frontend (`frontend/src/features/auth/infrastructure/login-view.component.ts`):
- `handleSubmit()` ejecutaba `httpClient.post('/auth/login')` de forma desatendida (fire-and-forget), ignorando por completo `accessType` y `view` de la respuesta del backend.
- De inmediato y de forma síncrona, ejecutaba `verifyAuthCredentials()` con listas duras donde:
  - `cleanUser` (`hudisapastos@misincol.org`) siempre se catalogaba como `isAdmin = true` (`activeTab = 'admin'`).
  - `pastos2026` figuraba en `isAdminPass`.
  - Como resultado, cualquier ingreso con `hudisapastos@misincol.org` (incluso con el PIN de equipo) derivaba forzosamente a `onAdminSuccess()` y al dashboard administrativo.

---

## 2. Solución Propuesta

### A. Tipado de Dominio (`auth.types.ts`)
Definir los tipos oficiales del contrato de autenticación:
```typescript
export type BackendLoginAccessType = 'COORDINADOR' | 'LIDER';
export type BackendLoginView = 'ADMIN_DASHBOARD' | 'TEAM_VIEW';

export interface BackendLoginResponse {
  success: boolean;
  token?: string;
  accessToken?: string;
  accessType?: BackendLoginAccessType;
  view?: BackendLoginView;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    accessType?: BackendLoginAccessType;
    view?: BackendLoginView;
    teamId?: string | null;
    isCoordinator?: boolean;
    loginMode?: string;
  };
}
```

### B. Flujo Asíncrono en `LoginViewComponent` (`login-view.component.ts`)
1. `handleSubmit()` espera la respuesta de `httpClient.post<BackendLoginResponse>('/auth/login', { identifier, password })`.
2. Al recibir respuesta exitosa:
   - Almacenar token en `localStorage` (`misincol_auth_token`).
   - Si `res.view === 'ADMIN_DASHBOARD'`:
     - Localizar equipo en `allTeams` si `res.user?.teamId` está definido.
     - Emitir `this.adminSuccess.emit(matchedTeam)`.
   - Si `res.view === 'TEAM_VIEW'`:
     - Localizar el equipo correspondiente (`res.user?.teamId` o por correo de líder).
     - Emitir `this.teamSuccess.emit({ team: matchedTeam, isNationalAdmin: false })`.
   - Desactivar spinner de carga (`loading.set(false)`).
3. Si el backend responde error (HTTP 401 / 400):
   - Mostrar el mensaje exacto de credenciales incorrectas en `error.set(...)`.
   - No desviar indebidamente ni forzar accesos locales si el backend rechazó las credenciales.
4. Fallback Offline:
   - Solo en caso de error de red estricto (falta de conexión o servidor inalcanzable), acudir a `verifyAuthCredentials`.

### C. Refactorización de Respaldo Offline (`verifyAuthCredentials.ts`)
- Eliminar `pastos2026` de `isAdminPass`.
- Validar PINs de equipo de forma insensible a mayúsculas/minúsculas (`cleanPass.toLowerCase() === expectedPin.toLowerCase()`).
- Si la clave coincide con el PIN del equipo, dirigir a `onTeamSuccess(matched, false)` (rol de líder puro, sin privilegios de coordinador).

---

## 3. Plan de Pruebas y Validación
1. Ejecutar pruebas unitarias existentes y añadir casos para `accessType` y `view` en `verifyAuthCredentials.spec.ts`.
2. Validar que todos los archivos modificados permanezcan estrictamente en $\le 150$ líneas.
3. Compilar el frontend con `npm run build` sin errores.

