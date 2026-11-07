# 🏛️ Propuesta Técnica 017: Módulo de Historial de Ingresos y Auditoría de Cambios (Acceso Exclusivo Director Nacional)

**Fecha:** 2026-11-06  
**Autor:** Agente 1 (VP of Engineering) & Agente 2 (Staff Software Architect)  
**Estado:** PENDIENTE DE REVISIÓN Y FEEDBACK (Fase de Pausa)  

---

## 1. Contexto y Requerimiento del Negocio

El sistema **Misincol (Plan de Desarrollo Ministerial)** requiere implementar un módulo integral de **Historial de Ingresos y Trazabilidad de Cambios** bajo rigurosos estándares de seguridad y observabilidad:
1. **Acceso Exclusivo en Sidebar y Cabecera de Administración:**
   - Opción **"Historial"** (o "Auditoría") visible y accesible **únicamente** para el rol de Administrador / Director Nacional (`ROLE_NACIONAL` / `admin`).
   - Los líderes territoriales y usuarios de equipo no tendrán visibilidad de este botón ni acceso a la ruta o vista correspondiente.
2. **Registro de Modificaciones con Comparativa de Valores:**
   - Seguimiento cronológico de mutaciones críticas sobre el árbol PDM (actividades, objetivos, presupuestos, estados y seguridad).
   - Detalle explícito de:
     - **Usuario** que ejecutó el cambio y rol.
     - **Equipo / Misión** afectada.
     - **Fecha y Hora Exacta** (con timestamp ISO formateado en hora local).
     - **Comparativa de Valores:** Visualización clara de **Valor Anterior ➔ Valor Nuevo** (con badges de contraste y detalle del campo alterado).
3. **Historial de Inicios de Sesión (*Logins*):**
   - Registro de accesos con identidad del colaborador, rol, misión asignada, fecha/hora y método de ingreso.
4. **Respaldo en Backend (NestJS):**
   - Endpoints dedicados protegidos por `@UseGuards(JwtAuthGuard, RolesGuard)` y `@Roles(UserRole.ROLE_NACIONAL)` que bloquean cualquier intento no autorizado con HTTP `403 Forbidden`.

---

## 2. Arquitectura de la Solución

```mermaid
flowchart TD
    subgraph UI ["Frontend (Angular Standalone + Signals)"]
        Sidebar["PlanSidebarComponent (Botón 'Historial' protegido)"]
        Header["AppHeaderComponent (Acceso 'Historial' en SuperAdmin)"]
        Workspace["AppWorkspaceComponent (Guardia de Vista 'audit')"]
        AuditView["AuditHistoryViewComponent (Vista Integral)"]
        ChangesTable["AuditChangesTableComponent (Comparativa Anterior vs Nuevo)"]
        LoginsTable["AuditLoginsTableComponent (Historial de Inicios de Sesión)"]
    end

    subgraph ServiceLayer ["Capa de Servicios y Reactividad"]
        AuditSvc["AuditHistoryService (@Injectable Signal State)"]
        AuditStorage["auditStorage.ts (Persistencia & Telemetría Local)"]
        ServiceBus["ServiceBusCore (Eventos 'audit:log_appended')"]
    end

    subgraph Backend ["Backend NestJS (API REST Segura)"]
        AuditController["AuditController (@Roles(ROLE_NACIONAL))"]
        AuditService["AuditService (Bitácora & Trazabilidad de Valores)"]
        AuditModule["AuditModule (Registrado en app.module.ts)"]
    end

    Sidebar -->|Click 'Historial' (Solo Admin)| Workspace
    Header -->|Click 'Historial' (Solo Admin)| Workspace
    Workspace -->|activeView === 'audit' && isSuperAdmin()| AuditView
    
    AuditView --> ChangesTable
    AuditView --> LoginsTable
    AuditView --> AuditSvc
    AuditSvc --> AuditStorage
    AuditSvc -.->|HTTP GET /audit/logs| AuditController
    AuditController --> AuditService
```

---

## 3. Especificación Técnica por Capa

### 3.1. Frontend (`Angular 21+ Standalone + Signals`)

1. **Ampliación de Tipos de Navegación (`AppSessionService` & `AppWorkspaceComponent`):**
   - Extensión de `activeView`: `'plans' | 'general' | 'superadmin' | 'security' | 'audit'`.
   - Protección reactiva: Si un usuario con rol distinto de `admin` intenta acceder a `audit`, el sistema lo redirige de inmediato a `plans` o `superadmin`.
2. **Acceso Exclusivo en Sidebar (`PlanSidebarComponent`):**
   - Inclusión del botón **"Historial"** dentro de las opciones de administración en el sidebar:
     ```html
     @if (userRole() === 'admin') {
       <button (click)="changeView.emit('audit')" title="Historial y Auditoría">
         <app-icon name="history" /> Historial
       </button>
     }
     ```
3. **Acceso en Cabecera Superior (`AppHeaderComponent`):**
   - Botón **"Historial"** con icono `clock` / `history` junto a *"Roles y Permisos"* y *"Informe Consolidado"*, exclusivo para administradores.
4. **Nueva Vista de Auditoría: `AuditHistoryViewComponent`:**
   - **Ubicación:** `frontend/src/features/audit/infrastructure/audit-history-view.component.ts` (`< 140` líneas).
   - Pestañas:
     - **Pestaña 1: Trazabilidad de Cambios**: Muestra registros con badge comparativo:
       - Campo alterado (ej. `Estado de Actividad`, `Presupuesto Unitario`, `Descripción`).
       - Valor anterior: `<span class="bg-rose-50 text-rose-800 line-through">Pendiente</span>`
       - Valor nuevo: `<span class="bg-emerald-50 text-emerald-800">Completado</span>`
       - Usuario ejecutor, territorio, fecha y hora.
     - **Pestaña 2: Historial de Ingresos**: Lista de logins de directores, líderes y colaboradores con fecha/hora y equipo.
   - Filtros dinámicos por Misión territorial, Tipo de cambio y búsqueda textual.
   - Botón *"Volver al Dashboard"* para retornar al mapa nacional split-screen.
5. **Componentes Atómicos Hijos (`< 150` líneas cada uno):**
   - `AuditChangesTableComponent`: Renderizado de cambios con tarjetas y diffs comparativos.
   - `AuditLoginsTableComponent`: Renderizado de accesos al sistema.
   - `AuditFiltersBarComponent`: Selectores de misión, categoría y buscador.

### 3.2. Backend (`NestJS API`)

1. **Nuevo Módulo `AuditModule`:**
   - `backend/src/audit/audit.module.ts`
   - `backend/src/audit/audit.controller.ts`:
     - `@UseGuards(JwtAuthGuard, RolesGuard)`
     - `@Roles(UserRole.ROLE_NACIONAL)`
     - Endpoints:
       - `GET /audit/logs`: Consulta paginada con filtros por `teamId`, `actionType`, `startDate`, `endDate`.
       - `GET /audit/changes`: Trazabilidad detallada con `previousValue` y `newValue`.
       - `GET /audit/logins`: Bitácora exclusiva de inicios de sesión.
   - `backend/src/audit/audit.service.ts`: Manejo de registros en memoria/persistencia con semillas históricas reales.
   - `backend/src/audit/dto/query-audit.dto.ts`: Validación de parámetros de consulta vía `class-validator`.
2. **Registro en `AppModule`:**
   - Incorporación de `AuditModule` en la lista de imports de `backend/src/app.module.ts`.

---

## 4. Estricto Cumplimiento de Gobernanza Técnica (v2026.4.0)

- **Límite de 150 Líneas por Archivo:** Cada componente (`AuditHistoryViewComponent`, `AuditChangesTableComponent`, `AuditLoginsTableComponent`, `AuditFiltersBarComponent`, `AuditController`, `AuditService`) se mantiene estrictamente por debajo de **150 líneas**.
- **Cero SDKs Comerciales:** Consumo mediante cliente HTTP nativo y observables/signals estándar de Angular.
- **Entorno Local Protegido:** Trabajo exclusivo en la rama local `featurePrueba`, **sin ejecutar push a origin**.

