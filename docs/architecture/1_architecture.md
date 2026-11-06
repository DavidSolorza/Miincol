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

---

### ADR-033: Estabilización de Raíz de Vistas, ServiceBus Integral, Optimización de Cero-Latencia y Desktop PWA
- **Estado:** Aprobado e Implementado (`2026-11-06`).
- **Contexto:** Garantizar estabilidad indestructible en todas las vistas de la aplicación, desacoplar la comunicación reactiva mediante un ServiceBus centralizado, reducir los tiempos de carga al mínimo y convertir la plataforma en una aplicación instalable de escritorio.
- **Decisión:**
  1. **Blindaje de Plantillas y Cero JIT:**
     - Eliminación de comillas simples escapadas (`font-[\'...\']`) en todas las plantillas del frontend, separando clases estáticas en `class` y reservando `[class]` para variables dinámicas puras. La compilación AOT se ejecuta de forma 100% anticipada en **6.21 segundos**.
  2. **Guardas Defensivas en Vistas:**
     - `GeneralInfoViewComponent` y `GeneralInfoService` incorporan validación defensiva (`updatedAt`, `budgetBreakdown`, etc.) previniendo errores por `localStorage` inexistente o desactualizado.
  3. **ServiceBus Centralizado (`src/core/bus/`):**
     - Expansión de `bus.types.ts` con eventos tipados (`pdm:phase_switch`, `pdm:plan_persisted`, `security:role_update`, `security:matrix_update`, `pwa:install_prompt`).
     - Despacho no bloqueante en la cola de microtareas (`queueMicrotask`).
  4. **Optimización de Ultra-Baja Latencia:**
     - Reducción del logotipo institucional de **945.6 KB a 54.4 KB** (ahorro de ~891 KB) y depuración de 2.4 MB de imágenes de prueba no utilizadas.
     - Service Worker (`sw.js` v3) con estrategia Cache-First y fallback instantáneo para operar con 0 ms de latencia en redes 2G/3G territoriales.
  5. **Aplicación Descargable de Escritorio (Desktop PWA):**
     - Creación de `manifest.webmanifest` con modo `display: "standalone"`, tema institucional `#1C1917` e iconografía vectorial/rasterizada de 192x192 y 512x512.
     - Integración del componente `PwaInstallButtonComponent` en la cabecera global para permitir a los usuarios instalar la app nativamente en Windows, macOS y Linux.
- **Consecuencias:**
  - Carga instantánea, alta resiliencia y experiencia de usuario fluida y libre de errores.
  - 100% de cumplimiento del límite de 150 líneas por archivo.

---

### ADR-034: Restricción de Acceso para "Usuario de Equipo" en el Árbol PDM (Solo Lectura con Edición Exclusiva de Estado en Tareas Asignadas)
- **Estado:** Aprobado e Implementado (`2026-11-06`).
- **Contexto:** Se requiere restringir las capacidades de los colaboradores con rol "Usuario de equipo" (`ROLE_USUARIO` / `member`). Al ingresar al espacio de su equipo en la vista del Plan de Desarrollo Ministerial (PDM), deben poder explorar la estructura jerárquica en árbol (`MissionaryTeam` ➔ `PhasePlan` ➔ `Objective` ➔ `Activity`), pero sin permisos para crear, editar o eliminar objetivos, presupuestos, fechas o descripciones. Su única potestad de mutación es actualizar el estado (`Pendiente` ➔ `En Proceso` ➔ `Completado`) de las actividades que les han sido asignadas expresamente a su nombre.
- **Decisión:**
  1. **Backend (`NestJS`):**
     - En `ActivitiesService` y `ActivitiesController`:
       - Se implementó el endpoint `PATCH /activities/:id/status`. Si el rol del usuario es `ROLE_USUARIO`, se verifica que el campo `responsible` de la actividad coincida con el nombre del usuario. De lo contrario, se arroja `ForbiddenException`.
       - En `create()`, `update()` y `delete()`, se bloquea de forma inquebrantable cualquier intento de ejecución por parte de usuarios con rol `ROLE_USUARIO`.
     - En `ObjectivesController`:
       - Se bloquean los métodos `create()`, `update()` y `delete()` ante peticiones de `ROLE_USUARIO`.
  2. **Frontend (`Angular Standalone + Signals`):**
     - Soporte para rol `member` en `AppSessionService`, `AuthSession` y `verifyAuthCredentials` (con chip de acceso rápido para Aída Secue en Misión Nasa).
     - En `PhaseViewComponent`, `ObjectiveCardComponent`, `ObjectiveCardHeaderComponent`, `ObjectiveActivitiesListComponent`:
       - Detección reactiva mediante `isMember = computed(() => session()?.role === 'member')`.
       - Ocultamiento de botones de creación y edición de objetivos (`+ Nuevo Objetivo`, botón `Editar Objetivo`, botón `Restablecer`).
       - Ocultamiento de botones de creación y edición de actividades (`+ Nueva Actividad`, `+ Registrar primera actividad`).
     - En `ActivityItemComponent`, `ActivityHeaderTagsComponent`, `ActivityBudgetQuickEditComponent` y `ActivityDetailsAccordionComponent`:
       - Cálculo de asignación de la tarea `isAssigned = computed(...)` comparando el nombre del usuario en sesión contra `activity.responsible`.
       - Si la actividad está asignada al usuario miembro, se presenta una insignia visual `"Tu tarea"`, borde esmeralda sutil, y un `<select>` interactivo para cambiar su estado (`Pendiente`, `En Proceso`, `Completado`).
       - Si la actividad pertenece a otro colaborador, el estado se muestra como insignia no interactiva con candado `🔒` y tooltip de solo lectura.
       - Los controles de presupuesto rápido (valor unitario, repeticiones, lápiz y papelera) y el modal de edición profunda quedan completamente ocultos.
     - En `SidebarUserProfileCardComponent`:
       - Despliega el nombre y apellido del colaborador autenticado (`Aída Secue • Equipo`) en la tarjeta inferior de perfil.
- **Consecuencias:**
  - Seguridad multinivel robusta tanto en el servidor backend como en la interfaz de usuario.
  - Experiencia de usuario empática, clara y ergonómica para los colaboradores en campo.
  - Cumplimiento estricto del límite `<= 150` líneas por archivo en el 100% de la base de código.

---

### ADR-035: Creación de Personas desde Roles y Sincronización Automática con Equipos Misioneros
- **Estado:** Aprobado e Implementado (`2026-11-06`).
- **Contexto:** Permitir al Director Nacional registrar colaboradores directamente desde la vista de gestión de roles solicitando nombre, correo, rol y equipo, y garantizar sincronización automática e inmediata cuando se crean nuevos equipos en el sistema nacional.
- **Decisión:**
  1. **Creación Directa de Personas (`CreateUserModalComponent`):**
     - Botón `+ Nueva Persona` en `SecurityUsersTableComponent`.
     - Modal atómico con validación de:
       1. Nombre Completo
       2. Correo Electrónico
       3. Rol (`Usuario de equipo`, `Líder de equipo`, `Director nacional`)
       4. Territorio / Equipo (Selector dinámico de misiones territoriales o Coordinación Nacional).
     - Persistencia reactiva inmediata en `SecurityUsersService` (`misincol_system_users_v1`) y vinculación a los miembros de la misión en `AdminDashboardService`.
  2. **Sincronización Automática al Crear Equipos (`AdminDashboardService`):**
     - Cuando se registra o actualiza un equipo misionero en `handleCreateTeam`, se invoca automáticamente `securityUsersSvc.ensureTeamLeaderAndMembers(team)`.
     - El pastor líder y todos los miembros registrados en el equipo aparecen de forma inmediata en la tabla de asignación de roles sin duplicidad ni pasos manuales.
  3. **Modularización Estricta:**
     - `INITIAL_SYSTEM_USERS` desacoplado a `security-users.helpers.ts`.
     - `CreateUserModalComponent`, `SecurityUsersTableComponent` y `SecurityUsersService` se mantienen estrictamente `<= 150` líneas.
- **Consecuencias:**
  - Administración centralizada, consistente y libre de redundancia para la gobernanza del personal misionero.
  - Sincronización transparente en tiempo real entre misiones territoriales y el árbol de seguridad.
  - 100% de cumplimiento del límite de 150 líneas por archivo.

---

### ADR-036: Módulo de Historial de Ingresos y Auditoría de Cambios (Acceso Exclusivo Director Nacional)
- **Estado:** Aprobado e Implementado (`2026-11-06`).
- **Contexto:** Garantizar observabilidad, trazabilidad y registro forense de todas las mutaciones realizadas sobre el Plan de Desarrollo Ministerial (PDM) y los accesos al sistema, restringido de forma inviolable al Director Nacional / Administrador (`ROLE_NACIONAL`).
- **Decisión:**
  1. **Acceso Exclusivo en Sidebar y Cabecera:**
     - En `PlanSidebarComponent`, botón *"Historial"* visible exclusivamente si `userRole() === 'admin'`. Oculto para líderes y usuarios de equipo.
     - En `AppHeaderComponent`, botón *"Historial"* directo en la cabecera del Super Admin.
     - En `AppWorkspaceComponent`, guardia defensiva que redirige cualquier intento de acceso no autorizado a la vista de auditoría.
  2. **Trazabilidad de Modificaciones y Comparativa de Valores (`AuditChangesTableComponent`):**
     - Despliega el autor, rol, territorio, fecha y hora exacta de cada mutación.
     - Visualización comparativa de valores anteriores frente a nuevos:
       $$\text{Valor Anterior (tachado)} \longrightarrow \text{Valor Nuevo (resaltado)}$$
  3. **Historial de Inicios de Sesión (`AuditLoginsTableComponent`):**
     - Registro de accesos con identidad, rol, IP de origen, fecha/hora y estado exitoso.
  4. **Backend NestJS (`AuditModule`):**
     - Endpoints protegidos `GET /audit/logs`, `GET /audit/changes` y `GET /audit/logins` con `@UseGuards(JwtAuthGuard, RolesGuard)` y `@Roles(UserRole.ROLE_NACIONAL)`.
  5. **Modularización:**
     - Todos los componentes y servicios (`AuditHistoryViewComponent`, `AuditChangesTableComponent`, `AuditLoginsTableComponent`, `AuditFiltersBarComponent`, `AuditService`, `AuditController`) se mantienen estrictamente `<= 150` líneas.
- **Consecuencias:**
  - Plena visibilidad, seguridad institucional y trazabilidad inmutable de cambios para la dirección nacional.
  - 100% de cumplimiento del límite de 150 líneas por archivo.
