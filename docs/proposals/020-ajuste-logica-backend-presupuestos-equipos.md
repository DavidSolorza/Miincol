# Propuesta Técnica: 020 - Alineación y Cuadre de Lógica Presupuestal en Backend NestJS

**Estado:** Pendiente de Aprobación  
**Fecha:** 2026-11-07  
**Autor:** Agente 1 (Orquestador y Árbitro Técnico) & Agente 2 (Staff Software Architect)  
**Gobernanza:** Contrato de Gobernanza Técnica v2026.4.0 (Regla de Oro: <= 150 líneas por archivo)

---

## 1. Contexto y Diagnóstico del Backend

En la arquitectura actual del backend NestJS:
1. **Entidad `Team` y `TeamsService` desalineados:**
   - La entidad `Team` en `backend/src/teams/entities/team.entity.ts` solo maneja campos demográficos básicos (`location`, `population`, `members`), pero **carece de los campos presupuestales críticos**: `totalBudget`, `executedBudget`, `budgetPercentage`, `currentPhaseId`, `healthStatus` y el desglose de `pillarBudgets` (Investigación, Encarnación, Evangelización, Entrenamiento, Autocuidado).
   - Solo existen 3 equipos sembrados en el backend (`team-wayuu`, `team-pastos`, `team-nasa`), mientras que el sistema territorial oficial contempla los 6 equipos nacionales (`pastos`, `wayuu`, `nasa`, `arhuaco`, `embera`, `nukak`).
2. **Cálculo y Cuadre Presupuestal:**
   - Si un equipo tiene asignado un presupuesto total específico (por ejemplo, **$11,210,000 COP** para Pastos según el documento oficial de Excel *PDM 2026 Pastos Vr1.xlsx*), ese valor exacto debe estar fijado como presupuesto base asignado y los cálculos de porcentaje de ejecución y desglose por pilar deben derivarse con exactitud matemática:
     $$\text{budgetPercentage} = \text{round}\left(\frac{\text{executedBudget}}{\text{totalBudget}} \times 100\right)$$
3. **Cálculo de Actividades (`ActivitiesService`):**
   - El cálculo de presupuesto de actividades debe soportar tanto la fórmula tradicional $(\text{unitBudget} \times \text{timesPerYear})$ como el desglose de 12 meses (`monthlyBudget: Record<string, number>`), donde el presupuesto total de la actividad es la suma de los valores mensuales cuando estos están presentes.
   - La suma de actividades con estado `'Completado'` debe alimentar directamente el `executedBudget` del objetivo y del equipo territorial correspondiente.

---

## 2. Arquitectura de la Solución Propuesta

### 2.1. Ampliación de la Entidad y DTOs de Equipos (`src/teams/`)
1. **`Team` Entity:**
   - Incorporar:
     - `totalBudget: number;` // Presupuesto asignado al equipo
     - `executedBudget: number;` // Presupuesto ejecutado acumulado
     - `budgetPercentage: number;` // % de ejecución presupuestal (0..100)
     - `currentPhaseId: string;` // Fase actual ('investigacion', 'encarnacion', etc.)
     - `healthStatus: 'Optimo' | 'Atención' | 'Crítico';`
     - `pillarBudgets: Record<string, number>;` // Desglose por los 5 pilares
     - `monthlyBudgets?: Record<string, number>;` // Desglose acumulado anual
2. **Sembrado Completo de los 6 Equipos Territoriales:**
   - `team-pastos`: $11,210,000 COP total asignado (Entrenamiento: $11,210,000, demás pilares: $0, ejecutado base: $4,200,000 COP).
   - `team-wayuu`: $14,900,000 COP total asignado.
   - `team-nasa`: $18,200,000 COP total asignado.
   - `team-arhuaco`: $12,500,000 COP total asignado.
   - `team-embera`: $16,800,000 COP total asignado.
   - `team-nukak`: $21,000,000 COP total asignado.
   - Total Nacional Consolidado: **$94,610,000 COP**.

### 2.2. Servicio de Cálculo Presupuestal Reactivo (`TeamBudgetCalculator`)
Para respetar la regla de oro de **<= 150 líneas por archivo**, la lógica de cálculo y agregación matemática de presupuestos se extraerá en un submódulo especializado:
- `backend/src/teams/helpers/team-budget.calculator.ts` (< 100 líneas).
- Funciones puras:
  - `calculateTeamBudget(team, activities)`: calcula en tiempo real `totalBudget`, `executedBudget`, `budgetPercentage` y el desglose de `pillarBudgets`.
  - `calculateNationalKPIs(teams)`: total nacional asignado, total nacional ejecutado y porcentaje global de ejecución.

### 2.3. Endpoints REST Nuevos y Mejorados en `TeamsController`
- `GET /teams`: Retorna todos los equipos con sus presupuestos totales asignados y porcentajes calculados.
- `GET /teams/:id`: Retorna el detalle del equipo con su presupuesto asignado y desglose por pilares.
- `GET /teams/:id/budget-summary`: Endpoint especializado que entrega la conciliación exacta entre presupuesto asignado, planeado en actividades y ejecutado.
- `GET /teams/summary/kpis`: KPIs nacionales consolidados de presupuesto y avance.

### 2.4. Integración con `ActivitiesService`
- Soportar el arreglo `monthlyBudget?: number[]` (12 meses) en `CreateActivityDto` y `UpdateActivityDto`.
- Si `monthlyBudget` está presente y contiene valores, `totalBudget` se calcula como la suma de los 12 meses; si no, aplica $(\text{unitBudget} \times \text{timesPerYear})$.
- Métodos auxiliares para consultar actividades por equipo y pilar para cálculo en tiempo real.

---

## 3. Plan de Modularización y Límite de 150 Líneas

Para cumplir estrictamente con el Contrato de Gobernanza Técnica:
- `backend/src/teams/entities/team.entity.ts`: ~40 líneas.
- `backend/src/teams/dto/create-team.dto.ts`: ~60 líneas.
- `backend/src/teams/helpers/team-budget.calculator.ts`: ~70 líneas.
- `backend/src/teams/helpers/initial-teams.data.ts`: ~120 líneas (sembrado de los 6 equipos con presupuestos oficiales).
- `backend/src/teams/teams.service.ts`: ~125 líneas.
- `backend/src/teams/teams.controller.ts`: ~85 líneas.
- `backend/src/activities/dto/create-activity.dto.ts`: ~80 líneas.
- `backend/src/activities/activities.service.ts`: ~110 líneas.

---

## 4. Pruebas y Validación de Cuadre Numérico

1. **Prueba de Cuadre Pastos:**
   - Presupuesto Asignado: **$11,210,000 COP**.
   - Presupuesto en Pilar Entrenamiento: **$11,210,000 COP**.
   - Otros pilares: **$0 COP**.
   - Porcentaje de ejecución = $(\text{ejecutado} / 11,210,000) \times 100$.
2. **Prueba de KPIs Nacionales:**
   - Suma total de presupuestos de los 6 equipos = **$94,610,000 COP**.
3. **Compilación y Linters:**
   - `nest build` limpio con código 0.
   - Script python verificador: todos los archivos `<= 150` líneas.

