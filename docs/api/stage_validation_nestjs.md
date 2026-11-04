# Especificación y Contrato DTO: Validación de Etapas por Pilar (NestJS)

Este documento detalla la implementación y validación recomendada para el backend en **NestJS** utilizando `class-validator` y `class-transformer`, asegurando que la base de datos relacional y las APIs REST preserven la integridad entre el **Pilar / Área Esencial** y la **Etapa (Stage)** de cada actividad u objetivo ministerial.

---

## 1. Mapeo Canónico de Dominio

| Pilar / Área Esencial (`essentialArea`) | Etapas Permitidas (`stage`) | Enfoque Territorial |
| :--- | :--- | :--- |
| **Investigación** | `Contacto primeros oyentes` | Inmersión inicial de campo |
| **Encarnación** | `Comunicar el evangelio` | Encarnación contextual y testimonio |
| **Evangelización** | `Respuesta al evangelio`<br>`Guiamos a reunirse`<br>`Consolidamos` | Proclamación, discipulado y grupos de comunión |
| **Entrenamiento** | `Liderazgo`<br>`Desarrollo Eclesial`<br>`Involucrar liderazgo en el proceso`<br>`Pluralidad de liderazgo` | Maduración del liderazgo autóctono |
| **Autocuidado** | `Auto Cuidado del Misionero`<br>`ADN Multiplicador`<br>`Salida progresiva` | Sostenibilidad personal y del equipo misionero |
| **General** | `ADN Multiplicador`<br>`Salida progresiva`<br>`Auto Cuidado del Misionero`<br>`General` | Procesos transversales |

---

## 2. Implementación de Decorador Personalizado (`class-validator`)

Para evitar almacenar etapas no correspondientes a un pilar, se recomienda definir un validador personalizado en NestJS:

```typescript
// src/common/validators/is-stage-consistent.validator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const STAGES_BY_AREA_MAP: Record<string, string[]> = {
  Investigación: ['Contacto primeros oyentes'],
  Encarnación: ['Comunicar el evangelio'],
  Evangelización: ['Respuesta al evangelio', 'Guiamos a reunirse', 'Consolidamos'],
  Entrenamiento: [
    'Liderazgo',
    'Desarrollo Eclesial',
    'Involucrar liderazgo en el proceso',
    'Pluralidad de liderazgo',
  ],
  Autocuidado: [
    'Auto Cuidado del Misionero',
    'ADN Multiplicador',
    'Salida progresiva',
  ],
  General: [
    'ADN Multiplicador',
    'Salida progresiva',
    'Auto Cuidado del Misionero',
    'General',
  ],
};

@ValidatorConstraint({ name: 'isStageConsistentWithArea', async: false })
export class IsStageConsistentWithAreaConstraint implements ValidatorConstraintInterface {
  validate(stage: string, args: ValidationArguments) {
    const object = args.object as { essentialArea?: string };
    const area = object.essentialArea || 'Investigación';
    const allowed = STAGES_BY_AREA_MAP[area] || [];
    return allowed.includes(stage);
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as { essentialArea?: string };
    const area = object.essentialArea || 'desconocida';
    return `La etapa '$value' no es válida para el área esencial '${area}'.`;
  }
}

export function IsStageConsistentWithArea(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStageConsistentWithAreaConstraint,
    });
  };
}
```

---

## 3. Definición del DTO en NestJS

```typescript
// src/modules/plans/dto/create-activity.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsStageConsistentWithArea } from '../../../common/validators/is-stage-consistent.validator';

export class CreateActivityDto {
  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'General'])
  @IsNotEmpty()
  essentialArea: string;

  @IsString()
  @IsNotEmpty()
  @IsStageConsistentWithArea()
  stage: string;

  @IsEnum(['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'])
  @IsOptional()
  areaLevel?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  responsible: string;

  @IsString()
  frequency: string;

  @IsNumber()
  @Min(1)
  timesPerYear: number;

  @IsNumber()
  @Min(0)
  unitBudget: number;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
```

---

## 4. Esquema de Base de Datos Relacional (PostgreSQL / TypeORM o Prisma)

En PostgreSQL, se recomienda agregar una restricción `CHECK` a nivel de tabla si se desea forzar la regla en el motor:

```sql
ALTER TABLE activities
ADD CONSTRAINT check_stage_consistency
CHECK (
  (essential_area = 'Investigación' AND stage IN ('Contacto primeros oyentes')) OR
  (essential_area = 'Encarnación' AND stage IN ('Comunicar el evangelio')) OR
  (essential_area = 'Evangelización' AND stage IN ('Respuesta al evangelio', 'Guiamos a reunirse', 'Consolidamos')) OR
  (essential_area = 'Entrenamiento' AND stage IN ('Liderazgo', 'Desarrollo Eclesial', 'Involucrar liderazgo en el proceso', 'Pluralidad de liderazgo')) OR
  (essential_area = 'Autocuidado' AND stage IN ('Auto Cuidado del Misionero', 'ADN Multiplicador', 'Salida progresiva')) OR
  (essential_area = 'General' AND stage IN ('ADN Multiplicador', 'Salida progresiva', 'Auto Cuidado del Misionero', 'General'))
);
```

