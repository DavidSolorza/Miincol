# ADR-054: Verificación de Notificaciones por Correo Google y Validación Estricta de Correo en Base de Datos para Login

## Estado
Aceptado e Implementado (2026-11-11)

## Contexto
El sistema requería:
1. **Validación estricta de correo electrónico en el login:** Al ingresar una credencial con formato de correo (`@`), comprobar que tenga una sintaxis RFC válida y validar previamente si el correo existe en la base de datos de Misincol (Directorio Nacional, líderes territoriales, integrantes con cuenta registrada o usuarios del sistema). Si no existe, rechazar explícitamente informando que no está registrado en la base de datos antes de evaluar la contraseña.
2. **Diagnóstico y prueba en vivo de notificaciones Google SMTP:** Proporcionar al administrador nacional una interfaz visual en el panel de supervisión para probar la conectividad con Google (`smtp.gmail.com:587`), monitorear el estado actual (activo vs. modo simulación) y despachar correos de prueba en vivo a cualquier dirección.

## Decisiones de Diseño

### 1. Validación de Sintaxis y Existencia Previa en DB (`verifyAuthCredentials.ts`)
- Se implementó `EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/`. Si el usuario ingresa un identificador con `@` pero sintaxis inválida, se arroja: *"El formato del correo electrónico no es válido (ej. usuario@misincol.org)"*.
- Se evalúa contra las cuentas autorizadas de Dirección Nacional (`director@misincol.org`, `admin@misincol.org`), usuarios especiales y el directorio de equipos misioneros (`t.leaderEmail`, `t.membersWithAccounts`).
- Si no hay coincidencia: *"El correo '{correo}' no se encuentra registrado en la base de datos de Misincol. Comuníquese con la Dirección Nacional."*
- Si hay coincidencia pero la clave no coincide: *"Contraseña incorrecta para {equipo/usuario}."*

### 2. Modal de Diagnóstico de Correo (`test-mail-modal.component.ts`)
- Integrado en `super-admin-filters.component.ts` y `super-admin-view.component.ts`.
- Consume `GET /api/notifications/mail-status` para reportar si las credenciales de Google Workspace (`MAIL_USER` y `MAIL_PASS`) están activas o en modo simulación seguro.
- Permite ingresar un destinatario y ejecutar `POST /api/notifications/test-mail` con respuesta inmediata y retroalimentación mediante `ToastService`.

## Consecuencias
- Cero accesos opacos o confusos: Los usuarios saben de inmediato si su correo está registrado o si cometen un error en la contraseña.
- Diagnóstico asistido: La Dirección Nacional puede verificar en un clic si su Contraseña de Aplicación de Google está funcionando correctamente antes de desplegar notificaciones masivas.
- Cumplimiento total de Gobernanza Técnica v2026.4.0 (todos los archivos $\le 150$ líneas).

