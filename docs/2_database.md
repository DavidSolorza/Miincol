# 🗄️ Especificación de Base de Datos y Modelo Físico Relacional
**Proyecto:** Plan Ministerial Misincol (PDM) & Portal Territorial  
**Motor:** PostgreSQL 16+  
**Autor:** Agente 3 (Principal DBA)  
**Estado:** Inmaculado / Listo para migración

---

## 1. Script DDL Ejecutable (PostgreSQL)

```sql
-- Habilitar extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tipos Enumerados de Dominio
CREATE TYPE health_status_enum AS ENUM (
    'Optimo', 
    'Atención', 
    'Crítico'
);

CREATE TYPE phase_type_enum AS ENUM (
    'investigacion', 
    'encarnacion', 
    'evangelizacion', 
    'entrenamiento', 
    'autocuidado'
);

CREATE TYPE activity_state_enum AS ENUM (
    'Pendiente', 
    'En Proceso', 
    'Completado'
);

-- 2. Tabla de Equipos / Misiones Territoriales
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(60) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    ethnicity VARCHAR(100) NOT NULL,
    region VARCHAR(120) NOT NULL,
    department VARCHAR(100) NOT NULL,
    leader_name VARCHAR(150) NOT NULL,
    leader_phone VARCHAR(30) NOT NULL,
    members_count INT DEFAULT 1 NOT NULL,
    current_phase_id phase_type_enum DEFAULT 'investigacion' NOT NULL,
    current_phase_name VARCHAR(120) DEFAULT '1. Investigación' NOT NULL,
    progress_percentage INT DEFAULT 0 NOT NULL,
    total_budget NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    executed_budget NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    theme_color VARCHAR(20) DEFAULT '#8B251E' NOT NULL,
    health_status health_status_enum DEFAULT 'Optimo' NOT NULL,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    access_pin VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_team_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT chk_team_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_members_count_positive CHECK (members_count >= 1),
    CONSTRAINT chk_progress_range CHECK (progress_percentage BETWEEN 0 AND 100),
    CONSTRAINT chk_total_budget_positive CHECK (total_budget >= 0),
    CONSTRAINT chk_executed_budget_positive CHECK (executed_budget >= 0)
);

-- 3. Tabla de Miembros del Equipo
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

-- 4. Tabla de Alertas Territoriales Críticas
CREATE TABLE team_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT fk_team_alerts_team FOREIGN KEY (team_id) 
        REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT chk_alert_type CHECK (alert_type IN ('Salud', 'Logística', 'Seguridad', 'Institucional'))
);

-- 5. Tabla de Planes de Fase Ministerial
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
        REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT uq_team_phase UNIQUE (team_id, phase_id)
);

-- 6. Tabla de Objetivos Estratégicos
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

-- 7. Tabla de Actividades del Plan
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objective_id UUID NOT NULL,
    stage VARCHAR(100) DEFAULT 'General' NOT NULL,
    description TEXT NOT NULL,
    current_situation TEXT DEFAULT '' NOT NULL,
    short_term_goal TEXT DEFAULT '' NOT NULL,
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

-- Índices B-Tree de Alto Rendimiento
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_teams_ethnicity ON teams(ethnicity);
CREATE INDEX IF NOT EXISTS idx_teams_department ON teams(department);
CREATE INDEX IF NOT EXISTS idx_teams_phase ON teams(current_phase_id);
CREATE INDEX IF NOT EXISTS idx_teams_health ON teams(health_status);
CREATE INDEX IF NOT EXISTS idx_phase_plans_team_phase ON phase_plans(team_id, phase_id);
CREATE INDEX IF NOT EXISTS idx_objectives_phase_plan_id ON objectives(phase_plan_id);
CREATE INDEX IF NOT EXISTS idx_activities_objective_id ON activities(objective_id);
CREATE INDEX IF NOT EXISTS idx_activities_state ON activities(state);
```

---

## 2. Diccionario de Datos Exhaustivo

### 2.1. Entidad: `teams` (Equipos y Misiones Territoriales)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único universal del equipo misionero. |
| `slug` | `VARCHAR(60)` | `UNIQUE, NOT NULL` | Identificador alfanumérico en minúsculas para acceso directo a URL (ej. `team-wayuu`). |
| `name` | `VARCHAR(150)` | `NOT NULL, CHECK (len > 0)` | Nombre oficial de la misión territorial. |
| `ethnicity` | `VARCHAR(100)` | `NOT NULL` | Etnia o pueblo indígena asociado (ej. Wayuu, Nasa, Emberá, Misak). |
| `region` | `VARCHAR(120)` | `NOT NULL` | Asentamiento territorial o resguardo. |
| `department` | `VARCHAR(100)` | `NOT NULL` | Departamento colombiano de la misión. |
| `leader_name` | `VARCHAR(150)` | `NOT NULL` | Pastor o líder ministerial responsable en campo. |
| `leader_phone` | `VARCHAR(30)` | `NOT NULL` | Número telefónico / WhatsApp del líder para comunicación directa. |
| `members_count` | `INT` | `NOT NULL, DEFAULT 1` | Cantidad de obreros desplegados en el territorio. |
| `current_phase_id` | `phase_type_enum` | `NOT NULL, DEFAULT 'investigacion'` | Fase actual del ciclo de vida PDM. |
| `current_phase_name` | `VARCHAR(120)` | `NOT NULL` | Nombre legible de la fase ministerial activa. |
| `progress_percentage`| `INT` | `NOT NULL, DEFAULT 0, CHECK (0..100)` | Porcentaje ponderado de avance del plan. |
| `total_budget` | `NUMERIC(14, 2)` | `NOT NULL, DEFAULT 0.00` | Presupuesto total asignado a la fase en pesos COP. |
| `executed_budget` | `NUMERIC(14, 2)` | `NOT NULL, DEFAULT 0.00` | Presupuesto ejecutado hasta la fecha en COP. |
| `theme_color` | `VARCHAR(20)` | `NOT NULL, DEFAULT '#8B251E'` | Color hexadecimal de identidad visual del equipo territorial. |
| `health_status` | `health_status_enum`| `NOT NULL, DEFAULT 'Optimo'` | Semáforo de salud operativa ('Optimo', 'Atención', 'Crítico'). |
| `access_pin` | `VARCHAR(255)` | `NULLABLE` | Clave o hash de acceso seguro para el equipo territorial. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Estampa de tiempo de alta en el sistema. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Estampa de tiempo de última actualización. |

### 2.2. Entidad: `phase_plans` (Planes de Fase Ministerial)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único del plan de fase. |
| `team_id` | `UUID` | `FOREIGN KEY, NOT NULL, ON DELETE CASCADE` | Enlace al equipo misionero dueño de la fase. |
| `phase_id` | `phase_type_enum` | `NOT NULL` | Identificador canónico de la fase ('investigacion', 'encarnacion', etc.). |
| `phase_name` | `VARCHAR(120)` | `NOT NULL` | Título legible de la fase (ej. '1. Investigación'). |
| `start_date` | `DATE` | `NOT NULL` | Fecha de inicio programada de la fase. |
| `status` | `VARCHAR(30)` | `NOT NULL, DEFAULT 'En Curso'` | Estado de la fase ('En Curso', 'Completada', 'Pausada'). |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Creación del registro. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Modificación del registro. |

### 2.3. Entidad: `objectives` (Objetivos Estratégicos por Fase - Cota Máxima: 4)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único del objetivo estratégico. |
| `phase_plan_id` | `UUID` | `FOREIGN KEY, NOT NULL, ON DELETE CASCADE` | Fase ministerial contenedora. |
| `objective_number` | `SMALLINT` | `NOT NULL, CHECK (objective_number BETWEEN 1 AND 4)` | **Regla Mandatoria:** Posición del objetivo (1, 2, 3 o 4). Máximo 4 objetivos permitidos por fase. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Título conciso del objetivo estratégico. |
| `description` | `TEXT` | `NOT NULL` | Justificación, metas territoriales y descripción contextual. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Creación del registro. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Modificación del registro. |

### 2.4. Entidad: `activities` (Iniciativas / Tareas del Objetivo)
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador de la actividad. |
| `objective_id` | `UUID` | `FOREIGN KEY, NOT NULL, ON DELETE CASCADE` | Objetivo al que pertenece la iniciativa. |
| `stage` | `VARCHAR(100)` | `NOT NULL, DEFAULT 'General'` | Etapa o categoría técnica (ej. 'Investigación Social'). |
| `description` | `TEXT` | `NOT NULL` | Descripción de la actividad planificada. |
| `current_situation` | `TEXT` | `NOT NULL, DEFAULT ''` | Diagnóstico de situación actual. |
| `short_term_goal` | `TEXT` | `NOT NULL, DEFAULT ''` | Meta a corto plazo (3-6 meses). |
| `medium_term_goal` | `TEXT` | `NOT NULL, DEFAULT ''` | Meta a mediano plazo (6-12 meses). |
| `long_term_goal` | `TEXT` | `NOT NULL, DEFAULT ''` | Meta a largo plazo (24-60 meses). |
| `responsible` | `VARCHAR(150)` | `NOT NULL` | Misionero u obrero responsable directo. |
| `frequency` | `VARCHAR(80)` | `NOT NULL, DEFAULT 'Mensual'` | Frecuencia de ejecución. |
| `times_per_year` | `INT` | `NOT NULL, DEFAULT 1, CHECK (>= 0)` | Repeticiones al año. |
| `start_date` | `DATE` | `NOT NULL` | Fecha de inicio. |
| `end_date` | `DATE` | `NOT NULL, CHECK (end_date >= start_date)` | Fecha límite. |
| `total_weeks` | `INT` | `NOT NULL` | Semanas estimadas. |
| `remaining_weeks` | `INT` | `NOT NULL` | Semanas restantes. |
| `unit_budget` | `NUMERIC(14, 2)` | `NOT NULL, DEFAULT 0.00, CHECK (>= 0)` | Costo unitario por ejecución en COP. |
| `total_budget` | `NUMERIC(14, 2)` | `NOT NULL, DEFAULT 0.00, CHECK (>= 0)` | Presupuesto total (`unit_budget * times_per_year`). |
| `state` | `activity_state_enum`| `NOT NULL, DEFAULT 'Pendiente'` | Estado ('Pendiente', 'En Proceso', 'Completado'). |
| `obstacles` | `TEXT` | `NOT NULL, DEFAULT ''` | Obstáculos o alertas de campo detectadas. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Creación de registro. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Modificación de registro. |

### 2.5. Entidad: `team_notes` (Notas, Ideas y Agenda Territorial)
```sql
CREATE TYPE note_category_enum AS ENUM ('idea', 'actividad', 'oracion', 'urgente', 'general');

CREATE TABLE team_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category note_category_enum NOT NULL DEFAULT 'general',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    author VARCHAR(150) NOT NULL DEFAULT 'Líder de Misión',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_team_notes_team_id ON team_notes(team_id);
CREATE INDEX idx_team_notes_pinned ON team_notes(team_id, is_pinned DESC, created_at DESC);
```

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único de la nota. |
| `team_id` | `UUID` | `FOREIGN KEY, NOT NULL, ON DELETE CASCADE` | Misión territorial propietaria de la nota. |
| `title` | `VARCHAR(200)` | `NOT NULL` | Asunto o título breve de la nota o idea. |
| `content` | `TEXT` | `NOT NULL` | Cuerpo descriptivo con ideas, peticiones o recordatorios. |
| `category` | `note_category_enum` | `NOT NULL, DEFAULT 'general'` | Tipo ('idea', 'actividad', 'oracion', 'urgente', 'general'). |
| `is_pinned` | `BOOLEAN` | `NOT NULL, DEFAULT FALSE` | Flag de fijación prioritaria en la parte superior. |
| `author` | `VARCHAR(150)` | `NOT NULL, DEFAULT 'Líder de Misión'` | Nombre del autor de la nota. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Fecha y hora de creación. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Fecha y hora de última modificación. |

### 2.6. Entidad: `team_audit_logs` (Telemetría, Auditoría y Monitoreo Territorial)
```sql
CREATE TYPE audit_action_enum AS ENUM (
    'login', 
    'activity_add', 
    'activity_update', 
    'activity_delete', 
    'objective_update', 
    'objective_add', 
    'note_add', 
    'note_delete', 
    'report_generate'
);

CREATE TABLE team_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_name VARCHAR(150) NOT NULL,
    action_type audit_action_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    detail TEXT NOT NULL,
    phase_id phase_type_enum,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_team_audit_team_time ON team_audit_logs(team_id, created_at DESC);
CREATE INDEX idx_team_audit_action ON team_audit_logs(team_id, action_type);
```

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único del evento de auditoría. |
| `team_id` | `UUID` | `FOREIGN KEY, NOT NULL, ON DELETE CASCADE` | Misión territorial donde se originó la acción. |
| `user_name` | `VARCHAR(150)` | `NOT NULL` | Nombre del líder o misionero que ejecutó la acción. |
| `action_type` | `audit_action_enum` | `NOT NULL` | Tipo de evento ('login', 'activity_add', 'activity_update', etc.). |
| `title` | `VARCHAR(200)` | `NOT NULL` | Resumen breve legible (ej: "Modificación de actividad"). |
| `detail` | `TEXT` | `NOT NULL` | Detalle específico (ej: "Actualizó presupuesto a $1.200.000 COP"). |
| `phase_id` | `phase_type_enum` | `NULL` | Fase del PDM asociada cuando aplica. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Marca temporal exacta del evento para supervisión. |


