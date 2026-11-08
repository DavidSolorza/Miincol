# Propuesta Técnica 023: Control de Límite Presupuestal y Visualización de Saldo Restante ("Cuánto he gastado y cuánto queda")

## 1. Contexto y Justificación Ministerial
El usuario ha establecido una directriz financiera clara para la administración de los planes de misión:
> *"La idea es que no se puedan mostrar valores que superen lo anual... que vaya mostrando cuánto queda para tener una imagen visual de cuánto dinero he gastado y cuánto queda."*

### Diagnóstico Actual:
1. **Falta de visibilidad del saldo en pesos:** En *Información General* y en las tarjetas del *Dashboard*, el sistema muestra el porcentaje global de ejecución y el presupuesto total, pero no detalla de forma explícita el **monto en dinero ejecutado/gastado** ni el **saldo disponible restante** en pesos (\$ COP).
2. **Ausencia de control de sobregiro:** Al planificar o editar actividades y sus presupuestos mensuales, no existe un validador que impida registrar montos que excedan el tope anual asignado a la misión territorial.

---

## 2. Alcance de la Solución Técnica

### A. Componente Visual de Ejecución Financiera ("Gastado vs. Restante")
En [`GeneralBudgetTopComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/general-info/infrastructure/components/general-budget-top.component.ts) y en [`TeamCardMetricsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/admin/infrastructure/teamCard/team-card-metrics.component.ts):
- Incorporar dos indicadores monetarios de alto contraste:
  - **Gastado / Ejecutado:** $\text{Monto en COP} + (\% \text{ del total})$.
  - **Saldo Restante Disponible:** $(\text{Presupuesto Total} - \text{Ejecutado}) + (\% \text{ restante})$.
- **Semáforo Visual en la Barra de Progreso:**
  - $\le 80\%$: Color Esmeralda (`bg-emerald-600`) — Operación dentro de los parámetros previstos.
  - $81\% - 99\%$: Color Ámbar (`bg-amber-500`) — Alerta de consumo cercano al límite anual.
  - $\ge 100\%$: Color Rojo/Vino (`bg-[#8B251E]`) — Límite anual alcanzado.

### B. Validación de Límite Presupuestal en Creación y Edición de Actividades
En el modal de actividades y en la edición rápida de presupuesto:
- **Cálculo en tiempo real del saldo disponible:**  
  $$\text{Saldo Disponible} = \text{Presupuesto Anual del Equipo} - \text{Total de Actividades Planificadas}$$
- **Restricción de Sobregiro:** Si una nueva actividad o edición supera el saldo disponible restante, el sistema desactiva el botón de guardar y muestra un mensaje informativo:  
  `⚠️ El valor excede el presupuesto anual asignado ($11.210.000). Saldo máximo disponible: $X COP.`

### C. Coherencia en Backend (Validación de Integridad)
En NestJS [`TeamsService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/teams.service.ts) y [`TeamBudgetCalculator`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/helpers/team-budget.calculator.ts):
- Incorporar `remainingBudget = Math.max(0, totalBudget - executedBudget)`.
- Garantizar que los resúmenes y KPIs devuelvan `remainingBudget` y `remainingPercentage`.

---

## 3. Arquitectura y Reglas de Gobernanza
- **Límite Estricto:** Cada archivo modificado se mantendrá rigurosamente $\le 150$ líneas.
- **Suite de Pruebas:** Se actualizarán las pruebas unitarias existentes y se agregarán casos de prueba específicos para:
  - Cálculo de saldo restante (`remainingBudget`) y porcentajes.
  - Bloqueo o advertencia de sobregiro presupuestal.
- **Cero SDKs Comerciales:** Lógica matemática pura en Angular Signals y NestJS.

---

## 4. Estado de Gobernanza
- **Estado:** Pendiente de Aprobación Explícita del Usuario.
- **Pausa Obligatoria:** El agente no modificará ningún archivo de código hasta recibir la confirmación del usuario.

