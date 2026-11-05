/**
 * Modelo de Dominio Puro (DDD) para el Plan de Desarrollo Ministerial (PDM)
 * Capa de Dominio: Cero dependencias externas.
 */

// Tipos de fases ministeriales disponibles en el PDM
export type PhaseType = 'investigacion' | 'encarnacion' | 'evangelizacion' | 'entrenamiento' | 'autocuidado';

// Estados posibles de ejecución de una actividad
export type ActivityState = 'Pendiente' | 'En Proceso' | 'Completado';

// Áreas Esenciales del ministerio
export type EssentialArea = 'Investigación' | 'Encarnación' | 'Evangelización' | 'Entrenamiento' | 'Autocuidado';
export type AreaLevel = string; // Deprecado: Nivel eliminado de UI, conservado como string opcional

// Catálogo de etapas ministeriales oficiales (según relacion pilar-etapa.xlsx)
export type ActivityStage =
  | 'Contacto'
  | 'Comunicar'
  | 'Respuesta'
  | 'Reunirse'
  | 'Consolidar'
  | 'Liderazgo'
  | 'Desarrollo eclesial'
  | 'Auto-cuidado'
  | 'Contacto primeros oyentes'
  | 'Comunicar el evangelio'
  | 'Respuesta al evangelio'
  | 'Guiamos a reunirse'
  | 'Consolidamos'
  | 'Desarrollo Eclesial'
  | 'Auto Cuidado del Misionero'
  | 'ADN Multiplicador'
  | 'Salida progresiva'
  | 'General';

// Mapeo oficial de etapas según matriz Excel relacion pilar-etapa.xlsx
export const STAGES_BY_AREA: Record<EssentialArea, readonly ActivityStage[]> = {
  Investigación: ['Contacto'],
  Encarnación: ['Contacto', 'Comunicar', 'Respuesta'],
  Evangelización: ['Respuesta', 'Reunirse', 'Consolidar'],
  Entrenamiento: ['Consolidar', 'Liderazgo', 'Desarrollo eclesial'],
  Autocuidado: ['Auto-cuidado', 'Auto Cuidado del Misionero', 'ADN Multiplicador', 'Salida progresiva'],
};

// Relación fija directa entre identificador de fase PDM y el Pilar / Área correspondiente
export const PHASE_TO_AREA: Record<PhaseType, EssentialArea> = {
  investigacion: 'Investigación',
  encarnacion: 'Encarnación',
  evangelizacion: 'Evangelización',
  entrenamiento: 'Entrenamiento',
  autocuidado: 'Autocuidado',
};

// Entidad de dominio que representa una actividad ministerial
export interface Activity {
  id: string;
  state: ActivityState;
  stage: string;
  objectiveNumber: number; // Enumeración dinámica según posición en la lista
  description: string;
  currentSituation: string;
  essentialArea?: EssentialArea; // Área esencial vinculada
  areaLevel?: AreaLevel; // Deprecado opcional
  shortTermGoal?: string;
  mediumTermGoal: string;
  longTermGoal: string;
  responsible: string;
  frequency: string;
  timesPerYear: number;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  remainingWeeks: number;
  unitBudget: number;
  totalBudget: number; // unitBudget * timesPerYear
  obstacles?: string; // Campo deprecado opcional para compatibilidad con datos históricos
}

// Entidad que agrupa un objetivo estratégico y sus actividades asociadas
export interface Objective {
  number: number; // Índice dinámico posicional (1..N)
  title: string;
  description: string;
  essentialArea?: EssentialArea; // Área esencial asociada
  stage?: string; // Etapa asociada según el pilar (según relacion pilar-etapa.xlsx)
  areaLevel?: AreaLevel; // Deprecado opcional
  mediumTermGoal?: string; // Meta a mediano plazo proyectada
  longTermGoal?: string; // Meta a largo plazo proyectada
  activities: Activity[];
}

// Estructura completa del plan ministerial para una fase específica
export interface PhasePlan {
  phaseId: PhaseType;
  phaseName: string;
  startDate: string;
  teamName: string;
  teamMembers: string[];
  teamLeader: string;
  objectives: Objective[];
  isLocked?: boolean; // Bloqueo de seguridad al marcar como Terminado
  status?: 'DRAFT' | 'FINISHED'; // Estado de planeación del equipo
}

// Indicadores y métricas consolidadas de avance y presupuesto de un plan
export interface PlanMetrics {
  totalBudget: number;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  pendingActivities: number;
  progressPercentage: number;
  totalRemainingWeeks: number;
}
