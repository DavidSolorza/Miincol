# 🗄️ Especificación de Base de Datos y Modelo Físico Relacional
**Proyecto:** Plan Ministerial Misincol (PDM)  
**Motor:** PostgreSQL 16+  
**Autor:** Agente 3 (Principal DBA)  
**Estado:** Inmaculado / Listo para migración

---

## 1. Script DDL Ejecutable (PostgreSQL)

```sql
-- Habilitar extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Equipos Ministeriales
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    leader_name VARCHAR(150) NOT NULL,
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_team_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- 2. Tabla de Miembros del Equipo
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(80) DEFAULT 'Misionero' NOT NULL,
    email VARCHAR(180),
    phone VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) 
        REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT chk_member_name_not_empty CHECK (LENGTH(TRIM(full_name)) > 0)
);

-- 3. Tabla de Planes de Fase Ministerial
CREATE TYPE phase_type_enum AS ENUM (
    'investigacion', 
    'encarnacion', 
    'evangelizacion', 
    'entrenamiento', 
    'autocuidado'
);

CREATE TABLE phase_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL,
    phase_id phase_type_enum NOT NULL,
    phase_name VARCHAR(120) NOT NULL,
    start_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'En Curso' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_phase_plans_team FOREIGN KEY (team_id) 
        REFERENCES teams(id) ON DELETE RESTRICT,
    CONSTRAINT uq_team_phase UNIQUE (team_id, phase_id)
);

-- 4. Tabla de Objetivos Estratégicos
CREATE TABLE objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_plan_id UUID NOT NULL,
    objective_number SMALLINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_objectives_phase_plan FOREIGN KEY (phase_plan_id) 
        REFERENCES phase_plans(id) ON DELETE CASCADE,
    CONSTRAINT chk_objective_number CHECK (objective_number BETWEEN 1 AND 4),
    CONSTRAINT uq_phase_objective_number UNIQUE (phase_plan_id, objective_number)
);

-- 5. Tabla de Actividades del Plan
CREATE TYPE activity_state_enum AS ENUM (
    'Pendiente', 
    'En Proceso', 
    'Completado'
);

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objective_id UUID NOT NULL,
    stage VARCHAR(100) DEFAULT 'General' NOT NULL,
    description TEXT NOT NULL,
    current_situation TEXT DEFAULT '' NOT NULL,
    medium_term_goal TEXT DEFAULT '' NOT NULL,
    long_term_goal TEXT DEFAULT '' NOT NULL,
    responsible VARCHAR(150) NOT NULL,
    frequency VARCHAR(80) DEFAULT 'Mensual' NOT NULL,
    times_per_year INT DEFAULT 1 NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_weeks INT NOT NULL,
    remaining_weeks INT NOT NULL,
    unit_budget NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    total_budget NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    state activity_state_enum DEFAULT 'Pendiente' NOT NULL,
    obstacles TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_activities_objective FOREIGN KEY (objective_id) 
        REFERENCES objectives(id) ON DELETE CASCADE,
    CONSTRAINT chk_times_per_year_positive CHECK (times_per_year >= 0),
    CONSTRAINT chk_unit_budget_positive CHECK (unit_budget >= 0),
    CONSTRAINT chk_total_budget_positive CHECK (total_budget >= 0),
    CONSTRAINT chk_dates_order CHECK (end_date >= start_date)
);

-- Índices de Rendimiento
CREATE INDEX idx_teams_leader ON teams(leader_name);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_phase_plans_team_phase ON phase_plans(team_id, phase_id);
CREATE INDEX idx_objectives_phase_plan_id ON objectives(phase_plan_id);
CREATE INDEX idx_activities_objective_id ON activities(objective_id);
CREATE INDEX idx_activities_state ON activities(state);
```

---

## 2. Diccionario de Datos Exhaustivo

### 2.1. Entidad: `teams` (Equipos Ministeriales)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único universal del equipo misionero. |
| `name` | `VARCHAR(150)` | `NOT NULL, CHECK (len > 0)` | Nombre oficial del equipo o misión comunitaria. |
| `leader_name` | `VARCHAR(150)` | `NOT NULL` | Nombre del misionero o pastor líder responsable. |
| `region` | `VARCHAR(100)` | `NOT NULL` | Región o etnia indígena en Colombia (ej. Guajira, Cauca, Amazonas). |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Fecha y hora de creación del registro. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Fecha y hora de última modificación. |

### 2.2. Entidad: `team_members` (Miembros de Equipo)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único del miembro misionero. |
| `team_id` | `UUID` | `FK (teams.id) ON DELETE CASCADE, NOT NULL` | Relación con el equipo asignado. |
| `full_name` | `VARCHAR(150)` | `NOT NULL` | Nombre completo del colaborador o misionero. |
| `role` | `VARCHAR(80)` | `NOT NULL, DEFAULT 'Misionero'` | Rol desempeñado (ej. Tesorero, Capacitador, Enlace Comunitario). |
| `email` | `VARCHAR(180)` | `NULLABLE` | Correo electrónico para notificaciones. |
| `phone` | `VARCHAR(30)` | `NULLABLE` | Teléfono o número WhatsApp de contacto en territorio. |

### 2.3. Entidad: `phase_plans` (Planes de Fase PDM)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único de la fase planificada. |
| `team_id` | `UUID` | `FK (teams.id) ON DELETE RESTRICT, NOT NULL` | Identificador del equipo ejecutor. |
| `phase_id` | `phase_type_enum` | `NOT NULL, UNIQUE (team_id, phase_id)` | Etiqueta de la fase (`investigacion`, `encarnacion`, etc.). |
| `phase_name` | `VARCHAR(120)` | `NOT NULL` | Nombre descriptivo de la fase para visualización. |
| `start_date` | `DATE` | `NOT NULL` | Fecha de inicio formal de la fase ministerial. |
| `status` | `VARCHAR(30)` | `NOT NULL, DEFAULT 'En Curso'` | Estado global de la fase. |

### 2.4. Entidad: `objectives` (Objetivos Estratégicos)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador inmutable del objetivo. |
| `phase_plan_id` | `UUID` | `FK (phase_plans.id) ON DELETE CASCADE, NOT NULL` | Fase a la que pertenece el objetivo. |
| `objective_number` | `SMALLINT` | `NOT NULL, CHECK (1..4)` | Número de cuadrante de objetivo (1, 2, 3 o 4). |
| `title` | `VARCHAR(255)` | `NOT NULL` | Título sintético del objetivo de área. |
| `description` | `TEXT` | `NOT NULL` | Declaración detallada del alcance y propósito del objetivo. |

### 2.5. Entidad: `activities` (Actividades y Presupuesto)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador de la actividad. |
| `objective_id` | `UUID` | `FK (objectives.id) ON DELETE CASCADE, NOT NULL` | Objetivo al que tributa la acción. |
| `stage` | `VARCHAR(100)` | `NOT NULL, DEFAULT 'General'` | Etapa o subcategoría operativa. |
| `description` | `TEXT` | `NOT NULL` | Descripción de la actividad a ejecutar en territorio. |
| `current_situation` | `TEXT` | `NOT NULL, DEFAULT ''` | Diagnóstico previo de la situación comunitaria. |
| `medium_term_goal` | `TEXT` | `NOT NULL, DEFAULT ''` | Meta esperada a mediano plazo (6 a 12 meses). |
| `long_term_goal` | `TEXT` | `NOT NULL, DEFAULT ''` | Meta esperada a largo plazo (2 a 5 años). |
| `responsible` | `VARCHAR(150)` | `NOT NULL` | Persona o dupla responsable de la ejecución. |
| `frequency` | `VARCHAR(80)` | `NOT NULL` | Periodicidad (ej. Semanal, Mensual, Bimensual, Única). |
| `times_per_year` | `INT` | `NOT NULL, CHECK (>= 0)` | Frecuencia de repetición anual para cómputo presupuestario. |
| `start_date` | `DATE` | `NOT NULL` | Fecha prevista de inicio de la actividad. |
| `end_date` | `DATE` | `NOT NULL, CHECK (end_date >= start_date)` | Fecha límite de cumplimiento. |
| `total_weeks` | `INT` | `NOT NULL` | Cantidad total de semanas programadas. |
| `remaining_weeks` | `INT` | `NOT NULL` | Semanas restantes calculadas según calendario. |
| `unit_budget` | `NUMERIC(14, 2)` | `NOT NULL, CHECK (>= 0)` | Presupuesto unitario en pesos colombianos (COP). |
| `total_budget` | `NUMERIC(14, 2)` | `NOT NULL, CHECK (>= 0)` | Presupuesto total: `unit_budget * times_per_year`. |
| `state` | `activity_state_enum` | `NOT NULL, DEFAULT 'Pendiente'` | Estado del ciclo de vida ('Pendiente', 'En Proceso', 'Completado'). |
| `obstacles` | `TEXT` | `NOT NULL, DEFAULT ''` | Dificultades, clima, transporte o contingencias territoriales. |
