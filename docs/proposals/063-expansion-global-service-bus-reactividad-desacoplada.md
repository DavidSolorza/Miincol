# Propuesta Técnica 063: Expansión Global del Service Bus para Máxima Fluidez y Menor Carga

## 1. Contexto y Diagnóstico
El usuario ha solicitado aplicar el patrón **Service Bus a toda la aplicación** con el fin de obtener mayor fluidez operativa, reducir la sobrecarga de re-renderizado innecesario y desacoplar la comunicación entre vistas y módulos.

### Diagnóstico de la Arquitectura Actual
1. **Service Bus Existente (`src/core/bus/`):**
   - Ya cuenta con `ServiceBusCore` con despacho asíncrono no bloqueante vía `queueMicrotask` para 60/120 FPS.
   - Ya es utilizado puntualmente para `ui:toast`, `network:status`, `auth:logout` y `audit:log`.
2. **Oportunidades de Mejora y Desacoplamiento:**
   - **Prop Drilling en Equipos:** Vistas como `SuperAdminViewComponent`, `SuperAdminTeamsGridComponent` y `AppWorkspaceComponent` encadenan múltiples eventos (`selectTeamId`, `inspectTeam`, `editTeam`, `deleteTeam`) a través de `@Output()` en cascada de hasta 4 niveles, obligando a re-renderizar componentes contenedores intermedios.
   - **Mutaciones de Equipos Desconectadas:** Cuando se crea, edita o elimina un equipo en `AdminDashboardService`, las vistas no suscritos directamente al servicio dependen de ciclos completos de detección de cambios de Angular.
   - **Ciclo de Vida de Planes y Actividades:** Las actualizaciones de estado y presupuesto en `activity-item` y `objective-card` pueden notificar al bus para actualizar telemetría, métricas de cabecera y outbox sin acoplamiento estrecho.

---

## 2. Plan de Implementación Modular

### A. Tipado Expandido en `AppEventMap` (`src/core/bus/bus.types.ts`)
Incorporar eventos canónicos para todo el ciclo de vida de la aplicación:
- **Equipos:**
  - `'team:created'`: `{ team: TeamSupervisionSummary }`
  - `'team:updated'`: `{ teamId: string; updates: Partial<TeamSupervisionSummary> }`
  - `'team:deleted'`: `{ teamId: string }`
  - `'team:select'`: `{ teamId: string }`
  - `'team:inspect'`: `{ teamId: string }`
- **Planes y Actividades:**
  - `'activity:updated'`: `{ activityId: string; teamId: string; phaseId: string; updatedFields: Partial<Activity> }`
  - `'activity:created'`: `{ activityId: string; teamId: string; phaseId: string }`
  - `'activity:deleted'`: `{ activityId: string; teamId: string; phaseId: string }`
  - `'pdm:phase_switch'`: `{ phaseId: string }`
- **Interfaz y Modales:**
  - `'ui:modal'`: `{ modal: 'team' | 'notes' | 'audit' | 'report' | 'special_expense'; open: boolean; data?: any }`

### B. Emisión y Suscripción Asíncrona en Servicios de Dominio
1. **`AdminDashboardService`:**
   - Al crear, editar o eliminar equipos (`handleCreateTeam`, `handleUpdateTeam`, `handleDeleteTeam`), publicar `'team:created'`, `'team:updated'`, `'team:deleted'` a través del bus.
   - Escuchar `'team:select'` e `'team:inspect'` para sincronizar el estado global sin recargar la jerarquía visual.
2. **`PlanService`:**
   - Al modificar o cambiar estado de actividades (`updateActivity`, `addActivity`, `deleteActivity`), publicar `'activity:updated'` para que los contadores de cabecera y telemetría se refresquen en microtareas independientes.
3. **Desacoplamiento en Componentes UI:**
   - Las tarjetas de equipo (`team-overview-card`) y selectores emitirán directamente a través de `serviceBus.publish(...)`, reduciendo el anidamiento de `@Output()` y garantizando transiciones a 60 FPS sin bloqueos en el hilo principal.

---

## 3. Beneficios Técnicos y de Rendimiento
- **Cero Bloqueo de UI:** Despacho en `queueMicrotask` desacoplado del ciclo síncrono del navegador.
- **Menor Consumo de Memoria y CPU:** Eliminación de cadenas complejas de EventEmitter en componentes anidados.
- **Arquitectura Event-Driven Limpia:** Respeto estricto a Vertical Slicing y al límite de $\le 150$ líneas por archivo.

---

## 4. Estado de Ejecución y Pruebas
- [x] Análisis técnico y diseño conceptual completado.
- [x] Expansión del contrato de eventos en `bus.types.ts` (`team:created`, `team:updated`, `team:deleted`, `activity:created`, `activity:updated`, `activity:deleted`, `pdm:phase_switch`, `ui:modal`).
- [x] Integración en `AdminDashboardService` para emisión asíncrona no bloqueante de ciclo de vida de misiones territoriales.
- [x] Integración en `PlanService` para actualización de actividades y cambio de fase vía microtareas del Service Bus.
- [x] Integración en componentes UI (`team-overview-card.component.ts`, `sidebar-phases-list.component.ts`) para desacoplar el prop-drilling de eventos.
- [x] Creación de suite de pruebas unitarias en `serviceBus.spec.ts`.
- [x] Verificación total de Vitest: 24 suites y 88/88 pruebas aprobadas (100% de éxito).
- [x] Compilación de producción (`vite build`) completada exitosamente en 28.11s.
