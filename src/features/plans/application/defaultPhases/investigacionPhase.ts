import type { PhasePlan } from '../../domain/plan.types';
import { investigacionObj1And2 } from './investigacionObj1And2';
import { investigacionObj3And4 } from './investigacionObj3And4';

export const investigacionPhase: PhasePlan = {
  phaseId: 'investigacion',
  phaseName: 'Investigación y Diagnóstico Territorial',
  startDate: '2026-02-01',
  teamName: 'Misión Wayuu - Alta Guajira',
  teamLeader: 'Pr. David Morales',
  teamMembers: ['David Morales', 'Carlos Pushaina', 'Dra. Ruth Mendoza (Salud)', 'Hna. Marcela Uriana'],
  objectives: [...investigacionObj1And2, ...investigacionObj3And4],
};
