# 🔐 Credenciales de Prueba y Matriz de Acceso del Sistema
**Proyecto:** Plan Ministerial Misincol (PDM) & Portal de Misiones Territoriales  
**Versión:** 2.0.0  
**Entorno:** Pruebas y Desarrollo Local (`dev`)  
**Fecha de Emisión:** 14 de Octubre de 2026  

---

## 1. Resumen de Seguridad y Modelo de Roles

El sistema implementa una arquitectura de autenticación y aislamiento estricto basada en dos roles de usuario:

1. **Super Administrador (Director Nacional Misincol)**:
   - Acceso irrestricto al **Tablero Central de Misiones Indígenas**.
   - Supervisión consolidada de KPIs nacionales, presupuestos de todas las etnias y alertas territoriales.
   - Creación, edición y eliminación de equipos territoriales con asignación de color temático (`themeColor`) y contraseñas.
   - Capacidad de ingresar en **Modo Vista Previa Administrador** a cualquier plan territorial y regresar al tablero central con un solo clic.

2. **Equipo Territorial / Misionero en Campo (Acceso Restringido por Misión)**:
   - Acceso exclusivo al **Plan de Desarrollo Ministerial (PDM)** de su propia comunidad y territorio.
   - **Aislamiento total:** No tiene acceso al Tablero Central de Administración, no puede cambiar de equipo, ni visualizar presupuestos o iniciativas de otras misiones indígenas.
   - Capacidad de actualizar actividades inline, recalcular presupuestos de su equipo y consultar métricas de avance.

---

## 2. Matriz de Credenciales de Usuarios de Prueba

| Rol / Misión | Usuario / Slug | Contraseña de Acceso | Etnia / Territorio | Alcance y Permisos |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **Super Administrador** | `admin` | `210910624Dj` *(o `admin2026`)* | Nacional (Colombia) | Acceso total al panel administrativo, métricas nacionales, gestión de equipos y modo supervisión. |
| 🌵 **Misión Wayuu** | `wayuu` *(o `team-wayuu`)* | `wayuu2026` | Wayuu (Alta Guajira) | Acceso restringido únicamente al PDM de Misión Wayuu (Líder: Pr. David Morales). |
| 🏔️ **Misión Nasa** | `nasa` *(o `team-nasa`)* | `nasa2026` | Nasa Páez (Tierradentro, Cauca) | Acceso restringido únicamente al PDM de Misión Nasa (Líder: Pr. Marcos Chocué). |
| 🌿 **Misión Emberá Chamí** | `embera` *(o `team-embera`)* | `embera2026` | Emberá (Risaralda / Pueblo Rico) | Acceso restringido únicamente al PDM de Misión Emberá (Líder: Pr. Daniel Guasaruka). |
| ⛰️ **Misión Iku (Arhuaco)** | `arhuaco` *(o `team-arhuaco`)* | `arhuaco2026` | Arhuaco (Sierra Nevada, Cesar) | Acceso restringido únicamente al PDM de Misión Iku (Líder: Pr. Eliécer Torres). |
| 🌳 **Misión Nukak Makú** | `nukak` *(o `team-nukak`)* | `nukak2026` | Nukak (Selva de Guaviare) | Acceso restringido únicamente al PDM de Misión Nukak (Líder: Pr. Samuel Caicedo). |

---

## 3. Acceso Rápido por URL (Deep Linking & Auto-Login)

Al igual que en `PortalClientes-`, el sistema admite parámetros seguros en la URL para acceso automático durante pruebas o soporte directo:

- **Ingreso automático a Super Admin:**
  ```text
  http://localhost:5173/?slug=admin&pass=210910624Dj
  ```

- **Ingreso automático a Misión Wayuu:**
  ```text
  http://localhost:5173/?slug=wayuu&pass=wayuu2026
  ```

- **Ingreso automático a Misión Nasa:**
  ```text
  http://localhost:5173/?slug=nasa&pass=nasa2026
  ```

---

## 4. Nuevos Equipos Creados por el Administrador

Cuando el Super Administrador aprovisiona una nueva misión desde el botón **`+ Nuevo Equipo / Misión`**:
- El campo **`Contraseña de Acceso del Equipo`** permite asignarle una clave personalizada al nuevo equipo.
- Si se deja vacía, el sistema asignará por defecto: `[slug]2026` (ejemplo para `team-misak`: `misak2026`).
- El nuevo equipo podrá iniciar sesión inmediatamente desde la pantalla principal de login usando su usuario y clave establecida.
