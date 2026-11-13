# ADR-056: Creación de Equipos Misioneros con Cero Objetivos y Cero Actividades por Defecto

## Estado
Aceptado e Implementado (2026-11-12)

## Contexto
Anteriormente, al registrar un nuevo equipo territorial desde la vista de Supervisión Nacional, el sistema inyectaba métricas predefinidas (`totalActivities: 4`, `inProgressActivities: 1`, `pendingActivities: 3` y una iniciativa preliminar). El usuario requirió que todo nuevo equipo inicie completamente en blanco (cero objetivos y cero actividades en sus cinco fases ministeriales), de modo que sea el usuario o el equipo misionero quien diseñe su plan desde cero.

## Decisiones de Diseño

### 1. Métricas Iniciales Limpias en Creación (`admin-dashboard.service.ts`)
- Al crear el equipo, sus indicadores de actividades se inicializan en cero absoluto:
  - `totalActivities: 0`
  - `completedActivities: 0`
  - `inProgressActivities: 0`
  - `pendingActivities: 0`
  - `progressPercentage: 0`
  - `activeInitiatives: []`

### 2. Generación y Persistencia Inmediata de Planes en Blanco (`teamPlanLoader.ts`)
- La función `createCustomPlanForTeam` configura las cinco fases ministeriales (`investigacion`, `encarnacion`, `evangelizacion`, `entrenamiento`, `autocuidado`) con `objectives: []` y persiste inmediatamente el estado en `localStorage` bajo `misincol_pdm_plans_[teamId]`.

### 3. Componente de Estado Vacío en Fase (`phase-empty-objectives.component.ts`)
- Si una fase no tiene objetivos registrados, `phase-view.component.ts` renderiza un contenedor limpio con el mensaje *"Esta fase no tiene objetivos registrados"* y un botón directo *"Crear Primer Objetivo"* (`(0/4 registrados)`).

## Consecuencias
- Experiencia de usuario limpia y sin datos ficticios en nuevos equipos.
- Control total del plan ministerial en manos del líder territorial y de la Dirección Nacional.
- Cumplimiento riguroso de la regla de máximo 150 líneas por archivo de código fuente (.ts).

