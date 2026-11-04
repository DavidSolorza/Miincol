# 🌿 MISINCOL | Monorepo: Plan de Desarrollo Ministerial (PDM)

Monorepo integral para **Misiones Indígenas en Colombia (MISINCOL)**, compuesto por:
1. **`frontend/`**: Aplicación web desarrollada en **Angular 21+** (Standalone Components, Signals, OnPush y Tailwind CSS). Repositorio: [`DavidSolorza/Miincol`](https://github.com/DavidSolorza/Miincol.git).
2. **`backend/`**: API REST desarrollada en **NestJS** con validaciones DTO (`class-validator`) vinculada como **Git Submodule**. Repositorio: [`DavidSolorza/misincolBack`](https://github.com/DavidSolorza/misincolBack.git).
3. **`docs/`**: Especificaciones de arquitectura, contratos de API REST, bases de datos y propuestas técnicas.

---

## 🏛️ Estructura del Monorepo

```text
planMinisterial/
├── .gitmodules                         # Definición del submódulo Git para el backend
├── package.json                        # Workspaces y orquestación raíz
├── docs/                               # Sistema de documentación centralizado
│   ├── api/                            # Contratos de API y validadores NestJS
│   ├── architecture/                   # Diagramas y decisiones de diseño
│   └── proposals/                      # Propuestas técnicas formales
├── frontend/                           # Aplicación Angular 21+
│   ├── src/                            # Código fuente (Vertical Slicing, < 150 líneas)
│   ├── public/                         # Assets estáticos y Service Worker
│   ├── package.json                    # Dependencias de Angular
│   └── vite.config.ts                  # Bundler Vite / AnalogJS
└── backend/                            # API NestJS (Submódulo: DavidSolorza/misincolBack)
    ├── src/                            # Módulos, controladores, servicios y DTOs
    ├── package.json                    # Dependencias de NestJS
    └── tsconfig.json
```

---

## 🚀 Inicio Rápido y Clonación

Al clonar este monorepo por primera vez, asegúrate de inicializar los submódulos:

```bash
git clone --recurse-submodules https://github.com/DavidSolorza/Miincol.git
```

Si ya lo clonaste sin la bandera `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

---

## 💻 Comandos de Desarrollo

### Frontend (Angular)
```bash
cd frontend
npm install
npm run dev
```

### Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```

### Orquestación desde la Raíz (Workspaces)
```bash
npm run start:frontend
npm run start:backend
npm run build
```
