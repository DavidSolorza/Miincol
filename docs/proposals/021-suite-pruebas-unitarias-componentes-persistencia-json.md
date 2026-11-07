# Propuesta Técnica: 021 - Suite Integral de Pruebas (Unitarias, Componentes y Generales) y Persistencia Limpia en JSON

**Estado:** Pendiente de Aprobación  
**Fecha:** 2026-11-07  
**Autor:** Agente 1 (Orquestador y Árbitro Técnico) & Agente 2 (Staff Software Architect)  
**Gobernanza:** Contrato de Gobernanza Técnica v2026.4.0 (Regla de Oro: <= 150 líneas por archivo)

---

## 1. Contexto y Objetivos

El usuario ha solicitado:
1. **Limpieza integral de la base de datos en JSON para el Backend:**
   - Establecer una arquitectura de persistencia JSON limpia y desacoplada en `backend/data/` para almacenar las colecciones oficiales del sistema:
     - `teams.json`: 6 misiones territoriales oficiales con sus presupuestos y pilares exactos.
     - `objectives.json`: objetivos estratégicos limpios numerados (1..4).
     - `activities.json`: actividades oficiales con metas, responsables y desglose mensual.
     - `users.json`: catálogo limpio de usuarios del sistema (director, admin, líderes y colaboradores).
     - `security-matrix.json`: matriz oficial de roles y permisos.
     - `audit.json`: bitácora limpia de trazabilidad.
   - Implementar un servicio nativo `JsonDbService` (sin dependencias externas comerciales) que lea, escriba y restablezca la base de datos a un estado puro y verificado.
2. **Limpieza integral del Frontend:**
   - Sanitización de `localStorage` (`misincol_storage_version_v2`) para purgar estados residuales, IDs duplicados o datos obsoletos.
   - Sincronización limpia con los datos oficiales de las 6 misiones territoriales.
3. **Batería Integral de Pruebas:**
   - **Pruebas Unitarias:** Fórmulas de cálculo presupuestal, consolidación de KPIs nacionales, validadores de coherencia de etapas y reglas de negocio puras.
   - **Pruebas por Componentes (Frontend):** Pruebas de componentes Standalone de Angular (`GeneralBudgetTopComponent`, `TeamCardMetricsComponent`, `ObjectiveCardComponent`, `SecurityUsersTableComponent`).
   - **Pruebas Generales e Integración (Backend):** Pruebas de integración sobre los módulos de NestJS (`TeamsController`, `ActivitiesController`, `SecurityController`, `AuditController`) validando contratos, códigos HTTP, roles (Admin, Líder, Usuario, Director General) y cuadre presupuestal.

---

## 2. Arquitectura de la Solución Propuesta

### 2.1. Persistencia JSON Limpia en Backend (`backend/data/` y `backend/src/common/db/`)
- Carpeta física `backend/data/` con archivos `.json` versionados e inicializados con las cifras exactas del Excel y PDM.
- Servicio `JsonDbService` (`< 120` líneas):
  - Métodos genéricos tipados: `readCollection<T>(name: string): T[]`, `writeCollection<T>(name: string, data: T[]): void`, `resetToCleanSeeds(): void`.
  - Conexión no bloqueante usando `fs.promises`.
  - Cero dependencias opacas.
- Adaptación de `TeamsService`, `ObjectivesService`, `ActivitiesService` y `SecurityService` para persistir en las colecciones JSON.

### 2.2. Limpieza del Frontend
- Utilidad `frontend/src/core/storage/cleanStorage.ts` (< 60 líneas):
  - Limpia claves obsoletas de `localStorage`.
  - Establece versión de datos limpia `misincol_data_clean_2026_v1`.
  - Inicializa los signals del store con las semillas oficiales cuadradas.

### 2.3. Suite de Pruebas Unitarias, por Componentes y Generales
1. **Configuración de Ejecutores de Pruebas:**
   - **Frontend:** Configuración de `vitest` / `@analogjs/vite-plugin-angular` para ejecutar pruebas unitarias y de componentes a velocidad nativa sin sobrecarga.
   - **Backend:** Configuración del script `test` con Jest / Ts-Jest (ya provisto por `@nestjs/testing` en NestJS).
2. **Pruebas Unitarias:**
   - `backend/src/teams/helpers/team-budget.calculator.spec.ts`: Cuadre matemático exacto de Pastos ($11,210,000 COP), porcentaje de ejecución y KPIs nacionales ($94,610,000 COP).
   - `backend/src/common/validators/is-stage-consistent.validator.spec.ts`: Validación de etapas autorizadas por cada uno de los 5 pilares oficiales.
   - `frontend/src/features/admin/application/adminKpiCalculations.spec.ts`: Suma de presupuestos nacionales y cálculo de salud territorial.
3. **Pruebas por Componentes (Angular Standalone):**
   - `frontend/src/features/general-info/infrastructure/components/general-budget-top.component.spec.ts`: Verificación de renderizado de tarjetas de pilares y barra de porcentaje.
   - `frontend/src/features/admin/infrastructure/teamCard/team-card-metrics.component.spec.ts`: Visualización de "Avance de Plan", chips de etapas activas y sin alerta crítica.
   - `frontend/src/features/plans/infrastructure/objective-card.component.spec.ts`: Renderizado de gastos especiales aislados del presupuesto de actividades.
4. **Pruebas Generales e Integración:**
   - `backend/test/teams-budget-integration.spec.ts`: Consulta de `GET /api/teams`, `GET /api/teams/:id/budget-summary` y `GET /api/teams/summary/kpis` verificando que los números cuadren al 100%.
   - `backend/test/security-roles-integration.spec.ts`: Validación de permisos RBAC para `director_general` (solo lectura pasiva), `ROLE_USUARIO` (solo estado de actividades propias) y `ROLE_NACIONAL` (control total).

---

## 3. Plan de Modularización y Límite de 150 Líneas

Todos los nuevos archivos de prueba y utilidades se mantendrán estrictamente `<= 150` líneas:
- `backend/src/common/db/json-db.service.ts`: ~90 líneas.
- `backend/src/common/db/clean-seeds.data.ts`: ~110 líneas.
- `backend/src/teams/helpers/team-budget.calculator.spec.ts`: ~95 líneas.
- `backend/src/common/validators/is-stage-consistent.validator.spec.ts`: ~85 líneas.
- `backend/test/teams-budget-integration.spec.ts`: ~120 líneas.
- `backend/test/security-roles-integration.spec.ts`: ~125 líneas.
- `frontend/src/core/storage/cleanStorage.ts`: ~55 líneas.
- `frontend/src/features/admin/application/adminKpiCalculations.spec.ts`: ~70 líneas.
- `frontend/src/features/general-info/infrastructure/components/general-budget-top.component.spec.ts`: ~90 líneas.
- `frontend/src/features/admin/infrastructure/teamCard/team-card-metrics.component.spec.ts`: ~85 líneas.

---

## 4. Criterios de Aceptación y Validación

1. **Base de Datos JSON Limpia:** Los archivos en `backend/data/*.json` se generan limpios, estructurados y consistentes.
2. **Frontend Limpio:** Al recargar la aplicación, el front arranca con el almacenamiento saneado y sincronizado.
3. **Ejecución de Pruebas:**
   - `npm --prefix backend run test`: Todas las pruebas unitarias e integración en verde (100% pasando).
   - `npm --prefix frontend run test`: Todas las pruebas unitarias y de componentes en verde (100% pasando).
4. **Auditoría de Líneas de Código:** Script Python confirma que el 100% de los archivos `.ts` se mantienen `<= 150` líneas.

