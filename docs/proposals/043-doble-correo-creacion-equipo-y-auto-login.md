# Propuesta Técnica 043: Doble Correo en Creación de Equipo y Auto-Login para Líder

## 1. Contexto y Requerimiento
El usuario ha solicitado:
> *"al crear un nuevo equipo debería de enviar dos correos: uno al coordinador de equipo con las credenciales y dando visto bueno a la ejecución de la acción, y otro correo al líder de equipo con las credenciales e información junto con un botón que lo lleve a la página y le llene los datos para el ingreso a su página"*

---

## 2. Arquitectura de la Solución Técnica

### A. Emisión Dual de Correos en Backend (`TeamsService` / `NotificationDispatcherService`)
Al invocar `POST /api/teams` (`createTeam`):
1. **Correo 1 — Al Coordinador de Equipos (Supervisión Nacional):**
   - **Destinatario:** `process.env.MAIL_USER` (Dirección Nacional).
   - **Asunto:** `Misincol - Notificación Oficial: Alta y Despliegue de Misión [Nombre]`
   - **Contenido:**
     - Visto bueno y confirmación formal de la creación del equipo en el sistema nacional.
     - Resumen ejecutivo de la misión (Etnia, Departamento, Región, Presupuesto total asignado).
     - Datos del liderazgo pastoral asignado (Nombre del Líder, Correo, PIN de acceso generado).
     - Botón CTA: `👉 Ir al Tablero de Supervisión Nacional`.

2. **Correo 2 — Al Líder de Equipo (Pastoral de Campo):**
   - **Destinatario:** `dto.leaderEmail` (correo del líder territorial).
   - **Asunto:** `Bienvenido a Misincol - Credenciales de Acceso a tu Misión Territorial`
   - **Contenido:**
     - Mensaje ministerial de bienvenida al Plan Estratégico Misincol 2026.
     - Ficha técnica de la misión asignada y su territorio.
     - Credenciales oficiales de acceso:
       - **Usuario / Correo:** `[leaderEmail]`
       - **Contraseña / PIN:** `[accessPin]`
     - Botón CTA con Auto-llenado: `👉 Ingresar Directamente a Mi Misión Territorial`.
     - URL generada: `http://localhost:5173/?user=[leaderEmail]&pin=[accessPin]&tab=team&auto=true`.

---

### B. Auto-llenado y Acceso Directo en Frontend (`LoginViewComponent`)
1. En `LoginViewComponent.ngOnInit()`:
   - Detectar parámetros en la URL (`user`, `pin`, `tab`, `auto`).
   - Si existen en la URL, rellenar reactivamente los campos `identifier`, `password` y fijar la pestaña en `team`.
   - Si el parámetro `auto=true` está presente, ejecutar el inicio de sesión automático y fluido, ingresando directamente a la vista general de la misión.
   - Limpiar los query parameters de la barra de direcciones tras el inicio para mayor seguridad visual.

---

### C. Plantillas HTML de Correo Responsivas y Accesibles
1. [coordinator-team-created.template.ts](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/notifications/infrastructure/templates/coordinator-team-created.template.ts): Plantilla institucional formal con visto bueno nacional ($\le 80$ líneas).
2. [leader-welcome-credentials.template.ts](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/notifications/infrastructure/templates/leader-welcome-credentials.template.ts): Plantilla cálida con credenciales destacadas y botón de auto-ingreso ($\le 85$ líneas).

---

## 3. Compromisos de Gobernanza Técnica (v2026.4.0)
- Límite estricto de $\le 150$ líneas por archivo (.ts).
- Cero SDKs comerciales: uso exclusivo de Nodemailer nativo con Google SMTP y transporte HTTP estándar.
- Cobertura 100% de pruebas en frontend y backend.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN EXPLÍCITA DEL USUARIO.

