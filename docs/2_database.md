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
