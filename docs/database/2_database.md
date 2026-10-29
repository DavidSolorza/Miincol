# 🗄️ Especificación de Base de Datos y Modelo Físico Relacional
**Proyecto:** Plan Ministerial Misincol (PDM) & Portal Territorial  
**Motor:** PostgreSQL 16+  
**Autor:** Agente 3 (Principal DBA)  
**Estado:** Sincronizado con Modelo de Dominio Angular v3.0.0

---

## 1. Script DDL Ejecutable (PostgreSQL)

```sql
-- Habilitar extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tipos Enumerados de Dominio
CREATE TYPE health_status_enum AS ENUM ('Optimo', 'Atención', 'Crítico');
CREATE TYPE phase_type_enum AS ENUM ('investigacion', 'encarnacion', 'evangelizacion', 'entrenamiento', 'autocuidado');
CREATE TYPE activity_state_enum AS ENUM ('Pendiente', 'En Proceso', 'Completado');
CREATE TYPE note_category_enum AS ENUM ('idea', 'actividad', 'oracion', 'urgente', 'general');
CREATE TYPE audit_action_enum AS ENUM (
    'login', 'activity_add', 'activity_update', 'activity_delete',
    'objective_update', 'objective_add', 'note_add', 'note_delete', 'report_generate'
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

-- 3. Tabla de Planes de Fase Ministerial
CREATE TABLE phase_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    phase_id phase_type_enum NOT NULL,
    phase_name VARCHAR(120) NOT NULL,
    start_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'En Curso' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_team_phase UNIQUE (team_id, phase_id)
);

-- 4. Tabla de Objetivos Estratégicos (Máximo 4 por Fase)
CREATE TABLE objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_plan_id UUID NOT NULL REFERENCES phase_plans(id) ON DELETE CASCADE,
    objective_number SMALLINT NOT NULL CHECK (objective_number BETWEEN 1 AND 4),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_phase_objective_number UNIQUE (phase_plan_id, objective_number)
);

-- 5. Tabla de Actividades del Plan
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    stage VARCHAR(100) DEFAULT 'General' NOT NULL,
    description TEXT NOT NULL,
    current_situation TEXT DEFAULT '' NOT NULL,
    short_term_goal TEXT DEFAULT '' NOT NULL,
    medium_term_goal TEXT DEFAULT '' NOT NULL,
    long_term_goal TEXT DEFAULT '' NOT NULL,
    responsible VARCHAR(150) NOT NULL,
    frequency VARCHAR(80) DEFAULT 'Mensual' NOT NULL,
    times_per_year INT DEFAULT 1 NOT NULL CHECK (times_per_year >= 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_weeks INT NOT NULL,
    remaining_weeks INT NOT NULL,
    unit_budget NUMERIC(14, 2) DEFAULT 0.00 NOT NULL CHECK (unit_budget >= 0),
    total_budget NUMERIC(14, 2) DEFAULT 0.00 NOT NULL CHECK (total_budget >= 0),
    state activity_state_enum DEFAULT 'Pendiente' NOT NULL,
    obstacles TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_dates_order CHECK (end_date >= start_date)
);

-- 6. Tabla de Notas y Agenda Territorial
CREATE TABLE team_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category note_category_enum NOT NULL DEFAULT 'general',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    author VARCHAR(150) NOT NULL DEFAULT 'Líder de Misión',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla de Bitácora de Auditoría y Telemetría
CREATE TABLE team_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_name VARCHAR(150) NOT NULL,
    action_type audit_action_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    detail TEXT NOT NULL,
    phase_id phase_type_enum,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Correspondencia con Persistencia Local Offline-First (`localStorage`)

| Tabla Relacional SQL | Servicio / Módulo Angular | Clave `localStorage` en Cliente |
| :--- | :--- | :--- |
| `teams` | `AdminDashboardService` (`src/features/admin/application/admin-dashboard.service.ts`) | `misincol_custom_teams_v1` |
| `phase_plans` + `objectives` + `activities` | `PlanService` (`src/features/plans/application/plan.service.ts`) | `misincol_pdm_plans_${teamId}` |
| `team_notes` | `TeamNotesModalComponent` (`src/features/notes/infrastructure/team-notes-modal.component.ts`) | `misincol_team_notes_${teamId}` |
| `team_audit_logs` | `auditStorage.ts` (`src/features/audit/application/auditStorage.ts`) | `misincol_audit_logs_${teamId}` |

