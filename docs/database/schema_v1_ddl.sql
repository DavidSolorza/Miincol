-- ============================================================================
-- ESQUEMA RELACIONAL 3NF - MISINCOL PDM (PLAN DE DESARROLLO MINISTERIAL)
-- Versión de Gobernanza: 2026.4.0
-- Nomenclatura: Minúsculas y snake_case estricto
-- Claves Primarias: UUID v4 con restricciones explícitas
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLA: equipos_misioneros (Missionary Teams)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipos_misioneros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_equipo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    etnia VARCHAR(100) NOT NULL,
    region VARCHAR(150) NOT NULL,
    departamento_id VARCHAR(10) NOT NULL,
    departamento_nombre VARCHAR(100) NOT NULL,
    lider_nombre VARCHAR(150) NOT NULL,
    lider_telefono VARCHAR(50),
    color_distintivo VARCHAR(20) DEFAULT '#8B251E',
    fase_actual VARCHAR(50) NOT NULL DEFAULT 'investigacion',
    estado_salud VARCHAR(50) NOT NULL DEFAULT 'estable',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_equipos_departamento ON equipos_misioneros(departamento_id);
CREATE INDEX IF NOT EXISTS idx_equipos_fase ON equipos_misioneros(fase_actual);

-- ----------------------------------------------------------------------------
-- 2. TABLA: integrantes_equipo (Team Members)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS integrantes_equipo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipo_id UUID NOT NULL REFERENCES equipos_misioneros(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(150) NOT NULL,
    rol VARCHAR(100) DEFAULT 'Misionero',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_integrantes_equipo_id ON integrantes_equipo(equipo_id);

-- ----------------------------------------------------------------------------
-- 3. TABLA: fases_plan (PDM Phases)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fases_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipo_id UUID NOT NULL REFERENCES equipos_misioneros(id) ON DELETE CASCADE,
    fase_tipo VARCHAR(50) NOT NULL,
    fase_numero SMALLINT NOT NULL CHECK (fase_numero BETWEEN 1 AND 4),
    titulo VARCHAR(150) NOT NULL,
    presupuesto_total NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_equipo_fase UNIQUE (equipo_id, fase_tipo)
);

CREATE INDEX IF NOT EXISTS idx_fases_equipo ON fases_plan(equipo_id);

-- ----------------------------------------------------------------------------
-- 4. TABLA: objetivos_plan (Pillar Strategic Objectives)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS objetivos_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fase_id UUID NOT NULL REFERENCES fases_plan(id) ON DELETE CASCADE,
    numero SMALLINT NOT NULL CHECK (numero BETWEEN 1 AND 4),
    titulo VARCHAR(255) NOT NULL,
    presupuesto_estimado NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    indicador_kpi VARCHAR(255),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_fase_objetivo UNIQUE (fase_id, numero)
);

CREATE INDEX IF NOT EXISTS idx_objetivos_fase ON objetivos_plan(fase_id);

-- ----------------------------------------------------------------------------
-- 5. TABLA: actividades_plan (PDM Activities)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS actividades_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objetivo_id UUID NOT NULL REFERENCES objetivos_plan(id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    etapa VARCHAR(50) DEFAULT 'General',
    responsable VARCHAR(150) NOT NULL,
    frecuencia VARCHAR(50) DEFAULT 'Mensual',
    veces_al_ano SMALLINT DEFAULT 12 NOT NULL,
    presupuesto_unitario NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    presupuesto_total NUMERIC(15, 2) GENERATED ALWAYS AS (presupuesto_unitario * veces_al_ano) STORED,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    total_semanas SMALLINT DEFAULT 0 NOT NULL,
    semanas_restantes SMALLINT DEFAULT 0 NOT NULL,
    estado VARCHAR(30) DEFAULT 'Pendiente' NOT NULL,
    situacion_actual TEXT,
    meta_corto_plazo TEXT,
    meta_mediano_plazo TEXT,
    meta_largo_plazo TEXT,
    obstaculos TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_actividades_objetivo ON actividades_plan(objetivo_id);
CREATE INDEX IF NOT EXISTS idx_actividades_estado ON actividades_plan(estado);

-- ----------------------------------------------------------------------------
-- 6. TABLA: notas_territoriales (Team Field Notes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notas_territoriales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipo_id UUID NOT NULL REFERENCES equipos_misioneros(id) ON DELETE CASCADE,
    autor VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    categoria VARCHAR(50) DEFAULT 'General',
    es_urgente BOOLEAN DEFAULT FALSE NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notas_equipo ON notas_territoriales(equipo_id);

-- ----------------------------------------------------------------------------
-- 7. TABLA: auditoria_eventos (Audit Telemetry Logs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auditoria_eventos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipo_id UUID REFERENCES equipos_misioneros(id) ON DELETE SET NULL,
    usuario_id VARCHAR(100) NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    accion VARCHAR(255) NOT NULL,
    detalles JSONB,
    direccion_ip VARCHAR(50),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auditoria_equipo ON auditoria_eventos(equipo_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria_eventos(creado_en);
