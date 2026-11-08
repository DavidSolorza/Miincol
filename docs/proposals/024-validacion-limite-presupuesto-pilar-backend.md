# Propuesta Técnica 024: Validación de Límite Presupuestal por Pilar en Backend NestJS

## 1. Contexto y Requerimiento
El usuario ha definido una regla de negocio financiera estricta para el backend:
> *"El presupuesto de cada pilar no puede pasar al presupuesto anual. Revisa eso en el back por favor."*

### Diagnóstico en Backend:
Actualmente, la entidad `Team` en NestJS (`backend/src/teams/entities/team.entity.ts`) y el servicio [`TeamsService`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/teams.service.ts) permiten actualizar el campo `pillarBudgets` y `totalBudget` sin una validación explícita que bloquee cuando un pilar (o la sumatoria de los pilares) excede el presupuesto anual total asignado a la misión territorial.

---

## 2. Alcance de la Solución Técnica

### A. Validador Centralizado de Presupuesto por Pilar
- **Ubicación:** `backend/src/teams/validators/pillar-budget.validator.ts`.
- **Reglas Inviolables:**
  1. **Límite Individual por Pilar:** Ningún pilar estratégico (`investigacion`, `encarnacion`, `evangelizacion`, `entrenamiento`, `autocuidado`) puede superar el presupuesto anual (`totalBudget`) del equipo:
     $$\forall p \in \text{pilares}: \text{pillarBudgets}[p] \le \text{totalBudget}$$
  2. **Límite de Sumatoria Global:** La suma de los recursos asignados a todos los pilares no puede superar el presupuesto anual del equipo:
     $$\sum_{p} \text{pillarBudgets}[p] \le \text{totalBudget}$$
  3. **Excepción Estructurada:** Si se viola cualquiera de las condiciones, lanza `BadRequestException` con mensaje descriptivo en español:
     `"El presupuesto del pilar '[pilar]' ($X COP) no puede superar el presupuesto anual del equipo ($Y COP)."`
     o bien:
     `"La suma total de los presupuestos por pilar ($X COP) supera el presupuesto anual asignado ($Y COP)."`

### B. Integración en `TeamsService`
En [`TeamsService.create`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/teams.service.ts) y [`TeamsService.update`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/backend/src/teams/teams.service.ts):
- Al recibir `pillarBudgets` o una actualización de `totalBudget`, se ejecuta la validación antes de persistir los cambios en `backend/data/teams.json`.

---

## 3. Plan de Pruebas Unitarias e Integración
1. Crear `backend/src/teams/validators/pillar-budget.validator.spec.ts` validando:
   - Aprobación cuando cada pilar y la suma están dentro del límite anual.
   - Rechazo de pilar individual que supere el presupuesto anual.
   - Rechazo de sumatoria de pilares que sobrepase el presupuesto anual.
   - Manejo seguro de valores nulos o no definidos.
2. Actualizar `backend/src/teams/teams.service.spec.ts` para verificar el bloqueo en `TeamsService.update`.
3. Ejecutar `npm --prefix backend run test` asegurando el 100% de pruebas en verde.

---

## 4. Estado de Gobernanza
- **Límite de Líneas:** Todos los archivos nuevos y modificados se mantendrán estrictamente $\le 150$ líneas.
- **Estado:** Pendiente de Aprobación Explícita del Usuario.
- **Pausa Obligatoria:** No se modificará el código fuente del backend hasta recibir la confirmación del usuario.

