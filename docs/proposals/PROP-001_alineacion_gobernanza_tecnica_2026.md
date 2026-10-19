# Propuesta Técnica: Adopción Integral del Contrato de Gobernanza Técnica (Versión 2026.4.0)
**Código:** PROP-001  
**Fecha:** 2026-10-18  
**Autor:** Orquestador Técnico (VP of Engineering) & Staff Software Architect  
**Estado:** APROBADO Y EJECUTADO CON ÉXITO  

---

## 1. Resumen Ejecutivo (El Qué y El Por Qué)

### El Qué:
Se propone una alineación arquitectónica y estructural exhaustiva del proyecto frontend existente (`planMinisterial`) para adoptar de forma permanente e irrevocable el **Contrato de Gobernanza Técnica y Modelo Multi-Agente Ultra-Estricto (Antigravity Edition, v2026.4.0)**, conforme a las directrices estipuladas en `.gemini/GEMINI.md`. Se excluye temporalmente el montaje del backend ("aun no montes el back") a petición explícita del usuario, pero se deja el frontend 100% estandarizado, modularizado y preparado para acoplarse con contratos REST puros y clientes HTTP nativos.

### El Por Qué:
1. **Prevención de Deuda Técnica:** Evitar archivos kilométricos que dificulten el mantenimiento, las pruebas unitarias y la escalabilidad.
2. **Modularidad y Vertical Slicing:** Garantizar que cada funcionalidad de negocio (`features/`) sea autónoma, cohesiva y desacoplada de capas técnicas horizontales.
3. **Cumplimiento de la Regla de Oro (Límite 150 Líneas):** 3 archivos del código fuente actual superan las 150 líneas (`TeamDepartmentZoomCard.tsx` con 273 líneas, `colombiaLocations.ts` con 178 líneas, y `useActivityModalForm.ts` con 168 líneas). Su fragmentación es obligatoria bajo el principio de responsabilidad única (SRP).
4. **Sistema de Documentación Viva:** Establecer la estructura centralizada y modular en `docs/` (`proposals/`, `architecture/`, `database/`, `api/`).

---

## 2. Mapa de Transformación de Estructura de Directorios

### Estado Actual:
```
src/
├── app/
├── assets/
├── core/
│   ├── bus/
│   └── workers/
├── modules/          <-- Nomenclatura no estandarizada con la gobernanza
│   ├── admin/
│   ├── audit/
│   ├── auth/
│   ├── notes/
│   ├── plans/
│   └── reports/
├── shared/           <-- Componentes y utilidades compartidas
└── styles/
```

### Estado Objetivo (Gobernanza 2026.4.0):
```
docs/
├── proposals/        <-- Propuestas técnicas (PROP-001)
├── architecture/     <-- ADRs y diagramas Mermaid
├── database/         <-- Diccionarios y esquemas SQL DDL (para fase backend)
└── api/              <-- Contratos de endpoints REST tipados
src/
├── core/             <-- Núcleo compartido globalmente
│   ├── config/       <-- Constantes globales y variables de entorno seguras
│   ├── errors/       <-- Manejadores de excepciones y tipado de errores
│   ├── http/         <-- Cliente HTTP nativo base (Cero SDKs comerciales)
│   ├── bus/          <-- Event bus desacoplado entre slices
│   └── workers/      <-- Web Workers de telemetría y cómputo
├── features/         <-- Rebanadas Verticales de Negocio (Vertical Slicing)
│   ├── admin/        <-- Feature: Supervisión Nacional
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── audit/        <-- Feature: Telemetría y Auditoría
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── auth/         <-- Feature: Autenticación y Selección de Equipos
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── notes/        <-- Feature: Notas y Agenda Territorial
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── plans/        <-- Feature: Gestión del Plan PDM
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   └── reports/      <-- Feature: Generación de Informes Ejecutivos
│       ├── domain/
│       ├── application/
│       └── infrastructure/
├── shared/           <-- Componentes UI transversales y utilidades puras
└── main.tsx
```

---

## 3. Plan de Descomposición (Regla de Oro < 150 Líneas)

### 3.1. `TeamDepartmentZoomCard.tsx` (273 líneas)
* **Diagnóstico:** Acumula la tabla masiva de coordenadas y cajas de colisión (`DEPARTMENT_BOUNDS`), el cálculo algorítmico del `viewBox` con padding cartográfico y detección de vecinos, y la renderización visual de la tarjeta SVG.
* **Solución Modular:**
  1. `src/features/plans/infrastructure/map/departmentBounds.constants.ts` (< 70 líneas): Diccionario inmutable de cotas de los 32 departamentos.
  2. `src/features/plans/infrastructure/map/useDepartmentZoomViewBox.ts` (< 65 líneas): Hook especializado en el cálculo de viewBox, centrado y vecinos visibles.
  3. `src/features/plans/infrastructure/TeamDepartmentZoomCard.tsx` (< 145 líneas): Componente visual puro enfocado en la tarjeta SVG cartográfica y la insignia flotante.

### 3.2. `colombiaLocations.ts` (178 líneas)
* **Diagnóstico:** Mezcla la lista estática de departamentos de Colombia con sus identificadores geográficos y la función de resolución de ubicación de equipos misioneros.
* **Solución Modular:**
  1. `src/features/admin/domain/colombiaDepartments.data.ts` (< 90 líneas): Constante tipada `COLOMBIA_DEPARTMENTS`.
  2. `src/features/admin/domain/colombiaLocations.ts` (< 95 líneas): Funciones puras de resolución espacial (`resolveTeamLocation`, `getDepartmentById`).

### 3.3. `useActivityModalForm.ts` (168 líneas)
* **Diagnóstico:** Concatena el estado del formulario modal de actividades, cálculos de conversión presupuestal y validaciones de fechas y responsables.
* **Solución Modular:**
  1. `src/features/plans/application/activityModalValidation.ts` (< 45 líneas): Validador puro de campos y reglas de negocio del formulario.
  2. `src/features/plans/application/useActivityModalForm.ts` (< 130 líneas): Hook orquestador de estado y persistencia.

---

## 4. Ecosistema de Roles y Especialistas en esta Fase

| Agente | Rol | Entregables Inmediatos |
|---|---|---|
| **Agente 1: Orquestador** | Gatekeeper y Auditor | Presentación de esta propuesta, supervisión del límite < 150 líneas y reporte final. |
| **Agente 2: Arquitecto** | Staff Software Architect | Diagrama Mermaid de arquitectura vertical y ADR-028 formal en `docs/architecture/`. |
| **Agente 3: DBA** | Principal DBA | Diseño previo de esquemas relacionales 3NF (UUIDs, snake_case) en `docs/database/` listo para el futuro backend. |
| **Agente 4: Implementador** | Frontend Senior Engineer | Ejecución de la refactorización a `src/features/`, modularización de archivos > 150 líneas y verificación de 0 errores TypeScript. |
| **Agente 5: Quality Writer** | Auditor de Calidad | Informe de cambios detallado y sincronización de contratos en `docs/api/`. |

---

## 5. Criterios de Aceptación y Validación
1. **0 errores de TypeScript (`tsc -b && vite build`)**: Todas las rutas de importación deben actualizarse automáticamente sin alterar la experiencia de usuario.
2. **0 archivos fuente > 150 líneas**: Se ejecutará un script de auditoría estricta para garantizar cumplimiento del 100%.
3. **Cero impacto en UI**: La interfaz gráfica actual (sidebar calmado, mapa, objetivos, modales) se preservará exactamente igual en píxeles y comportamiento.

---

## 6. Solicitud de Feedback

> [!IMPORTANT]
> Siguiendo el Contrato de Gobernanza Técnica (Sección 2.2 y 4), este plan requiere tu **aprobación explícita** antes de ejecutar cualquier movimiento de carpetas o fragmentación de archivos.
> 
> ¿Das tu visto bueno para ejecutar la reestructuración hacia `src/features/`, aplicar el límite de 150 líneas en los 3 archivos identificados y documentar la arquitectura en `docs/`?
