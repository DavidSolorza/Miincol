# Propuesta Técnica 027: Depuración Profunda del Backend, Estandarización de Etapas Canónicas, POO y Principios SOLID

## 1. Contexto y Requerimiento
El usuario ha definido la simplificación de etapas (stages) y la depuración del backend:
> *"oye simplifica estos stages porque hay varios que son sinonimos [...] hice estos arreglos en el codigo la idea es manejar esos termino solo esos porfa porque nos llenamos de otro y truncamos la logica.*
> *a raiz de esto que veo vamos a hacer una limpieza de codigo profunda en todas las vista tambien vamos a depurar, primero lo vamos a hacer con el back porfa, vamos a simplificar el codigo pero que funcione usando recursividad y POO.*
> *porque veo que hay muchas cosas repetidas y componentes que se pueden reutilizar, el codigo debe ser limpio de cosas que no se usen y estandarizar todas las variables vamos a usar la primera letra de cada palabra en mayusculas porfa y manejar todo asi porfa para evitar mismo nombres con diferentes combinaciones, revisemos los principios solid apliquemoslo o corrijamos lo que no este acorde"*

---

## 2. Diagnóstico del Backend Actual

1. **Duplicidad de Módulos:**
   - `backend/src/modules/plans/`: Módulo residual con un `create-activity.dto.ts` duplicado y un `plans.service.ts` en memoria redundante con `activities.service.ts`.
2. **Dispersión de Sinónimos de Etapas:**
   - Existían cadenas redundantes como `'Contacto primeros oyentes'`, `'Comunicar el evangelio'`, `'Respuesta al evangelio'`, `'Guiamos a reunirse'`, `'Consolidamos'`, `'Desarrollo Eclesial'`, `'Involucrar liderazgo...'`, etc.
   - En `objectives.service.ts` se usaban valores mockeados con estos sinónimos antiguos.
3. **Repetición de Código CRUD (Violación DRY / SRP):**
   - Los servicios `ActivitiesService`, `ObjectivesService`, `ReportsService`, `AuditService` repiten estructuras idénticas de búsqueda por ID, filtrado en arrays y manejo de `NotFoundException`.
4. **Falta de Cálculo Jerárquico Recursivo:**
   - Los cálculos de totales y presupuestos entre Fases, Objetivos y Actividades están dispersos en lugar de emplear un agregador recursivo basado en POO.

---

## 3. Alcance de la Solución Técnica (Fase 1: Backend)

### A. Estandarización de Etapas Canónicas (Stages)
Adoptar estrictamente los términos canónicos definidos por el usuario en `backend/src/common/validators/is-stage-consistent.validator.ts`:
```typescript
export const STAGES_BY_AREA_MAP: Record<string, string[]> = {
  Investigación: ['Contacto'],
  Encarnación: ['Contacto', 'Comunicar', 'Respuesta'],
  Evangelización: ['Respuesta', 'Reunirse', 'Consolidar'],
  Entrenamiento: ['Consolidar', 'Liderazgo', 'Desarrollo eclesial'],
  Autocuidado: ['Auto-cuidado'],
};
```
- Reemplazar todas las ocurrencias de sinónimos en mocks iniciales (`objectives.service.ts`, `initial-teams.data.ts`) por sus equivalentes canónicos.
- Crear el enum/tipo centralizado `StageEnum` para tipado fuerte y autocompletado seguro.

---

### B. Consolidación y Eliminación de Código Muerto
1. **Eliminar el módulo redundante `backend/src/modules/plans`:**
   - Redirigir el endpoint `/api/plans` o integrar sus operaciones en `activities.controller.ts` y `objectives.controller.ts`.
   - Eliminar el DTO duplicado `backend/src/modules/plans/dto/create-activity.dto.ts`.
   - Limpiar la importación en `AppModule`.

---

### C. Arquitectura POO, Principios SOLID y Recursividad
1. **Base CRUD Repository / Service (DRY & SRP):**
   - Crear una clase base abstracta `BaseInMemoryService<T>` en `backend/src/common/services/base-in-memory.service.ts` ($\le 80$ líneas) con métodos comunes:
     - `findAll()`, `findById()`, `removeById()`, `ensureExists()`.
   - `ActivitiesService`, `ObjectivesService`, `ReportsService` heredan de esta clase base reduciendo más de 120 líneas de código duplicado.
2. **Cálculo Jerárquico Recursivo (Tree Aggregator):**
   - Crear una clase POO `HierarchicalBudgetAggregator` en `backend/src/teams/helpers/hierarchical-budget.aggregator.ts` ($\le 90$ líneas) que recorra recursivamente el árbol:
     $$\text{Total}(Nodo) = \text{Presupuesto}(Nodo) + \sum_{h \in Hijos} \text{Total}(h)$$
   - Permite agregar presupuestos y estados de completitud a cualquier nivel del árbol ministerial de forma genérica.
3. **Estandarización de Nomenclatura (PascalCase para Entidades y Enums):**
   - Unificar constantes, enums y tipos para que cada palabra inicie con mayúscula en los nombres de negocio (`Contacto`, `Comunicar`, `Respuesta`, `Reunirse`, `Consolidar`, `Liderazgo`, `Desarrollo eclesial`, `Auto-cuidado`).

---

## 4. Plan de Pruebas Unitarias
1. Actualizar `is-stage-consistent.validator.spec.ts` para verificar exclusivamente las etapas canónicas.
2. Crear pruebas unitarias para `BaseInMemoryService` y `HierarchicalBudgetAggregator`.
3. Ejecutar `npm --prefix backend test` asegurando 100% de pruebas en verde.
4. Verificar que ningún archivo del backend supere el límite de 150 líneas.

---

## 5. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN DEL USUARIO.
- **Pausa Obligatoria:** No se modificará el código fuente hasta contar con la autorización explícita del usuario.

