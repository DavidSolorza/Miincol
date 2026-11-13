# Propuesta Técnica 037: Creación de Nuevos Equipos Misioneros con Cero Objetivos y Cero Actividades por Defecto

## 1. Contexto y Requerimiento
El usuario ha solicitado de forma explícita:
> *"cuando se crea un nuevo equipo no le agregues objetivos cero objetivos cero actividades, que todo lo cree el usuario porfa nada por defecto y revisa la lógica con el back porfa. tienes los permisos y luz verde para que lo apliques porfa"*

### Diagnóstico Técnico:
1. **Valores Quemados (Hardcoded) en Creación de Equipos:**
   - En [`admin-dashboard.service.ts`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/application/admin-dashboard.service.ts), al ejecutar `handleCreateTeam(dto)`, el objeto del nuevo equipo se creaba con:
     - `totalActivities: 4`
     - `inProgressActivities: 1`
     - `pendingActivities: 3`
     - `activeInitiatives: [{ title: 'Diagnóstico inicial con pueblo ...', ... }]`
   - Esto provocaba que en el panel de Supervisión Nacional y en las tarjetas del equipo aparecieran 4 actividades fantasma que no correspondían a la realidad del equipo.
2. **Inicialización de Planes en Blanco:**
   - Al crear un equipo, sus 5 fases (`investigacion`, `encarnacion`, `evangelizacion`, `entrenamiento`, `autocuidado`) deben inicializarse explícitamente con `objectives: []` en `localStorage` (`misincol_pdm_plans_[teamId]`) y en memoria.
3. **Experiencia de Usuario en la Vista de Fase Vacía (`app-phase-view`):**
   - Cuando una fase tiene 0 objetivos, debe presentar un estado amigable y limpio que invite al usuario a registrar su primer objetivo estratégico (`Crear Primer Objetivo`) sin elementos residuales de plantillas de ejemplo.
4. **Consistencia en el Backend:**
   - En [`TeamsService.create()`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/teams.service.ts), verificar que el equipo persista con presupuestos limpios y sin actividades ni objetivos inyectados.
   - En [`ObjectivesService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/objectives/objectives.service.ts), los nuevos equipos inician con `[]` objetivos en el backend.

---

## 2. Alcance de la Solución Técnica

### A. Frontend (`admin-dashboard.service.ts`)
- Configurar las métricas iniciales del nuevo equipo en cero absoluto:
  - `totalActivities: 0`
  - `completedActivities: 0`
  - `inProgressActivities: 0`
  - `pendingActivities: 0`
  - `progressPercentage: 0`
  - `activeInitiatives: []`
- Inicializar y persistir el plan en blanco (`createCustomPlanForTeam`) inmediatamente en `localStorage` al crearse el equipo.

### B. Vista de Fase (`phase-view.component.ts`)
- Cuando `plan().objectives.length === 0`:
  - Mostrar un contenedor limpio de estado inicial: *"Esta fase aún no tiene objetivos registrados"*, con un botón claro para agregar el primer objetivo.

### C. Backend (`TeamsService`)
- Asegurar que al recibir la petición `POST /api/teams`, el equipo se cree con `executedBudget: 0`, `budgetPercentage: 0` y sin actividades automáticas.

---

## 3. Plan de Pruebas y Validación
1. Crear un nuevo equipo en la interfaz (ej. "Misión Guajira Sur").
2. Verificar que en la tarjeta de Supervisión Nacional marque:
   - `0 actividades`
   - `0% progreso`
   - `Sin iniciativas activas`.
3. Ingresar a la misión y comprobar que en las 5 fases aparezca `(0/4 registrados)` con el botón para crear el primer objetivo.
4. Crear un objetivo manual y verificar que pase a `(1/4 registrados)` sin ningún elemento residual.
5. Ejecutar la suite completa de pruebas unitarias y de compilación.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** AUTORIZADO Y EN EJECUCIÓN (Luz verde explícita del usuario).

