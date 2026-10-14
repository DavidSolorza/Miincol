# 🌿 MISINCOL | Plan de Desarrollo Ministerial (PDM)

Sistema de gestión, seguimiento operativo y control presupuestal para el **Plan de Desarrollo Ministerial (PDM)** de **Misiones Indígenas en Colombia (MISINCOL)**.

Diseñado bajo una estricta arquitectura **Vertical Slicing (VSA)**, **Domain-Driven Design (DDD)** táctico, componentes modulares ultralivianos y la identidad visual de Misincol (tonos tierra, terracota `#8B251E` y ocre `#E67324`).

---

## 🏛️ Arquitectura del Sistema

```
src/
├── app/                          # Configuración global, providers y layout
│   ├── router.tsx
│   └── App.tsx
├── shared/                       # Componentes y utilidades compartidas
│   ├── components/               # MisincolLogo, Modal, Badge
│   ├── utils/                    # Formateadores de moneda (COP), semanas y fechas
│   └── api/                      # Cliente HTTP nativo (Cero SDKs comerciales)
└── modules/                      # Rebanadas Verticales Autónomas (Vertical Slices)
    ├── auth/                     # Módulo de Autenticación y Equipos Territoriales
    │   ├── domain/               # Entidades y tipos (UserSession, MissionaryTeam)
    │   ├── application/          # Hook useAuth y catálogo de misiones
    │   └── ui/                   # Modal selector de equipos de campo
    ├── plans/                    # Módulo Central del PDM
    │   ├── domain/               # Tipos puros (PhasePlan, Objective, Activity, PhaseType)
    │   ├── application/          # Hook usePlan (edición inline, autocalculado de presupuestos y persistencia)
    │   └── ui/                   # PhaseView, PhaseTabs, PhaseMetricsBar, ObjectiveCard, ActivityItem, ActivityModal
    └── reports/                  # Módulo de Informes y Exportación PDF
        ├── application/          # Hook useReportData (compilación de balances por objetivo)
        └── ui/                   # ReportModal y vista imprimible ejecutiva
```

---

## 🎨 Identidad de Color (MISINCOL)

- **Terracota Principal:** `#8B251E` / `#A63226`
- **Ocre / Ámbar:** `#E67324` / `#F59E0B`
- **Fondo Lienzo Natural:** `#FAF7F2` / `#FBF8F3`
- **Bordes Cálidos:** `#EBDDCF` / `#E5E0D8`
- **Tipografía:** *Outfit* (títulos) + *Plus Jakarta Sans* (cuerpo)

---

## 🚀 Puesta en Marcha Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo Vite
npm run dev

# 3. Compilar bundle de producción
npm run build
```

El servidor local corre por defecto en `http://localhost:5173/`.

---

## 📚 Documentación Técnica de Gobernanza

- [1_architecture.md](file:///c:/Users/Usuario/Desktop/planMinisterial/docs/1_architecture.md): Análisis de impacto, diagramas de componentes Mermaid y registro de decisiones de arquitectura (ADR).
- [2_database.md](file:///c:/Users/Usuario/Desktop/planMinisterial/docs/2_database.md): Script DDL PostgreSQL 16+ inmaculado, UUIDs, restricciones de integridad y diccionario exhaustivo de datos.
- [3_api_spec.md](file:///c:/Users/Usuario/Desktop/planMinisterial/docs/3_api_spec.md): Especificación OpenAPI/REST con contratos 200, 400, 401, 422 y 500 para consumo HTTP nativo.
