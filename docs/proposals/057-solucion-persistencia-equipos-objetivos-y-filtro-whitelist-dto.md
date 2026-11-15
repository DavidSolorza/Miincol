# Propuesta Técnica 057: Solución a Persistencia de Equipos, Objetivos y Actividades por Rechazo de Whitelist DTO (HTTP 400)

## 1. Contexto y Diagnóstico Exacto
El backend en PostgreSQL (`misincol_db`) no guardó los equipos Barí, Baudó y Pastos creados entre las 6:22 y 6:39 PM, a pesar de que los correos sí salieron a sus líderes.

### Prueba en Vivo y Causa Raíz Comprobada
Se realizó una prueba directa contra el endpoint en vivo `https://misincol-api.servidor.blog/api/teams`:
1. **Respuesta del servidor al enviar el payload del frontend:**
   ```json
   HTTP 400 Bad Request
   {
     "message": ["property id should not exist", "property slug should not exist"],
     "error": "Bad Request",
     "statusCode": 400
     }
   ```
2. **Causa:** El backend tiene configurado `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`. En el `CreateTeamDto` desplegado en el servidor, las propiedades `id` y `slug` están prohibidas en el cuerpo de creación.
3. **Por qué salieron los correos:**
   En `frontend/src/features/admin/application/admin-teams-sync.helper.ts`:
   - Se ejecutaba `httpClient.post('/teams', ...).catch(() => {})`, que rebotaba con 400 y se silenciaba.
   - Inmediatamente después se ejecutaba `httpClient.post('/notifications/team-created', ...)`. Como esta ruta no tiene guardias de rol ni `forbidNonWhitelisted` estricto, respondía 200 y enviaba los correos.
4. **Verificación:** Al enviar el mismo payload **sin `id` ni `slug`**, el servidor respondió de inmediato:
   ```json
   HTTP 201 Created
   {"id": "team-...", "name": "Misión Prueba", ...}
   ```
   Y guardó el registro correctamente en PostgreSQL.

---

## 2. Diagnóstico de Objetivos y Actividades en Cero
El backend reportó que la tabla de objetivos y actividades está en 0 registros.
En `frontend/src/features/plans/application/plan-outbox.helper.ts`:
1. `queueObjectiveMutation` enviaba `objectiveNumber` y `phaseId`. `CreateObjectiveDto` exige `pillarId` y rechaza `objectiveNumber` y `phaseId` con HTTP 400.
2. `queueActivityMutation` enviaba `id`, `teamId` y `phaseId`. `CreateActivityDto` exige `objectiveId` y rechaza propiedades no autorizadas con HTTP 400.

---

## 3. Plan de Solución

### A. Sanitización de Payload en `admin-teams-sync.helper.ts`
- En `syncTeamCreatedToBackend`:
  - Excluir terminantemente `id` y `slug` del cuerpo enviado a `POST /teams`.
  - Enviar solo los campos válidos de `CreateTeamDto`: `name`, `location`, `population`, `evangelicaCongregations`, `evangelicalsCount`, `leader`, `leaderEmail`, `leaderPhone`, `themeColor`, `healthStatus`, `accessPin`, `membersWithAccounts`, `totalBudget`, `ethnicity`, `region`, `department`, `currentPhaseId`.
  - Asegurar que `POST /notifications/team-created` solo se dispare si `POST /teams` se procesa con éxito (o registrar el error visiblemente si falla).
- En `syncTeamUpdatedToBackend`:
  - Limpiar el payload de `PUT /teams/:id` extrayendo solo las claves permitidas en `CreateTeamDto`, evitando enviar campos de UI como `lastUpdate`, `progressPercentage`, `membersCount`, etc.

### B. Corrección de DTOs en `plan-outbox.helper.ts`
- Adaptar las mutaciones de objetivos para incluir `pillarId` y omitir `objectiveNumber`.
- Adaptar las mutaciones de actividades para enviar `objectiveId` válido y omitir campos prohibidos.

### C. Instrucción al Usuario
- Confirmar al ingeniero del servidor que su propuesta de logging es excelente.
- Recrear los equipos Barí, Baudó y Pastos en el frontend una vez aplicado el fix: se guardarán de inmediato en PostgreSQL.

