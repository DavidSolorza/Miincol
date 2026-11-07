# 🌿 MISINCOL | Monorepo: Plan de Desarrollo Ministerial (PDM)

Monorepo integral para el seguimiento y supervisión ministerial de **Misiones Indígenas en Colombia (MISINCOL)**, compuesto por:
1. **`frontend/`**: Aplicación web desarrollada en **Angular 21+** (Standalone Components, Signals reactivos, estrategia `OnPush`, Tailwind CSS v4 y Vite).
2. **`backend/`**: API REST empresarial desarrollada en **NestJS** con validaciones DTO estrictas (`class-validator`), guards JWT, control de concurrencia y flujo de aprobación de cambios (Submódulo Git).
3. **`docs/`**: Sistema centralizado de gobernanza técnica, arquitectura, especificaciones de bases de datos, contratos de API y propuestas técnicas formales.

---

## 🏛️ Estructura del Monorepo

```text
planMinisterial/
├── .gitmodules                         # Configuración del submódulo Git para el backend
├── package.json                        # Workspaces y scripts de orquestación raíz
├── docs/                               # Documentación centralizada del sistema
│   ├── api/                            # Especificaciones OpenAPI, contratos y validadores
│   ├── architecture/                   # ADRs, diagramas C4 y guía técnica de Angular
│   ├── database/                       # Esquemas SQL normalizados (3NF) y DDL
│   └── proposals/                      # Propuestas técnicas formales del ciclo de vida (001 a 010)
├── frontend/                           # Aplicación Angular 21+ (Vertical Slicing, < 150 líneas)
│   ├── src/
│   │   ├── app/                        # Shell, orquestación de sesión y layout
│   │   ├── core/                       # ServiceBus desacoplado, HTTP nativo y contratos
│   │   ├── features/                   # Rebanadas verticales de negocio aisladas
│   │   │   ├── admin/                  # Supervisión nacional y tablero territorial
│   │   │   ├── audit/                  # Registro de auditoría cronológico
│   │   │   ├── auth/                   # Autenticación, selector de equipo y PIN
│   │   │   ├── general-info/           # Vista macro: datos territoriales, integrantes y presupuesto
│   │   │   ├── notes/                  # Notas de campo, ideas y peticiones de oración
│   │   │   ├── plans/                  # Fases PDM, 4 objetivos máx. y actividades
│   │   │   └── reports/                # Informes ejecutivos y exportación de reportes
│   │   └── shared/                     # Componentes atómicos reutilizables (Icon, Toast, Modal)
│   ├── public/                         # Activos estáticos, iconos y PWA
│   └── vite.config.ts                  # Bundler Vite con plugin AnalogJS
└── backend/                            # API NestJS (DavidSolorza/misincolBack)
    ├── src/
    │   ├── activities/                 # Gestión de iniciativas y contingencias de campo
    │   ├── auth/                       # Autenticación JWT y guards por rol
    │   ├── common/                     # Validadores personalizados y middlewares
    │   ├── objectives/                 # Objetivos PDM (Límite estricto de 4 por pilar)
    │   ├── reports/                    # Consolidación ejecutiva nacional
    │   ├── teams/                      # Equipos territoriales y supervisión
    │   ├── users/                      # Usuarios y credenciales
    │   └── workflow/                   # Solicitudes de cambio y gobernanza de planes
    └── package.json
```

---

## 🧭 Reglas Ministeriales y de Negocio Implementadas

1. **Los 5 Pilares Fundamentales del PDM**:
   - `Investigación`
   - `Encarnación`
   - `Evangelización`
   - `Entrenamiento`
   - `Autocuidado`
2. **Límite Estricto de 4 Objetivos por Fase**:
   - Toda fase ministerial admite como máximo **4 objetivos estratégicos** (numerados 1..4).
   - Al alcanzar los 4 objetivos, la interfaz bloquea la creación y muestra una tarjeta informativa de estado: `4/4 - Límite Máximo Alcanzado`.
   - El backend valida este límite en `ObjectivesService.create()`, respondiendo `400 Bad Request` ante cualquier intento adicional.
3. **Control de Acceso a Integrantes**:
   - Solo el **Coordinador de Equipos (rol Administrador)** puede agregar o remover integrantes del equipo.
   - En la sesión del **Equipo / Líder**, los botones de agregar y eliminar están estrictamente ocultos.
   - Cada integrante cuenta con el botón **"Asignar Tarea"**, que preselecciona al miembro como responsable en la fase activa del PDM.
4. **Navegación Consistente en el Sidebar**:
   - Botón **"Volver a Supervisión Nacional"** ubicado en la parte superior del sidebar durante el modo de supervisión.
   - Los accesos de **Notas y Agenda**, **Informe PDM** y **Contacto Líder** se mantienen visibles tanto en las fases del PDM como en **Información General**.

---

## 💻 Comandos de Desarrollo

```bash
# Desarrollo local del Frontend (puerto 5173)
cd frontend
npm install
npm run dev

# Desarrollo local del Backend (puerto 3000)
cd backend
npm install
npm run start:dev

# Compilación y verificación general
npm run build
```
