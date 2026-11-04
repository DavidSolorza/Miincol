# Propuesta Técnica 004: Mapeo de Etapas Dinámicas por Pilar (Área Esencial) y Contrato de Validación

**Fecha:** 2026-11-03  
**Estado:** PENDIENTE DE REVISIÓN Y FEEDBACK DEL USUARIO  
**Gobernanza:** Technical Governance Contract v2026.4.0 (Máximo 150 líneas por archivo)

---

## 1. Contexto y Justificación (El Qué y El Por Qué)

Actualmente, el campo `stage` (Etapa) en las actividades ministeriales no cuenta con una restricción guiada ni con un catálogo estandarizado según el pilar ministerial correspondiente. El cliente requiere que cada actividad (y opcionalmente objetivo) esté estrictamente enmarcada en las etapas naturales del ciclo de plantación y desarrollo eclesial:

1. **Investigación**:
   - `Contacto primeros oyentes` (Etapa inicial de campo).
2. **Encarnación**:
   - `Comunicar el evangelio` (Inmersión y transmisión del mensaje).
3. **Evangelización**:
   - `Respuesta al evangelio`
   - `Guiamos a reunirse`
   - `Consolidamos`
4. **Entrenamiento**:
   - `Liderazgo`
   - `Desarrollo Eclesial`
   - `Involucrar liderazgo en el proceso`
   - `Pluralidad de liderazgo`
5. **Autocuidado / Ejes Transversales**:
   - `ADN Multiplicador`
   - `Salida progresiva`
   - `Auto Cuidado del Misionero`

### Problema que resuelve:
- Evita que los equipos asignen etapas incongruentes a un pilar (por ejemplo, asignar "Desarrollo Eclesial" bajo "Investigación").
- Provee un **filtro dinámico en cascada** en la interfaz de usuario: al seleccionar el Pilar / Área Esencial, el desplegable de Etapa solo muestra las opciones correspondientes a dicho pilar.
- Estandariza el contrato de datos para la futura API de NestJS con validaciones `@IsEnum` / condicionales de `class-validator`.

---

## 2. Arquitectura de la Solución (Frontend Angular)

### 2.1. Capa de Dominio (`src/features/plans/domain/plan.types.ts`)
- Definición de tipos literales puros y diccionario inmutable:
```typescript
export type ActivityStage =
  | 'Contacto primeros oyentes'
  | 'Comunicar el evangelio'
  | 'Respuesta al evangelio'
  | 'Guiamos a reunirse'
  | 'Consolidamos'
  | 'Liderazgo'
  | 'Desarrollo Eclesial'
  | 'Involucrar liderazgo en el proceso'
  | 'Pluralidad de liderazgo'
  | 'ADN Multiplicador'
  | 'Salida progresiva'
  | 'Auto Cuidado del Misionero'
  | 'General';

export const STAGES_BY_AREA: Record<EssentialArea, readonly ActivityStage[]> = {
  Investigación: ['Contacto primeros oyentes'],
  Encarnación: ['Comunicar el evangelio'],
  Evangelización: ['Respuesta al evangelio', 'Guiamos a reunirse', 'Consolidamos'],
  Entrenamiento: ['Liderazgo', 'Desarrollo Eclesial', 'Involucrar liderazgo en el proceso', 'Pluralidad de liderazgo'],
  Autocuidado: ['Auto Cuidado del Misionero', 'ADN Multiplicador', 'Salida progresiva'],
  General: ['ADN Multiplicador', 'Salida progresiva', 'Auto Cuidado del Misionero', 'General'],
};
```

### 2.2. Capa de Infraestructura (Componentes UI y Cascada Dinámica)
- **`activity-basic-fields.component.ts`**:
  - Incorporación de un `<select>` de `Etapa` alimentado de forma reactiva por `STAGES_BY_AREA[essentialArea() || 'General']`.
  - Cuando el usuario cambia de Área Esencial, se autoselecciona la primera etapa válida del nuevo pilar para evitar inconsistencias de estado.
- **`activityModalDefaults.ts`**:
  - Inicialización de `stage` con la primera etapa permitida del área seleccionada.
- **`objective-form-fields.component.ts` / `objective-modal.component.ts`**:
  - Adición de selector de etapa o enfoque de etapa vinculado al pilar del objetivo.

---

## 3. Especificación de Contrato y Validación para NestJS (`docs/api/`)

En el backend NestJS, el DTO de creación/actualización de actividades (`CreateActivityDto`, `UpdateActivityDto`) validará la coherencia entre `essentialArea` y `stage`:

```typescript
// Ejemplo de validación personalizada o decorador en NestJS
import { IsEnum, IsNotEmpty, ValidateIf, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export class CreateActivityDto {
  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'General'])
  essentialArea: EssentialArea;

  @IsNotEmpty()
  @IsStageConsistentWithArea({
    message: 'La etapa seleccionada no pertenece al Área Esencial indicada',
  })
  stage: string;
}
```

---

## 4. Impacto Modular y Límites de Código (< 150 Líneas)

| Archivo | Acción | Líneas Estimadas |
| :--- | :---: | :---: |
| `src/features/plans/domain/plan.types.ts` | Extender tipos y mapa inmutable `STAGES_BY_AREA` | ~90 líneas (< 150) |
| `src/features/plans/infrastructure/activityModal/activity-basic-fields.component.ts` | Agregar selector dinámico de etapas | ~135 líneas (< 150) |
| `src/features/plans/infrastructure/activityModal/activityModalDefaults.ts` | Ajustar defaults de etapa según área | ~75 líneas (< 150) |
| `src/features/plans/infrastructure/objectiveModal/objective-form-fields.component.ts` | Incluir etapa asociada al pilar del objetivo | ~140 líneas (< 150) |
| `docs/api/stage_validation_nestjs.md` | Documentación del contrato NestJS DTO | Documentación viva |

---

## 5. Próximo Paso
Conforme al protocolo de gobernanza, esperamos tu visto bueno o cualquier ajuste antes de proceder con la modificación de código.

