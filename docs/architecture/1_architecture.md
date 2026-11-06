# 🏛️ Documento de Arquitectura de Software (ADR & Diseño de Sistema)
**Proyecto:** Plan Ministerial Misincol (Misiones Indígenas en Colombia) - Sistema PDM y Gestión Territorial Dinámica  
**Versión:** 3.0.0 (Angular Standalone + Signals Edition)  
**Autor:** Agente 2 (Staff Software Architect) & Agente 1 (VP of Engineering)  
**Estado:** Aprobado e Implementado

---

## 1. Resumen Ejecutivo
El sistema **Plan Ministerial Misincol** opera sobre una arquitectura **Angular 21+ (Standalone Components + Signals + OnPush)** combinada con **Vertical Slicing (`src/features/`)** y **Tailwind CSS v4** bajo el Contrato de Gobernanza Técnica v2026.4.0 (`< 150` líneas por archivo).

Bajo este modelo, todas las vistas y capacidades del sistema están desacopladas en servicios reactivos inyectables basados en `signal()` / `computed()` y componentes atómicos Standalone:
1. **Creación y Edición Dinámica de Misiones/Equipos**: Asignación de etnia, territorio, pastor líder, contacto directo por WhatsApp, presupuesto por fase, estado de salud operativa y paleta de color identitaria (`themeColor`).
2. **Espacio Territorial Aislado (Team Space)**: Cada equipo cuenta con su propio Plan de Desarrollo Ministerial (PDM) independiente, cálculos automatizados, micro-mapa departamental con zoom vectorial de precisión y cronogramas adaptativos.
3. **Modo Vista Previa Administrador (Admin Preview Mode)**: El director nacional puede inspeccionar e interactuar con el espacio operativo de cualquier equipo en terreno con un banner de retorno instantáneo al tablero central.

---

## 2. Diagrama de Componentes e Interacción (Mermaid - Angular Edition)

```mermaid
graph TD
    subgraph Client ["Cliente SPA (Angular Standalone + Signals + Vite + TypeScript)"]
        subgraph AppShell ["Shell Global: src/app/"]
            AppComp["AppComponent (<app-root>)"]
            SessionSvc["AppSessionService (@Injectable Signal State)"]
            WorkspaceUI["AppWorkspaceComponent"]
            HeaderUI["AppHeaderSectionComponent & AppHeaderComponent"]
            PreviewBanner["AdminPreviewBannerComponent"]
        end

        subgraph CoreAndShared ["Núcleo y UI Compartida: src/core/ & src/shared/"]
            ServiceBus["ServiceBusCore & NetworkBusService"]
            NativeHttp["NativeFetchClient (src/core/http/httpClient.ts)"]
            ToastSys["ToastService & ToastContainerComponent"]
            IconSys["AppIconComponent (SVG Nativo Sin Dependencias)"]
            Formatters["Formateadores (Moneda COP, Fechas, Semanas)"]
        end

        subgraph AdminSlice ["Módulo: src/features/admin/ (Vertical Slice)"]
            AdminDashUI["SuperAdminViewComponent (Split-Screen Nacional)"]
            MapUI["ColombiaMapCardComponent & ColombiaMapSvgComponent"]
            TeamModalUI["TeamModalComponent (Crear/Editar Misión)"]
            TeamCardUI["TeamOverviewCardComponent (Acciones Rápidas & Fase)"]
            AdminSvc["AdminDashboardService (@Injectable CRUD & KPIs)"]
            TeamDomain["admin.types.ts"]
        end

        subgraph PlansSlice ["Módulo: src/features/plans/ (Vertical Slice)"]
            PhaseUI["PhaseViewComponent & ObjectiveCardComponent"]
            ZoomMapUI["TeamDepartmentZoomCardComponent (Zoom SVG Departamental)"]
            SidebarUI["PlanSidebarComponent (5 Pilares PDM)"]
            PlanSvc["PlanService (@Injectable Signal State por TeamId)"]
            PlanDomain["plan.types.ts"]
        end

        subgraph NotesSlice ["Módulo: src/features/notes/ (Vertical Slice)"]
            NotesModalUI["TeamNotesModalComponent (Agenda Territorial)"]
            NotesDomain["notes.types.ts"]
        end

        subgraph AuditSlice ["Módulo: src/features/audit/ (Vertical Slice)"]
            AuditUI["TeamCardTelemetryComponent & TeamAuditModalComponent"]
            AuditStorage["auditStorage.ts (Bitácora Local & Eventos)"]
            AuditDomain["audit.types.ts"]
        end

        subgraph ReportsSlice ["Módulo: src/features/reports/ (Vertical Slice)"]
            ReportModalUI["ReportModalComponent (Informe Oficial PDF)"]
            ReportHelper["buildReportData (report-data.helper.ts)"]
        end

        subgraph AuthSlice ["Módulo: src/features/auth/ (Vertical Slice)"]
            LoginUI["LoginViewComponent (Split-Card Editorial)"]
            TeamSelectorUI["TeamSelectorComponent & TeamSelectDropdownComponent"]
            AuthDomain["auth.types.ts"]
        end
    end

    AppComp --> SessionSvc
    AppComp --> LoginUI
    AppComp --> WorkspaceUI
    AppComp --> ToastSys

    WorkspaceUI --> SidebarUI
    WorkspaceUI --> HeaderUI
    WorkspaceUI --> AdminDashUI
    WorkspaceUI --> PhaseUI
    WorkspaceUI --> ReportModalUI
    WorkspaceUI --> NotesModalUI

    AdminDashUI --> MapUI
    AdminDashUI --> TeamModalUI
    AdminDashUI --> TeamCardUI
    AdminDashUI --> AdminSvc
    AdminSvc --> TeamDomain

    TeamCardUI --> AuditUI
    AuditUI --> AuditStorage
    AuditStorage --> ServiceBus

    PhaseUI --> ZoomMapUI
    PhaseUI --> PlanSvc
    PlanSvc --> PlanDomain
```

---

## 3. Principios SOLID y Subcapas por Vertical Slicing (`src/features/`)

### 3.1. Estructura de Subcapas
- **`domain/`**: Entidades inmutables y contratos de tipos (`TeamSupervisionSummary`, `MissionaryTeam`, `PhasePlan`, `Activity`, `TeamNote`, `AuditLogEntry`). 100% libres de dependencias de framework. *(SRP & DIP)*.
- **`application/`**: Servicios inyectables Angular (`AdminDashboardService`, `PlanService`) y funciones puras de negocio (`planCalculations.ts`, `planActivityActions.ts`, `planObjectiveActions.ts`, `adminKpiCalculations.ts`, `verifyAuthCredentials.ts`). Gestionan el estado derivado mediante `signal()` y `computed()`. *(OCP)*.
- **`infrastructure/`**: Componentes visuales Angular Standalone (`ChangeDetectionStrategy.OnPush`) con `input()`, `output()`, y plantillas declarativas (`@if`, `@for`, `@let`). Ningún archivo supera las **150 líneas**.

---

## 4. Registro de Decisiones de Arquitectura (ADR)

### ADR-005 a ADR-027: Evolución Funcional, Cartográfica y Visual
- **ADR-005:** Aprovisionamiento y ciclo de vida dinámico de equipos misioneros con selector de color identitario (`themeColor`) y enlace directo a WhatsApp.
- **ADR-006:** Espacios PDM aislados por `teamId` (`misincol_pdm_plans_[teamId]`) con inicialización adaptativa por etnia (Wayuu, Pastos, Nasa, Emberá, Arhuaco, Huitoto, Koreguaje).
- **ADR-007:** Modo Vista Previa del Administrador (`isAdminPreview`) con banner de retorno instantáneo.
- **ADR-008:** Gestión dinámica de Objetivos Estratégicos con cota máxima de 4 objetivos por fase (`1..4`).
- **ADR-009:** Portal de Acceso Split-Card Hero con matriz interactiva de acceso rápido en 1 clic (`LoginViewComponent`).
- **ADR-010:** Bus de Servicios (`ServiceBusCore`) asíncrono con `queueMicrotask`, Service Worker offline (`public/sw.js`) y aceleración por GPU.
- **ADR-011:** Módulo desacoplado de Notas y Agenda Territorial (`misincol_team_notes_[teamId]`).
- **ADR-012:** Sistema de Telemetría y Monitoreo de Auditoría Territorial (`TeamCardTelemetryComponent` y `TeamAuditModalComponent`).
- **ADR-013:** Tablero Nacional Cartográfico Split-Screen con mapa interactivo de los 33 departamentos de Colombia (`ColombiaMapCardComponent`).
- **ADR-014:** Edición integral de actividades / sub-objetivos mediante modal jerárquico multicampo (`ActivityModalComponent`).
- **ADR-015 a ADR-025:** Layout jerárquico de 3 niveles en `PhaseViewComponent`, rejilla 2x2 de objetivos y micro-mapa departamental con zoom vectorial (`TeamDepartmentZoomCardComponent`), retícula geodésica, departamentos vecinos y micro-pinpoint de alta precisión.
- **ADR-026 y ADR-027:** Jerarquía cromática equilibrada y proporciones esbeltas en `PlanSidebarComponent`.

---

### ADR-028: Arquitectura Integral en Angular Standalone + Signals
- **Estado:** Aprobado e Implementado (`2026-10-29`).
- **Contexto:** Consolidar la totalidad del proyecto en **Angular 21+**, manteniendo una documentación técnica ejemplar y cumpliendo de forma estricta con el Contrato de Gobernanza Técnica v2026.4.0 (límite de `< 150` líneas por archivo, Vertical Slicing en `src/features/` y cero SDKs comerciales opacos).
- **Decisión:**
  1. **Adopción de Angular Standalone Components + Signals (`@angular/core ^21.2.0`):**
     - Todos los componentes operan como `@Component({ standalone: true, changeDetection: ChangeDetectionStrategy.OnPush })`.
     - Uso exclusivo de la API moderna de señales de Angular (`signal`, `computed`, `effect`, `input`, `output`) y el flujo de control nativo en plantillas (`@if`, `@for`, `@let`).
  2. **Servicios Inyectables (`@Injectable({ providedIn: 'root' })`):**
     - `AppSessionService` (`src/app/auth/app-session.service.ts`).
     - `AdminDashboardService` (`src/features/admin/application/admin-dashboard.service.ts`).
     - `PlanService` (`src/features/plans/application/plan.service.ts`).
     - `NetworkBusService` (`src/core/bus/network-bus.service.ts`).
     - `ToastService` (`src/shared/components/toast/toast.service.ts`).
  3. **Sistema de Iconografía Vectorial Nativo (`AppIconComponent`):**
     - Construcción de `AppIconComponent` (`<app-icon name="..." className="..." />`) dividido en catálogos modulares (`icon-paths-a.ts` e `icon-paths-b.ts`, cada uno `< 150` líneas) con todos los trazos SVG vectoriales utilizados en la plataforma, sin librerías externas.
  4. **Dominio y Cartografía Vectorial:**
     - Integración directa de los modelos de dominio, calculadoras financieras, semillas de datos (`initialTeams`, `defaultPhases`, `pastosPhases`) y vectores cartográficos de los 33 departamentos de Colombia (`colombiaDepartments.json`, `departmentBounds.constants.ts`).
- **Consecuencias:**
  - Compilación Ahead-of-Time (AOT) con verificación estricta de plantillas (`strictTemplates: true`).
  - Detección de cambios granular y ultra-rápida mediante Angular Signals + `OnPush`.
  - Cumplimiento del 100% del límite de `< 150` líneas por archivo en todos los archivos `.ts` del repositorio.

---

### ADR-029: Reglas Ministeriales Territoriales (5 Pilares, Límite de 4 Objetivos y Roles)
- **Estado:** Aprobado e Implementado (`2026-11-05`).
- **Contexto:** Definir con total precisión metodológica los pilares oficiales de MISINCOL, la cota máxima de objetivos por fase y los privilegios de mutación de integrantes entre coordinadores y líderes en campo.
- **Decisión:**
  1. **Los 5 Pilares Fundamentales:** Se remueve la categoría `General` (Ejes Transversales), consolidando la metodología en: `Investigación`, `Encarnación`, `Evangelización`, `Entrenamiento` y `Autocuidado`.
  2. **Cota Máxima de 4 Objetivos Estratégicos:**
     - En el frontend, `PhaseObjectiveCardsGridComponent` bloquea la creación al alcanzar 4 objetivos, sustituyendo el botón punteado por la tarjeta de estado `4/4 Límite Máximo Alcanzado`.
     - En el backend, `ObjectivesService.create()` rechaza cualquier intento de superar 4 objetivos lanzando `BadRequestException`.
  3. **Privilegios de Integrantes:** Solo usuarios con rol `admin` pueden agregar o remover integrantes en `GeneralTeamCardComponent`. Los líderes territoriales solo cuentan con el botón `Asignar Tarea`.

---

### ADR-030: Reorganización del Sidebar y Retorno a Supervisión Nacional
- **Estado:** Aprobado e Implementado (`2026-11-05`).
- **Contexto:** Optimizar la ergonomía de navegación cuando un coordinador inspecciona el PDM de una misión territorial.
- **Decisión:**
  1. **Retorno Superior en Sidebar:** Se añade el botón `← Volver a Supervisión Nacional` en la cabecera superior del sidebar en modo `isAdminPreview`.
  2. **Desactivación de Logout Accidental:** En modo supervisión, se oculta el botón de cierre de sesión en el perfil inferior del sidebar, sustituyéndolo por la etiqueta informativa `Supervisión`.
  3. **Persistencia de Accesos en Información General:** Se garantiza que los accesos a `Notas y Agenda`, `Informe PDM` y `Contacto Líder` se mantengan visibles tanto en las fases del PDM como en la vista macro de `Información General`.

---

### ADR-031: Gestor de Roles, Seguridad y Matriz Interactiva de Permisos
- **Estado:** Aprobado e Implementado (`2026-11-06`).
- **Contexto:** Proveer una gobernanza centralizada de privilegios del sistema con matriz interactiva de doble entrada y restringir el acceso a historiales de ingreso y telemetría sensible exclusivamente a directores/administradores nacionales.
- **Decisión:**
  1. **Módulo Frontend `src/features/security/`:**
     - `SecurityRolesViewComponent`: Vista de administración de roles y permisos con diseño coherente en tarjeta y paleta institucional.
     - `SecurityMatrixTableComponent`: Tabla de doble entrada que cruza los 3 roles oficiales (`Usuario equipo`, `Líder equipo`, `Director nacional`) con las 10 capacidades del sistema agrupadas en 4 categorías (`Gestión de Equipos`, `Plan de Desarrollo (PDM)`, `Auditoría y Telemetría`, `Gobernanza y Sistema`).
     - `SecurityMatrixService`: Servicio reactivo con señales Angular (`signal`), cálculo de conteos activos y persistencia local (`misincol_security_matrix_v1`).
  2. **Restricción Estricta de Historiales de Ingreso:**
     - En `TeamAuditModalComponent`, la pestaña "Ingresos" y los eventos de telemetría de login quedan restringidos al rol `admin` (`@Input() isAdmin = true`).
     - Si el usuario no es administrador, no puede ver las horas, IPs ni accesos de los integrantes.
  3. **Backend `SecurityModule`:**
     - `SecurityController` con endpoints protegidos `GET /security/matrix` y `PUT /security/matrix` requiriendo rol `ROLE_NACIONAL`.
     - Incorporación de `ROLE_USUARIO = 'ROLE_USUARIO'` en `UserRole`.
- **Consecuencias:**
  - Control granular de permisos auditable y adaptable.
  - Protección de privacidad y seguridad en telemetría de accesos territoriales.
  - 100% de cumplimiento del límite de 150 líneas por archivo.

---

### ADR-032: Asignación Directa de Roles por Persona y Renombrado de Retorno al Dashboard
- **Estado:** Aprobado e Implementado (`2026-11-06`).
- **Contexto:** Permitir a los directores nacionales reasignar el rol de cualquier colaborador directamente desde el Gestor de Roles y simplificar el botón de retorno superior ("Volver al Dashboard").
- **Decisión:**
  1. **Asignación de Roles por Persona (`SecurityUsersTableComponent`):**
     - Se integró un selector de pestañas en `SecurityRolesHeaderComponent` para alternar entre "Matriz de Permisos" y "Roles de Personas".
     - `SecurityUsersTableComponent` despliega a los colaboradores con su territorio, correo institucional, rol actual y un selector interactivo para reasignar su rol (`Usuario equipo`, `Líder equipo`, `Director nacional`).
     - `SecurityUsersService` gestiona el estado reactivo con Angular Signals, persistencia en `misincol_system_users_v1` y notificaciones vía `ToastService`.
  2. **Renombrado del Botón en la Cabecera (`AppHeaderComponent`):**
     - Se sustituyó la etiqueta `"Super Admin"` por `"Volver al Dashboard"`, acompañada del icono `arrow-left`, facilitando una navegación intuitiva y natural de regreso al mapa y tablero nacional.
  3. **Backend (`UsersController`):**
     - Endpoint `PATCH /users/:id/role` protegido por `@Roles(UserRole.ROLE_NACIONAL)` y validado con `UpdateUserRoleDto`.
- **Consecuencias:**
  - Administración ágil y transparente de las identidades y privilegios del personal misionero.
  - Mayor ergonomía de navegación para la dirección nacional.
  - Cumplimiento del 100% de la cota de 150 líneas por archivo.
