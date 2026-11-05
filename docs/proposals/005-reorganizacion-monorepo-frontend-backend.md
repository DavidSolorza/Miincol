# Propuesta Técnica 005: Reorganización a Estructura Monorepo (Frontend / Backend) y Anclaje de Repositorio

**Fecha:** 2026-11-04  
**Estado:** PENDIENTE DE REVISIÓN Y FEEDBACK DEL USUARIO  
**Gobernanza:** Technical Governance Contract v2026.4.0 (Regla 2.2 Ciclo de Propuesta y Feedback)

---

## 1. Contexto y Justificación (El Qué y El Por Qué)

Actualmente, el repositorio principal (`https://github.com/DavidSolorza/Miincol.git`) contiene la aplicación Angular directamente en la raíz del proyecto. El usuario solicita estructurar el proyecto en dos carpetas aisladas:

1. **`frontend/`**: Contenedor de toda la aplicación web Angular existente (`src/`, `public/`, `vite.config.ts`, `package.json`, etc.).
2. **`backend/`**: Contenedor del backend (NestJS), anclado y sincronizado con el repositorio remoto:
   `https://github.com/DavidSolorza/misincolBack.git`.

### Beneficios Técnicos:
- **Separación de Responsabilidades**: Aislamiento estricto de dependencias de Node.js (`frontend/package.json` vs `backend/package.json`).
- **Cohesión Monorepo**: Permite gestionar contratos comunes (`docs/api/`) y ejecutar scripts unificados desde la raíz si se desea.
- **Flujo de Versionamiento Claro**: El frontend continúa versionándose en su repositorio y el backend en `misincolBack.git`.

---

## 2. Diagnóstico del Repositorio Remoto Backend

Se ejecutó un sondeo de red sobre `https://github.com/DavidSolorza/misincolBack.git`:
- El repositorio existe en GitHub con permisos de acceso válidos.
- Actualmente se encuentra **vacío** (sin ramas ni commits iniciales).
- Para poder anclarlo limpiamente mediante Git (submódulo o repositorio remoto), requiere la inicialización de su commit base (por ejemplo, `Initial commit: NestJS backend scaffolding / README`).

---

## 3. Arquitectura Propuesta del Proyecto

```plaintext
planMinisterial/                              # Raíz del Workspace
├── .git/                                     # Git del repositorio principal (Miincol)
├── .gitmodules                               # Configuración de submódulo (si se elige Opción A)
├── docs/                                     # Documentación viva compartida
│   ├── api/                                  # Contratos de interfaz REST y DTOs
│   ├── architecture/                         # Diagramas y decisiones de diseño
│   └── proposals/                            # Historial de propuestas técnicas
├── frontend/                                 # Aplicación Angular 21+
│   ├── src/                                  # Código fuente UI y lógica de negocio
│   │   ├── app/
│   │   ├── features/
│   │   └── shared/
│   ├── public/                               # Assets estáticos y PWA manifest
│   ├── package.json                          # Dependencias exclusivas de Angular
│   ├── vite.config.ts                        # Configuración de Vite / AnalogJS
│   └── tsconfig.json                         # Configuración de TypeScript
├── backend/                                  # Aplicación NestJS (anclado a misincolBack.git)
│   ├── src/                                  # Módulos, controladores, servicios, DTOs
│   ├── test/                                 # Pruebas unitarias y E2E
│   ├── package.json                          # Dependencias de NestJS / TypeORM / Prisma
│   └── tsconfig.json
└── README.md                                 # Guía de orquestación y arranque local
```

---

## 4. Opciones de Anclaje de Git para `backend/`

### Opción A (Recomendada): Git Submodule
- Se traslada el frontend a `frontend/`.
- Se inicializa el scaffolding de NestJS dentro de `backend/` y se enlaza como submódulo apuntando a `https://github.com/DavidSolorza/misincolBack.git`.
- **Ventaja:** Cada repositorio en GitHub conserva sus propios commits, Pull Requests e historial independiente, pero la raíz permite clonar todo el proyecto con `git clone --recurse-submodules`.

### Opción B: Repositorio Git Independiente dentro de Carpeta
- La carpeta `backend/` se inicializa con su propio `.git` apuntando a `origin = https://github.com/DavidSolorza/misincolBack.git`.
- Se agrega `backend/` al `.gitignore` del repositorio de frontend para no generar conflictos de subrepositorios huérfanos.
- **Ventaja:** Máxima simplicidad si trabajas en dos ventanas separadas o dos repositorios completamente desacoplados.

---

## 5. Plan de Ejecución Paso a Paso

1. **Creación de Directorio `frontend/`**:
   - Mover mediante `git mv` los archivos y carpetas del frontend (`src/`, `public/`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `package.json`, `package-lock.json`, etc.) hacia `frontend/`.
   - Mantener `docs/` en la raíz para servir a ambos proyectos (frontend y backend).
2. **Inicialización y Anclaje de `backend/`**:
   - Clonar o inicializar `backend/` con el remote `https://github.com/DavidSolorza/misincolBack.git`.
   - Crear la estructura base inicial de NestJS (o un commit inicial con `README.md` y estructura de carpetas `src/core/`, `src/features/` siguiendo la gobernanza de arquitectura).
   - Realizar el push del commit inicial a `misincolBack.git`.
3. **Ajuste de Scripts de Trabajo y Verificación**:
   - Probar que `npm run build` dentro de `frontend/` compile al 100% sin rutas rotas.
   - Actualizar la guía de arquitectura y workspace.
4. **Git Commit & Push**:
   - Subir la reestructuración a `featurePrueba` en `DavidSolorza/Miincol.git` y a `main` en `DavidSolorza/misincolBack.git`.

---

## 6. Feedback Requerido del Usuario

Por favor indícanos:
1. ¿Prefieres la **Opción A (Git Submodule)** para que el repo de frontend tenga vinculado el backend automáticamente, o la **Opción B (Repositorio independiente)**?
2. ¿Deseas que inicialicemos el backend con el scaffolding estándar de **NestJS** (con TypeScript, class-validator y estructura modular) en este mismo paso?

