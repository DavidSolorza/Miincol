# ADR-052: Servicio de Notificaciones por Correo Electrónico con Google

## Estado
Aprobado y Ejecutado

## Contexto
El usuario solicitó implementar el servicio de notificaciones por correo electrónico utilizando credenciales de Google para automatizar el envío de bienvenidas con credenciales a nuevos equipos territoriales, avisos de reportes vencidos y alertas críticas de campo.

## Decisiones Técnicas Adoptadas
1. **Configuración Segura y Variables de Entorno:**
   - Se crearon [`backend/.env.example`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/.env.example) y [`backend/.env`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/.env) (protegidos por `.gitignore` para no exponer secretos en git ni en el chat).
   - Se estandarizaron las variables de Google SMTP: `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`.

2. **Capa de Transporte Segura con Modo Simulación:**
   - Se implementó [`MailTransportService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/notifications/infrastructure/mail-transport.service.ts) (80 líneas).
   - Cuando las credenciales no están configuradas o en entornos de prueba, el servicio entra automáticamente en **modo simulación**, registrando los despachos en el logger sin generar excepciones ni bloquear el sistema.
   - Cuando las credenciales están presentes, despacha correos reales mediante transporte SMTP seguro.

3. **Plantillas HTML Ministeriales Modulares:**
   - [`welcome-team.template.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/notifications/infrastructure/templates/welcome-team.template.ts) (66 líneas): Plantilla institucional para la bienvenida al equipo territorial, credenciales de acceso (usuario y PIN) e integrantes asignados.
   - [`critical-alert.template.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/notifications/infrastructure/templates/critical-alert.template.ts) (63 líneas): Plantilla de alerta temprana con badges dinámicos según categoría (*Salud*, *Seguridad*, *Logística*, *Institucional*).

4. **Endpoints y Controladores:**
   - Se actualizaron [`NotificationsController`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/notifications/notifications.controller.ts) y [`NotificationsService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/notifications/notifications.service.ts) incorporando `GET /api/notifications/mail-status` (sin exponer contraseñas) y `POST /api/notifications/test-mail`.

5. **Gobernanza y Regla de 150 Líneas:**
   - Todos los archivos son estrictamente $\le 150$ líneas.
   - 100% de pruebas unitarias en verde (11 suites en backend con 45 pruebas, 16 suites en frontend con 53 pruebas).

## Consecuencias
- La plataforma queda lista para enviar notificaciones reales por correo de Google simplemente colocando las credenciales en el archivo local `backend/.env`.
- Si las credenciales no se configuran inmediatamente, el sistema continúa funcionando al 100% en modo simulación seguro.

