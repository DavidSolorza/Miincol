# 🌿 MISINCOL | Plan de Desarrollo Ministerial (PDM) — Angular Edition

Sistema integral de gestión estratégica, seguimiento operativo, cartografía territorial y control presupuestal para el **Plan de Desarrollo Ministerial (PDM)** de **Misiones Indígenas en Colombia (MISINCOL)**.

Construido en **Angular 21+ (Standalone Components + Signals + OnPush)** con **Vite**, **Tailwind CSS v4** y estricto cumplimiento del **Contrato de Gobernanza Técnica v2026.4.0** (Vertical Slicing en `src/features/`, límite estricto de `< 150` líneas por archivo y cero SDKs comerciales opacos).

---

## 🏛️ Mapa de Estructura de Directorios (`Vertical Slicing`)

```text
planMinisterial/
├── docs/                               # Sistema de documentación técnica centralizado
│   ├── proposals/                      # Propuestas técnicas aprobadas
│   │   └── 001-migracion-angular.md    # Propuesta formal de migración a Angular
│   ├── architecture/                   # Diagramas Mermaid, ADRs y Guía Angular
│   │   ├── 1_architecture.md           # Documento de Arquitectura y ADRs (ADR-005 a ADR-028)
│   │   └── angular-guide.md            # Manual técnico de servicios, Signals y componentes Angular
│   ├── database/                       # Scripts DDL PostgreSQL 16+ y diccionario de datos
│   │   └── 2_database.md
│   └── api/                            # Contratos RESTful y especificación de cliente HTTP nativo
│       └── 3_api_spec.md
├── src/                                # Código fuente principal (< 150 líneas por archivo)
│   ├── main.ts                         # Bootstrap de Angular (bootstrapApplication + Service Worker)
│   ├── index.css                       # Sistema de diseño Tailwind CSS v4 + aceleración GPU
│   ├── app/                            # Shell global de la aplicación Angular
│   │   ├── app.component.ts            # Componente raíz (<app-root>)
│   │   ├── auth/                       # AppSessionService (estado reactivo de sesión y vista)
│   │   └── ui/                         # AppWorkspace, AppHeaderSection, AppHeader, AdminPreviewBanner
│   ├── core/                           # Núcleo compartido sin SDKs comerciales
│   │   ├── bus/                        # ServiceBusCore + NetworkBusService (pub/sub en microtareas)
│   │   ├── config/                     # Variables de entorno y configuración
│   │   ├── errors/                     # AppError y manejo estandarizado de excepciones HTTP
│   │   ├── http/                       # NativeFetchClient (fetch nativo + cola offline automática)
│   │   ├── offline/                    # Cola de sincronización offline-first
│   │   └── workers/                    # Registro de Service Worker nativo (public/sw.js)
│   ├── shared/                         # Componentes UI atómicos y utilidades transversales
│   │   ├── components/                 # AppIconComponent, ModalComponent, BadgeComponent, ToastService
│   │   └── utils/                      # Formateadores de moneda (COP), semanas y fechas
│   └── features/                       # Rebanadas Verticales de Negocio (Vertical Slicing)
│       ├── auth/                       # Portal Split-Card Login, Quick Access Chips y Selector de Equipos
│       ├── admin/                      # Tablero Nacional Split-Screen, Mapa SVG 33 Deptos y CRUD Misiones
│       ├── plans/                      # PlanService, Sidebar 5 Pilares, PhaseView 3 Niveles y Zoom Mapa
│       ├── notes/                      # Agenda y Notas Territoriales por Equipo
│       ├── audit/                      # Telemetría en Tiempo Real y Bitácora de Auditoría
│       └── reports/                    # Informe Ejecutivo Consolidado e Impresión PDF Oficial
└── README.md                           # Documentación general e inicio rápido
```

---

## ✨ Capacidades Principales

1. **Portal de Acceso Editorial (`LoginViewComponent`):**
   - Diseño *Split-Card Hero* con selector de rol (`Equipo Territorial` y `Super Admin`).
   - Matriz interactiva de **Acceso Rápido en 1 Clic** para pruebas e inspección inmediata de todas las misiones (Wayuu, Pastos, Nasa, Emberá, Arhuaco, Huitoto, Koreguaje y Director Nacional).
2. **Tablero Nacional de Supervisión (`SuperAdminViewComponent`):**
   - Layout *Split-Screen* ejecutivo: KPIs nacionales, filtros multicriterio y tarjetas de equipos a la izquierda; **Mapa Cartográfico Interactivo de los 33 Departamentos de Colombia** a la derecha con filtros por macrorregión biogeográfica.
   - Creación, edición, cambio rápido de fase PDM, telemetría de último acceso y modo **Vista Previa Administrador**.
3. **Espacio de Trabajo PDM de 3 Niveles (`PhaseViewComponent` & `PlanSidebarComponent`):**
   - Navegación por los **5 Pilares del PDM**: *1. Investigación*, *2. Encarnación*, *3. Evangelización*, *4. Entrenamiento* y *5. Autocuidado*.
   - **Rejilla 2x2 de Objetivos Estratégicos** (máximo 4 por fase) acompañada del **Micro-Mapa Departamental con Zoom Vectorial Automático** (`TeamDepartmentZoomCardComponent`), retícula geodésica, departamentos vecinos y pinpoint de precisión.
   - CRUD completo de Objetivos y Actividades con cálculo automático de presupuesto anual (`unitBudget × timesPerYear`) y semanas restantes.
4. **Agenda Territorial, Telemetría e Informe PDF (`TeamNotesModalComponent`, `TeamAuditModalComponent`, `ReportModalComponent`):**
   - Bloc de notas de campo categorizado con fijación (`pin`) y búsqueda instantánea.
   - Bitácora de auditoría por equipo conectada al `ServiceBusCore`.
   - Generación de Informe Ejecutivo imprimible / exportable a PDF.

---

## 🚀 Puesta en Marcha Local

```bash
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Iniciar servidor de desarrollo (Vite + Angular Compiler)
npm run dev

# 3. Compilar bundle de producción (Verificación AOT + Bundle)
npm run build
```

El servidor de desarrollo se levanta por defecto en `http://localhost:5173/`.

---

## 📚 Documentación Técnica y Gobernanza

- **Propuesta de Migración:** [docs/proposals/001-migracion-angular.md](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/docs/proposals/001-migracion-angular.md)
- **Arquitectura y ADRs (ADR-005 a ADR-028):** [docs/architecture/1_architecture.md](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/docs/architecture/1_architecture.md)
- **Guía de Desarrollo en Angular:** [docs/architecture/angular-guide.md](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/docs/architecture/angular-guide.md)
- **Modelo de Base de Datos PostgreSQL 16+:** [docs/database/2_database.md](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/docs/database/2_database.md)
- **Especificación de API RESTful:** [docs/api/3_api_spec.md](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/docs/api/3_api_spec.md)
