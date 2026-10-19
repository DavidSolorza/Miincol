import type { PhasePlan } from '../../domain/plan.types';
import { INITIAL_PLANS_BY_PHASE } from '../mockPlanData';
import { pastosObj1And2 } from './pastosObj1And2';
import { pastosObj3And4 } from './pastosObj3And4';

export const PASTOS_PLANS_BY_PHASE: Record<string, PhasePlan> = {
  investigacion: {
    ...INITIAL_PLANS_BY_PHASE.investigacion,
    teamName: 'Misión Pastos - Cumbal',
    teamLeader: 'Pr. Hugo Solorza',
    teamMembers: ['Hugo Solorza', 'Diana Viera'],
  },
  encarnacion: {
    ...INITIAL_PLANS_BY_PHASE.encarnacion,
    teamName: 'Misión Pastos - Cumbal',
    teamLeader: 'Pr. Hugo Solorza',
    teamMembers: ['Hugo Solorza', 'Diana Viera'],
  },
  evangelizacion: {
    ...INITIAL_PLANS_BY_PHASE.evangelizacion,
    teamName: 'Misión Pastos - Cumbal',
    teamLeader: 'Pr. Hugo Solorza',
    teamMembers: ['Hugo Solorza', 'Diana Viera'],
  },
  entrenamiento: {
    phaseId: 'entrenamiento',
    phaseName: 'Entrenamiento y Formación de Obreros Autóctonos',
    startDate: '2026-02-10',
    teamName: 'Misión Pastos - Cumbal',
    teamLeader: 'Pr. Hugo Solorza',
    teamMembers: ['Hugo Solorza', 'Diana Viera'],
    objectives: [...pastosObj1And2, ...pastosObj3And4],
  },
  autocuidado: {
    ...INITIAL_PLANS_BY_PHASE.autocuidado,
    teamName: 'Misión Pastos - Cumbal',
    teamLeader: 'Pr. Hugo Solorza',
    teamMembers: ['Hugo Solorza', 'Diana Viera'],
  },
};
