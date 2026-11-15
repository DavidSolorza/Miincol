# ADR-070: Inyección Automática de Bearer Token en HTTP Client y Resguardo Defensivo de Sesión

## Estado
Propuesto (Esperando Aprobación)

## Contexto
Se presentaron dos fallos encadenados durante el inicio de sesión:
1. `GET /users` y `GET /teams` fallaban con HTTP 401 debido a que `httpClient.ts` no enviaba el encabezado `Authorization: Bearer <token>` almacenado en `localStorage`.
2. Como resultado, la lista de equipos en memoria estaba vacía (`[]`). Al iniciar sesión como líder (`TEAM_VIEW`), la búsqueda del equipo arrojaba `undefined`, provocando `TypeError: Cannot read properties of undefined (reading 'id')` dentro de `handleTeamLogin`.

## Decisión de Arquitectura
1. **Inyección Centralizada de Token:** Configurar `NativeHttpClient` para adjuntar automáticamente el encabezado `Authorization: Bearer <token>` cuando exista un token activo en `localStorage`, sin requerir que cada servicio lo añada manualmente.
2. **Resguardo de Entidad de Equipo:** En `LoginViewComponent`, si la búsqueda en `allTeams` no encuentra el equipo devuelto por el backend, se instanciará una entidad completa `TeamSupervisionSummary` basada en `res.user`, eliminando la posibilidad de emitir `undefined`.
3. **Defensividad en `AppSessionService`:** Incorporar salvaguardas en `handleTeamLogin` que validen la existencia del parámetro `team` antes de leer `team.id`.
4. **Cumplimiento de Gobernanza:** Mantener todos los archivos en $\le 150$ líneas.

## Consecuencias
- Desaparición de los errores HTTP 401 en llamadas subsecuentes al backend.
- Flujo de login blindado y resiliente, garantizando el ingreso a la vista de equipo sin excepciones JavaScript.

