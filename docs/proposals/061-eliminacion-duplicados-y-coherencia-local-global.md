# Propuesta Técnica 061: Eliminación de Duplicados y Sinergia Total entre Base Local y Base Global

## 1. Contexto y Diagnóstico
El usuario identificó en la base de datos registros duplicados e incompletos derivados de pruebas manuales previas (`pastos01` repetido, `bari01`, `equipo-bari2026` con presupuestos en 0). Asimismo, se requiere garantizar coherencia absoluta entre el estado offline/local de la aplicación y la base de datos central en producción (`PostgreSQL 15` en `misincol-api.servidor.blog`).

### Diagnóstico de Coherencia
1. **Base de Datos Global (Servidor Central):**
   - Se ejecutó el restablecimiento oficial de la colección `teams` en el servidor remoto.
   - El endpoint `GET /teams` en producción cuenta actualmente con exactamente los **6 equipos oficiales únicos**:
     - `team-pastos` (Misión Pastos)
     - `team-nasa` (Misión Nasa)
     - `team-embera` (Misión Emberá Chamí)
     - `team-wayuu` (Misión Wayuu)
     - `team-arhuaco` (Misión Iku - Sierra Nevada)
     - `team-nukak` (Misión Nukak Makú)
   - Los registros de prueba duplicados (`pastos01`, `bari01`) ya han sido erradicados de la base de datos remota.

2. **Base Local del Frontend (`initialTeams` y `localStorage`):**
   - En `frontend/src/features/admin/application/initialTeams/index.ts`, la constante `INITIAL_NATIONAL_TEAMS` contenía únicamente 2 equipos (`pastosTeam` y `wayuuTeam`), mientras que `FIXTURE_NATIONAL_TEAMS` contenía los 6.
   - En el navegador del usuario, `localStorage['misincol_admin_teams']` podía retener copias de las pruebas anteriores (`pastos01`, `bari01`), impidiendo ver la lista limpia sin un refresco de caché.

---

## 2. Plan de Sincronización y Erradicación de Duplicados

### A. Sincronización de Semillas Locales (`initialTeams/index.ts`)
- Configurar `INITIAL_NATIONAL_TEAMS` para incluir los 6 equipos territoriales oficiales:
  - `pastosTeam`, `wayuuTeam`, `nasaTeam`, `emberaTeam`, `arhuacoTeam`, `nukakTeam`.
- Paridad 1:1 total entre la base local inicial y la base de datos global.

### B. Desduplicación y Purga en `AdminDashboardService`
- En `loadInitialTeams()` y `syncFromBackend()`:
  - Aplicar desduplicación estricta por `id` / `slug`.
  - Si existen registros con identificadores duplicados o de prueba huérfanos que colisionan con los 6 equipos canónicos, fusionar o priorizar la entidad canónica.
  - Al completar `syncFromBackend()`, persistir en `localStorage` la lista limpia de 6 misiones.

### C. Cumplimiento de Gobernanza Técnica
- Límite estricto $\le 150$ líneas por archivo modificado.
- Tipado estricto TypeScript sin `any`.
- Ejecución de pruebas unitarias (`vitest run`) y compilación (`vite build`).

---

## 3. Estado de Ejecución y Pruebas
- [x] Análisis técnico completado.
- [x] Semillas iniciales actualizadas en `initialTeams/index.ts` con los 6 equipos oficiales.
- [x] Módulo especializado de desduplicación creado en `admin-teams-deduplication.helper.ts` (87 líneas).
- [x] `AdminDashboardService` refactorizado y desacoplado (123 líneas).
- [x] Pruebas unitarias de desduplicación creadas en `admin-teams-deduplication.helper.spec.ts` (4 pruebas).
- [x] Ejecución total de Vitest: 23 suites y 85 pruebas aprobadas (85/85).
- [x] Compilación de producción (`vite build`) completada con éxito en 12.75s.
