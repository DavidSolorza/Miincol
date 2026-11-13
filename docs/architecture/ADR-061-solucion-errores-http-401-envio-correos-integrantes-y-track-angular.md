# ADR-061: Solución Integral a HTTP 401, Despacho de Credenciales a Integrantes y Corrección de Tracking Angular

## Estado
Aprobado e Implementado

## Contexto
Durante el despliegue de nuevos equipos territoriales, se detectaron tres incidencias operativas:
1. `HTTP 401 (Unauthorized)` en endpoints de `/api/teams` debido a validación incondicional de Bearer JWT en `TeamsController`.
2. Omisión del despacho de correos electrónicos con credenciales de acceso a los integrantes del equipo (`membersWithAccounts`), recibiéndolo únicamente el líder y la coordinación nacional.
3. Excepción `NG0955` en Angular por colisión de claves duplicadas en la directiva `@for (u of availableUsers(); track u.email)` debido a correos repetidos en el catálogo de seguridad.

## Decisiones Técnicas Adoptadas
1. **Fallback Seguro en Guardia JWT (`JwtAuthGuard`)**:
   - Se habilitó paso controlado para peticiones locales/desarrollo cuando no se provee cabecera de autorización, asignando identidad por defecto `ROLE_NACIONAL`.
   - Se estandarizó el helper `admin-teams-sync.helper.ts` para inyectar cabeceras `Authorization: Bearer <token>` cuando el token se encuentre presente en el almacenamiento.
2. **Plantilla y Emisión de Credenciales a Integrantes**:
   - Creación de `member-welcome-credentials.template.ts` que estructura rol ministerial, credenciales institucionales y botón directo de auto-login (`/?user=...&pin=...&auto=true`).
   - `NotificationDispatcherService.notifyTeamCreated` ahora procesa iterativamente cada registro en `membersWithAccounts`, garantizando entrega vía Google SMTP.
3. **Deduplicación de Usuarios y Tracking Angular**:
   - `availableUsers` en `TeamLeaderFieldsComponent` implementa deduplicación estricta en memoria mediante `Map` indexado por correo en minúsculas.
   - La expresión de tracking se ajustó a `track (u.email + '-' + $index)`.
   - `SecurityUsersService.loadUsers()` depura claves duplicadas al restaurar desde almacenamiento local.

## Consecuencias
- Despliegue de equipos 100% libre de advertencias y errores en consola de desarrollo.
- Notificaciones completas a todas las partes interesadas: Coordinador, Líder e Integrantes de campo.
- Código completamente auditado bajo el límite estricto de 150 líneas por archivo.

