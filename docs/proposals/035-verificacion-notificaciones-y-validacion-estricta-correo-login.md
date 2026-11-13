# Propuesta Técnica 035: Verificación de Notificaciones por Correo Google y Validación Estricta de Correo en Base de Datos para Login

## 1. Contexto y Requerimiento
El usuario ha solicitado:
> *"revisemos las notificaciones por correo electronico ayudame revisando que funcionen lo mismo con la autentificacion al poner un correo que revise si es real y si esta en la base de datos de lo contrario mostrar error"*

### Diagnóstico de Necesidades:
1. **Validación Estricta de Correo en el Login:**
   - Si el usuario ingresa un identificador que parece correo (o contiene `@`), se debe validar que tenga una estructura sintáctica real (`usuario@dominio.ext`).
   - Se debe verificar si el correo **existe efectivamente en la base de datos del sistema** (Directorio Nacional, líderes territoriales, integrantes registrados o usuarios de `SecurityUsersService`).
   - Si el correo **NO existe**: Mostrar un error explícito y claro:
     *"El correo 'usuario@ejemplo.com' no está registrado en la base de datos de Misincol. Comuníquese con la Dirección Nacional para su registro."*
   - Si el correo **SÍ existe**: Verificar la contraseña. Si la contraseña no coincide:
     *"Contraseña incorrecta para 'usuario@ejemplo.com'. Verifique su clave o comuníquese con su líder."*

2. **Verificación y Prueba en Vivo de Notificaciones por Correo con Google:**
   - Revisar la configuración en `backend/.env`. Actualmente `MAIL_USER` y `MAIL_PASS` están vacíos, por lo que opera en modo simulación seguro.
   - Brindar al usuario una herramienta visual en la administración (o endpoint probado) para probar el envío en vivo a su propio correo personal y verificar si Google SMTP conecta con éxito o si requiere ajustar la Contraseña de Aplicación de 16 caracteres.

---

## 2. Alcance de la Solución Técnica

### A. Frontend: Validación Estricta en `verifyAuthCredentials.ts` y Formulario de Login
1. **Validador de Formato de Correo:**
   - Expresión regular RFC-compliant limpia: `/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/`.
   - Si contiene `@` pero no cumple la estructura de dominio real:
     Retorna inmediatamente error: *"El formato del correo electrónico no es válido (ej. usuario@misincol.org)."*
2. **Búsqueda Previa en Base de Datos de Usuarios:**
   - Buscar coincidencia del correo en:
     - Correos administrativos (`director@misincol.org`, `admin@misincol.org`).
     - Lista consolidada de usuarios de `SecurityUsersService` (`localStorage`).
     - Líderes e integrantes registrados en `allTeams` (`t.leaderEmail`, `t.membersWithAccounts`).
   - Si NO se encuentra en ninguna de las fuentes de datos:
     Retorna: *"El correo '${identifier}' no se encuentra registrado en la base de datos de Misincol."*
   - Si SÍ se encuentra: Procede a validar la contraseña. Si la contraseña falla:
     Retorna: *"Contraseña incorrecta para ${identifier}."*

### B. Herramienta de Diagnóstico y Envío de Correo de Prueba
1. **Prueba en Backend:**
   - Verificar `MailTransportService.verifyConnection()` y `POST /api/notifications/test-mail`.
2. **Diagnóstico en Frontend:**
   - Agregar en la vista de administración un botón/panel *"Probar Conexión de Correo Google"* que permite ingresar un correo destinatario y enviar un mensaje de prueba con estado en vivo:
     - Si `MAIL_USER` y `MAIL_PASS` están configurados en `backend/.env`: Google enviará el correo real.
     - Si están vacíos: Informará *"Modo Simulación: Credenciales no detectadas en backend/.env. Agregue MAIL_USER y MAIL_PASS para envíos reales"*.

---

## 3. Calidad y Gobernanza
- Límite estricto de $\le 150$ líneas por archivo (.ts).
- 100% de suites de pruebas unitarias en verde en frontend y backend.
- Cero dependencias externas no estándar.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN EXPLÍCITA DEL USUARIO.
- **Pausa Obligatoria:** El sistema se detiene y espera tu confirmación o ajustes antes de aplicar los cambios.

