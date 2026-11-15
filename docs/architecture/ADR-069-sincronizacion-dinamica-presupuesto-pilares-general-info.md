# ADR-069: Sincronización Dinámica del Presupuesto por Pilares y Erradicación de Mocks en Información General

## Estado
Propuesto (Esperando Aprobación)

## Contexto
En la vista de "Diagnóstico e Información General de Campo", el componente de presupuesto mostraba una asignación fija de `$ 11.210.000` en el pilar "4. ENTRENAMIENTO" y un gasto ejecutado ficticio de `$ 4.500.000 (40%)` aun cuando la misión recién creada no tenía objetivos ni actividades registradas.

Tras auditar el backend (`https://misincol-api.servidor.blog/api/teams`), se verificó que el servidor tiene todos los pilares en cero (`pillarBudgets: { investigacion: 0, encarnacion: 0, evangelizacion: 0, entrenamiento: 0, autocuidado: 0 }`). El problema residía exclusivamente en el frontend debido a objetos por defecto heredados en `createDefaultGeneralInfo` y la ausencia de un cálculo dinámico a partir de los planes PDM del equipo.

## Decisión de Arquitectura
1. **Erradicación de Mocks:** Inicializar `createDefaultGeneralInfo` con todos los presupuestos de pilares y gastos ejecutados en cero.
2. **Cálculo Derivado de Planes PDM:** Computar el `budgetBreakdown` inspeccionando las fases del equipo mediante `getPlansForTeam(teamId)`. Cada pilar sumará las actividades de sus objetivos y `executedTotalBudget` sumará las actividades con estado `'Completado'`.
3. **Consistencia de Techo Presupuestal:** El presupuesto total reflejará el presupuesto anual configurado para la misión (ej. `$ 15.000.000`), mostrando con exactitud el saldo restante disponible cuando no existan actividades creadas.
4. **Gobernanza y Modularidad:** Mantener estricto el límite de $\le 150$ líneas por archivo y tipado inmutable.

## Consecuencias
- Si un equipo no tiene objetivos creados, todos los pilares mostrarán `$ 0`, gastado `$ 0 (0%)` y quedará el 100% del presupuesto anual asignado.
- Al crear objetivos y actividades en cualquier pilar, el presupuesto de esa fase se actualizará dinámicamente sin requerir datos estáticos o duplicados.
- Se garantiza la fidelidad financiera entre PDM, Diagnóstico General y Backend.

