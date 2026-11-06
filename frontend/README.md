# 💻 MISINCOL Frontend | Documentación de Arquitectura y Componentes

Aplicación web desarrollada en **Angular 21+** impulsada por **Vite** y **AnalogJS**, diseñada bajo el patrón de **Rebanadas Verticales (Vertical Slicing)**, reactividad con **Signals**, estrategia de detección de cambios `ChangeDetectionStrategy.OnPush` y estricto cumplimiento del límite de **150 líneas por archivo**.

---

## 🏛️ 1. Estructura de Directorios

```text
frontend/src/
├── app/
│   ├── app.component.ts                # Componente raíz orquestador (< 80 líneas)
│   ├── auth/                           # Gestión global de sesión (AppSessionService)
│   └── ui/                             # Shell: Workspace, Header, Banner de supervisión
├── core/
│   ├── bus/                            # ServiceBus pub/sub desacoplado en memoria
│   ├── config/                         # Constantes y configuración global
│   └── http/                           # Cliente HTTP base nativo (Cero SDKs comerciales)
├── features/                           # Rebanadas Verticales de Negocio
│   ├── admin/                          # Tablero nacional de supervisión y mapa de Colombia
│   │   ├── application/                # AdminDashboardService, cálculo de KPIs y semillas
│   │   ├── domain/                     # Tipos de supervisión (TeamSupervisionSummary)
│   │   └── infrastructure/             # SuperAdminView, TeamModal, Map y Badges
│   ├── audit/                          # Bitácora cronológica de auditoría de planes
│   ├── auth/                           # Login, PIN modal y selector de misiones
│   ├── general-info/                   # Vista macro: territorio, 3 integrantes y presupuestos
│   ├── notes/                          # Notas territoriales, filtros y agenda de campo
│   ├── plans/                          # PDM: 5 pilares, objetivos (máx 4) y actividades
│   │   ├── application/                # PlanService, acciones puras (applyAddObjective, etc.)
│   │   ├── domain/                     # Interfaces PhasePlan, Objective, Activity, EssentialArea
│   │   └── infrastructure/             # PhaseView, ObjectiveCard, ActivityModal, PlanSidebar
│   ├── reports/                        # Reporte ejecutivo PDM consolidado
│   └── security/                       # Gestor de roles y seguridad territorial
│       ├── application/                # SecurityMatrixService, SecurityUsersService y defaults
│       ├── domain/                     # SYSTEM_ROLES, SYSTEM_PERMISSIONS y contratos de usuario
│       └── infrastructure/             # SecurityRolesView, Header, MatrixTable, UsersTable
└── shared/                             # Componentes transversales desacoplados (Icon, Toast, Modal)
```

---

## ⚙️ 2. Patrones de Diseño Obligatorios

### 2.1. Límite de 150 Líneas por Archivo (SRP)
- Ningún archivo `.ts` supera las **150 líneas**.
- Toda vista compleja o modal se fragmenta en componentes hijos especializados:
  - `phase-view.component.ts` se compone de: `phase-header-bar`, `phase-objective-cards-grid`, `objective-card`, `activity-modal`, `objective-modal`.
  - `objective-modal.component.ts` se compone de: `objective-form-fields`, `objective-modal-actions`.
  - `activity-modal.component.ts` se compone de: `activity-basic-fields`, `activity-goals-fields`, `activity-budget-fields`, `activity-obstacles-fields`, `activity-modal-actions`.

### 2.2. Reactividad Pura con Signals
- Todo el flujo de datos opera mediante `signal()`, `computed()` y `effect()`.
- Los inputs y outputs de componentes utilizan la API moderna de Angular:
  - `readonly teamData = input.required<GeneralTeamData>();`
  - `readonly save = output<Activity>();`

### 2.3. ServiceBus para Desacoplamiento
- La comunicación entre features se realiza mediante `serviceBus.publish('evento', payload)` y `serviceBus.subscribe('evento', callback)` ubicado en `src/core/bus/`.

---

## 🎯 3. Reglas de Negocio Implementadas en la UI

1. **Restricción de 4 Objetivos por Pilar**:
   - `phase-objective-cards-grid.component.ts`: el botón de nuevo objetivo solo se muestra si `objectives().length < 4`.
   - Al llegar a 4 objetivos, la cuadrícula muestra la tarjeta de estado `4/4 Límite Máximo Alcanzado`.
   - En `phase-header-bar.component.ts`, el botón `+ Nuevo Objetivo` se oculta automáticamente y el contador indica `• X/4 Objetivos Estratégicos`.
   - `phase-view.component.ts` y `objective-modal.component.ts` impiden la apertura o guardado de objetivos adicionales.

2. **Gestión de Integrantes por Rol**:
   - Solo cuando `isAdmin()` es verdadero se muestran el botón `+ Agregar Integrante` y los iconos de eliminación en `general-team-card.component.ts`.
   - El equipo y líder misionero solo visualizan sus integrantes con el botón **"Asignar Tarea"**, que precarga al integrante como responsable de actividades en la fase activa.

3. **Navegación del Sidebar**:
   - Botón `← Volver a Supervisión Nacional` en la cabecera superior del sidebar en modo administrador.
   - En modo supervisión, se remueve el botón de logout del pie de página para evitar cierres de sesión accidentales.
   - Los accesos de **Notas y Agenda**, **Informe PDM** y **Contacto Líder** permanecen visibles tanto en las fases del PDM como en la vista de **Información General**.

4. **Gestor de Roles y Matriz de Permisos (`src/features/security/`)**:
   - Acceso exclusivo desde el header superior para el Director Nacional / Administrador (`Roles y Permisos`).
   - Matriz interactiva de doble entrada que cruza los roles (`Usuario equipo`, `Líder equipo`, `Director nacional`) con 10 permisos organizados en 4 categorías operativas.
   - Conteo reactivo de permisos activos por rol e indicador de estado ("Personalizada" vs "Predeterminada") con opción de restablecer valores por defecto.
   - Pestaña de **Asignación de Roles por Persona (`SecurityUsersTableComponent`)** para reasignar el rol de directores, líderes y colaboradores con persistencia reactiva en `SecurityUsersService`.
   - Botón superior de la cabecera renombrado a **"Volver al Dashboard"** con icono `arrow-left` para un retorno ágil al mapa split-screen nacional.

5. **Restricción Estricta de Historiales de Ingreso**:
   - En `TeamAuditModalComponent`, la pestaña "Ingresos" y los eventos de telemetría de login quedan restringidos al rol `admin` (`@Input() isAdmin = true`).
   - Si el modal es abierto por un líder o usuario de equipo, la pestaña "Ingresos" queda completamente oculta y los eventos de inicio de sesión no se renderizan en la línea de tiempo.

6. **Arquitectura ServiceBus Centralizada (`src/core/bus/`)**:
   - Catálogo tipado de eventos (`bus.types.ts`) con despacho asíncrono sobre microtareas (`queueMicrotask`).
   - Comunicación completamente desacoplada entre vistas, roles, telemetría y PDM territorial.

7. **Soporte PWA y Descargable de Escritorio (Desktop Native App)**:
   - Manifiesto completo `manifest.webmanifest` con modo `standalone` e iconos de 192x192 y 512x512.
   - Botón nativo `PwaInstallButtonComponent` en la barra superior para instalación en Windows, macOS y Linux con 1 clic.
   - Optimización de activos (logotipo reducido en un 94% a 54 KB) y Service Worker v3 con caché instantáneo de 0 ms para baja latencia en campo.

8. **Restricción de Usuario de Equipo en el Árbol PDM (`role: 'member'`)**:
   - Acceso con credenciales de colaborador (ej. Aída Secue / `aida2026`).
   - El árbol PDM completo es de **solo lectura**: se ocultan los botones para crear objetivos (`+ Nuevo Objetivo`), editar objetivos (`Editar`), crear actividades (`+ Nueva Actividad`, `Registrar primera actividad`), editar presupuesto y eliminar actividades.
   - **Edición Exclusiva de Estado**: el colaborador solo puede modificar el estado (`Pendiente` ➔ `En Proceso` ➔ `Completado`) de las actividades que tienen asignado su nombre en `responsible`. Para las demás actividades, el estado se muestra protegido con candado `🔒` en modo solo lectura.
   - En la tarjeta del colaborador se visualiza la insignia `"Tu tarea"` con realce esmeralda, y su perfil en el sidebar refleja su identidad personal.

9. **Creación Directa de Personas y Sincronización Automática con Equipos**:
   - Botón `+ Nueva Persona` en la vista de roles (`SecurityUsersTableComponent`) con modal `CreateUserModalComponent` que solicita Nombre Completo, Correo Electrónico, Rol y Misión / Territorio.
   - Sincronización automática en `AdminDashboardService`: al crear o actualizar cualquier equipo misionero, su pastor líder y miembros aparecen inmediatamente en la tabla de asignación de roles.

---

## 🛠️ 4. Comandos del Frontend

```bash
# Servidor de desarrollo con HMR
npm run dev

# Compilación de producción validada
npm run build

# Previsualización del bundle dist/
npm run preview
```

