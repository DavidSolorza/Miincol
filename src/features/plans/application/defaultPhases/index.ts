import { investigacionPhase } from './investigacionPhase';
import { encarnacionPhase } from './encarnacionPhase';
import { evangelizacionPhase } from './evangelizacionPhase';
import { entrenamientoPhase } from './entrenamientoPhase';
import { autocuidadoPhase } from './autocuidadoPhase';
import type { PhasePlan } from '../../domain/plan.types';

export const INITIAL_PLANS_BY_PHASE: Record<string, PhasePlan> = {
  investigacion: investigacionPhase,
  encarnacion: encarnacionPhase,
  evangelizacion: evangelizacionPhase,
  entrenamiento: entrenamientoPhase,
  autocuidado: autocuidadoPhase,
};
