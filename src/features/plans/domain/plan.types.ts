/**
 * Modelo de Dominio Puro (DDD) para el Plan de Desarrollo Ministerial (PDM)
 * Capa de Dominio: Cero dependencias externas.
 */

// Tipos de fases ministeriales disponibles en el PDM
export type PhaseType = 'investigacion' | 'encarnacion' | 'evangelizacion' | 'entrenamiento' | 'autocuidado';

// Estados posibles de ejecución de una actividad
export type ActivityState = 'Pendiente' | 'En Proceso' | 'Completado';

// Áreas Esenciales del ministerio y sus niveles
export type EssentialArea = 'Investigación' | 'Encarnación' | 'Evangelización' | 'Entrenamiento' | 'Autocuidado' | 'General';
export type AreaLevel = 'Nivel 1' | 'Nivel 2' | 'Nivel 3' | 'Nivel 4' | 'Nivel 5';

// Catálogo de etapas ministeriales oficiales por pilar
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

// Mapeo inmutable de etapas permitidas por Área Esencial (Pilar)
export const STAGES_BY_AREA: Record<EssentialArea, readonly ActivityStage[]> = {
  Investigación: ['Contacto primeros oyentes'],
  Encarnación: ['Comunicar el evangelio'],
  Evangelización: ['Respuesta al evangelio', 'Guiamos a reunirse', 'Consolidamos'],
  Entrenamiento: ['Liderazgo', 'Desarrollo Eclesial', 'Involucrar liderazgo en el proceso', 'Pluralidad de liderazgo'],
  Autocuidado: ['Auto Cuidado del Misionero', 'ADN Multiplicador', 'Salida progresiva'],
  General: ['ADN Multiplicador', 'Salida progresiva', 'Auto Cuidado del Misionero', 'General'],
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
  areaLevel?: AreaLevel; // Nivel correspondiente
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
  areaLevel?: AreaLevel; // Nivel del objetivo
  stage?: string; // Etapa asociada según el pilar
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
