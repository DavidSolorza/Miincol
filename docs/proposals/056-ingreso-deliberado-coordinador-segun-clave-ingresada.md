# Propuesta Técnica 056: Ingreso Deliberado para Coordinador según Clave Escrita (Cero Autologin / Contraseña en Blanco)

## 1. Contexto y Diagnóstico
El usuario ha solicitado de manera explícita:
> *"para el coordinador de equipos no inicies la sesión de una sino que él debe de poner la contraseña para la vista que desea entrar ya sea como administrador de equipo o como líder de equipo"*

### Causa Raíz Identificada
1. En `frontend/src/features/auth/infrastructure/login-view.component.ts`:
   - Línea 56: `readonly identifier = signal('hudisapastos@misincol.org');`
   - Línea 57: `readonly password = signal('admin2026');`
2. El formulario de inicio de sesión venía precargado en código con las credenciales del coordinador y, críticamente, con la contraseña `'admin2026'`.
3. Al abrir la pantalla de acceso o presionar la tecla Enter / botón "Ingresar", el sistema enviaba inmediatamente `'admin2026'` al endpoint `/auth/login`. Como `'admin2026'` es la clave de administración, el servidor devolvía `view: 'ADMIN_DASHBOARD'` y se iniciaba sesión "de una" en el panel administrativo, sin permitirle al pastor/coordinador decidir si quería entrar como líder de su equipo territorial (`Pastos2026` -> `TEAM_VIEW`).

---

## 2. Solución Arquitectónica Propuesta

### A. Erradicación de Credenciales Precargadas en Memoria
- Inicializar `identifier` y `password` en cadenas vacías `signal('')` dentro de `login-view.component.ts`.
- Deshabilitar cualquier autologin involuntario. El usuario debe ingresar explícitamente su contraseña cada vez que inicia sesión.

### B. Selección de Vista Determinada Exclusivamente por la Contraseña Escrita
El flujo de autenticación dual (respaldado por el backend en `/auth/login` y en fallback local `verifyAuthCredentials.ts`) opera según la contraseña que el coordinador ingrese:
1. **Si escribe la Contraseña de Administrador (`admin2026`):**
   - El backend responde `view: 'ADMIN_DASHBOARD'`, `accessType: 'COORDINADOR'`.
   - El frontend dirige inmediatamente al **Tablero Administrativo Nacional**.
2. **Si escribe el PIN de su Equipo Territorial (`Pastos2026` o `pastos2026`):**
   - El backend responde `view: 'TEAM_VIEW'`, `accessType: 'LIDER'`, `teamId: 'team-pastos'`.
   - El frontend dirige inmediatamente a la **Vista de Misión del Equipo Pastos**.

### C. Guía Visual y Contextual en el Formulario (`LoginFormFieldsComponent`)
- En `login-form-fields.component.ts` (actualmente 73 líneas), añadir una nota de orientación sutil cuando se reconozca el correo institucional del coordinador (`hudisapastos@misincol.org` o líderes con rol dual):
  - *"💡 Digita tu clave de administración para el Panel Nacional o el PIN de tu misión (ej. Pastos2026) para la Vista de Equipo."*
- El campo de contraseña permanece siempre vacío y con validación requerida.

---

## 3. Cumplimiento de Gobernanza Técnica
- **Límite de 150 líneas:** `login-view.component.ts` (144 líneas) y `login-form-fields.component.ts` (~95 líneas) permanecen estrictamente bajo el límite.
- **Sin SDKs externos:** Consumo nativo HTTP REST vía `httpClient`.
- **Pausa obligatoria:** Se presenta esta propuesta formal y ADR-072 a la espera de la confirmación explícita del usuario.

