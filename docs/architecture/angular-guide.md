# 🅰️ Guía Técnica y Manual de Desarrollo en Angular (MISINCOL PDM)
**Proyecto:** MISINCOL | Plan de Desarrollo Ministerial (PDM)  
**Framework:** Angular 21+ (Standalone Components, Signals, OnPush) + Vite + Tailwind CSS v4  
**Contrato de Gobernanza:** v2026.4.0 (`< 150` líneas por archivo, Vertical Slicing, Cero SDKs Comerciales)

---

## 1. Filosofía de Arquitectura en Angular

La aplicación **MISINCOL PDM** está construida siguiendo las prácticas más modernas de Angular:
1. **100% Standalone Components:** No existen `NgModule`s. Cada componente declara explícitamente sus dependencias en el arreglo `imports: [...]`.
2. **Reactividad Basada en Signals (`signal`, `computed`, `effect`):** El estado local y global fluye a través de Signals síncronos y predecibles, eliminando suscripciones manuales innecesarias y garantizando actualizaciones quirúrgicas del DOM.
3. **`ChangeDetectionStrategy.OnPush` Universal:** Todos los componentes operan en modo `OnPush`, actualizándose únicamente cuando cambian sus `input()` signals, se disparan eventos de plantilla o mutan los signals leídos en el template.
4. **Control Flow Nativo (`@if`, `@for`, `@let`):** Uso de la sintaxis integrada de plantillas de Angular en lugar de directivas estructurales legadas (`*ngIf`, `*ngFor`).

---

## 2. Mapa Completo de Servicios y Estado Reactivo

| Servicio / Helper | Ubicación | Responsabilidad Principal | Clave `localStorage` |
| :--- | :--- | :--- | :--- |
| **`AppSessionService`** | `src/app/auth/app-session.service.ts` | Gestiona la sesión activa (`admin` o `team`), el equipo seleccionado (`activeTeamId`), el modo vista previa (`isAdminPreview`) y la vista activa (`plans` o `superadmin`). Escucha eventos del `serviceBus`. | `misincol_pdm_auth_session` |
| **`AdminDashboardService`** | `src/features/admin/application/admin-dashboard.service.ts` | CRUD de equipos misioneros, sincronización de métricas reales desde los planes PDM guardados, filtros multicriterio (búsqueda, fase, salud, departamento) y cálculo de KPIs nacionales. | `misincol_custom_teams_v1` |
| **`PlanService`** | `src/features/plans/application/plan.service.ts` | Gestiona los 5 pilares del PDM (`investigacion`, `encarnacion`, `evangelizacion`, `entrenamiento`, `autocuidado`) para el equipo activo, CRUD de objetivos (máx. 4) y actividades, y recálculo automático de presupuestos y semanas. | `misincol_pdm_plans_${teamId}` |
| **`ToastService`** | `src/shared/components/toast/toast.service.ts` | Sistema nativo de notificaciones (`success`, `error`, `warning`, `info`) y diálogos modales de confirmación (`confirmAction`) conectado al `serviceBus`. | *(En memoria)* |
| **`NetworkBusService`** | `src/core/bus/network-bus.service.ts` | Monitorea el estado de red (`online`/`offline`), latencia y cantidad de operaciones pendientes en la cola offline. | *(Eventos navegador)* |

---

## 3. Catálogo de Componentes por Rebanada Vertical (`src/features/`)

### 3.1. Shell de Aplicación (`src/app/`)
- [`AppComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/app/app.component.ts) (`<app-root>`): Punto de entrada visual; alterna entre `LoginViewComponent` y `AppWorkspaceComponent`, e incluye `ToastContainerComponent`.
- [`AppWorkspaceComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/app/ui/app-workspace.component.ts) (`<app-workspace>`): Orquesta el layout principal con sidebar retráctil, cabecera, contenido principal y modales globales.
- [`AppHeaderSectionComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/app/ui/app-header-section.component.ts) & [`AppHeaderComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/app/ui/app-header.component.ts): Barra superior ejecutiva con estado de red, selector rápido de equipo, acciones de Super Admin y perfil de usuario.
- [`AdminPreviewBannerComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/app/ui/admin-preview-banner.component.ts): Cinta superior ámbar cuando el Coordinador de Equipos inspecciona el PDM de un equipo específico.

### 3.2. Autenticación y Selección de Equipos (`src/features/auth/`)
- [`LoginViewComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/auth/infrastructure/login-view.component.ts): Portal de acceso Split-Card Hero con pestañas de rol (`Equipo Territorial` / `Super Admin`), validación de credenciales y chips de acceso rápido en 1 clic.
- Subcomponentes en `infrastructure/login/`: `LoginHeroCardComponent`, `LoginCardHeaderComponent`, `LoginRoleTabsComponent`, `LoginFormFieldsComponent`, `PasswordInputFieldComponent`, `LoginQuickAccessChipsComponent`, `LoginSupportFooterComponent`.
- Selector de equipos: [`TeamSelectorComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/auth/infrastructure/team-selector.component.ts) y [`TeamSelectDropdownComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/auth/infrastructure/team-select-dropdown.component.ts).

### 3.3. Supervisión Nacional y Cartografía (`src/features/admin/`)
- [`SuperAdminViewComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/admin/infrastructure/super-admin-view.component.ts): Tablero ejecutivo Split-Screen (50% listado de misiones y KPIs / 50% mapa interactivo de Colombia).
- Cartografía interactiva en `infrastructure/map/`:
  - [`ColombiaMapCardComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/admin/infrastructure/map/colombia-map-card.component.ts): Contenedor con filtros de región biogeográfica (`Caribe`, `Pacífico`, `Andina`, `Orinoquía`, `Amazonía`), leyenda e insignia de departamento activo.
  - [`ColombiaMapSvgComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/admin/infrastructure/map/colombia-map-svg.component.ts): Renderiza los 33 departamentos de Colombia con sombreado dinámico según presencia misionera y marcadores interactivos por equipo.
- Gestión de equipos: [`TeamOverviewCardComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/admin/infrastructure/team-overview-card.component.ts) y [`TeamModalComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/admin/infrastructure/team-modal.component.ts).

### 3.4. Plan de Desarrollo Ministerial (`src/features/plans/`)
- [`PlanSidebarComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/plans/infrastructure/plan-sidebar.component.ts): Navegación lateral por los 5 pilares del PDM, avance porcentual, presupuesto consolidado, avisos de supervisión y acceso a Notas e Informe PDF.
- [`PhaseViewComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/plans/infrastructure/phase-view.component.ts): Vista de 3 niveles:
  1. **Fila Superior:** Rejilla a ancho completo de Objetivos Estratégicos (`PhaseObjectiveCardsGridComponent`).
  2. **Fila Intermedia:** Cabecera del Objetivo Activo (`ObjectiveCardHeaderComponent`) y barra de filtros por estado/búsqueda (`ObjectiveFilterBarComponent`).
  3. **Fila Inferior:** Lista de actividades (`ObjectiveActivitiesListComponent` y `ActivityItemComponent`) con edición rápida de presupuesto, cambio de estado y acordeón de diagnóstico/metas.
- Modales CRUD: [`ActivityModalComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/plans/infrastructure/activity-modal.component.ts) y [`ObjectiveModalComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/plans/infrastructure/objective-modal.component.ts).

### 3.5. Notas, Auditoría e Informes (`src/features/notes/`, `audit/`, `reports/`)
- [`TeamNotesModalComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/notes/infrastructure/team-notes-modal.component.ts): Agenda territorial categorizada (`idea`, `actividad`, `oracion`, `urgente`, `general`) con fijación (`pin`) y búsqueda en tiempo real.
- [`TeamAuditModalComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/audit/infrastructure/team-audit-modal.component.ts) & [`TeamCardTelemetryComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/audit/infrastructure/team-card-telemetry.component.ts): Bitácora cronológica de accesos y modificaciones por equipo.
- [`ReportModalComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/src/features/reports/infrastructure/report-modal.component.ts): Informe Ejecutivo Oficial listo para impresión o exportación a PDF (`window.print()`).

---

## 4. Reglas para Agregar Nuevas Funcionalidades

1. **Respetar el Límite de 150 Líneas:** Ningún archivo `.ts` puede superar las 150 líneas (incluyendo `import`s y líneas en blanco). Si un componente crece, extrae subcomponentes atómicos en una subcarpeta dedicada.
2. **Usar `AppIconComponent` para Iconos:**
   ```html
   <app-icon name="compass" className="w-4 h-4 text-[#8B251E]" />
   ```
   Si necesitas un nuevo ícono SVG, regístralo en `src/shared/components/icon/icon.types.ts` y agrega su trazo en `icon-paths-b.ts`.
3. **Publicar Eventos de Auditoría y UI en el `serviceBus`:**
   ```ts
   serviceBus.publish('ui:toast', { message: 'Operación exitosa', type: 'success' });
   ```

