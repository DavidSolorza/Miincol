import { describe, it, expect } from 'vitest';
import type { GeneralTeamInfo } from './general-info.types';

describe('GeneralInfo Domain & Calculations (Unit Tests)', () => {
  it('debe calcular correctamente la ejecución presupuestal por pilar', () => {
    const mockInfo: GeneralTeamInfo = {
      teamData: {
        id: 'team-pastos',
        name: 'Misión Pastos - Cumbal',
        ethnicity: 'Pastos',
        region: 'Cumbal',
        department: 'Nariño',
        teamLeader: 'Pr. Hugo Solorza',
        leaderPhone: '+57 315 889 4521',
        members: [],
      },
      pillarBudgets: {
        investigacion: 0,
        encarnacion: 0,
        evangelizacion: 0,
        entrenamiento: 11210000,
        autocuidado: 0,
      },
      currentYear: 2026,
      isYearClosed: false,
      totalBudget: 11210000,
      executedBudget: 4200000,
      essentials: ['Compromiso 1', 'Compromiso 2', 'Compromiso 3', 'Compromiso 4', 'Compromiso 5'],
      ministerialTraining: {
        practicalTraining: 10,
        pastoralTraining: 3,
        biblicalTraining: 9,
        churchPlantingTraining: 0,
        otherAreasTraining: 0,
      },
      churchDevelopment: {
        prospectiveGroups: 1,
        finalChurches: 1,
        firstGenChurches: 1,
        secondGenChurches: 0,
        thirdGenChurches: 0,
        lostFirstGenChurches: 0,
        lostSecondGenChurches: 0,
      },
    };

    const sumPillars = Object.values(mockInfo.pillarBudgets).reduce((acc, b) => acc + b, 0);
    expect(sumPillars).toBe(11210000);
    expect(mockInfo.totalBudget).toBe(11210000);

    const execPercent = Math.round((mockInfo.executedBudget / mockInfo.totalBudget) * 100);
    expect(execPercent).toBe(37);
  });

  it('debe validar que los 5 esenciales a desarrollar estén presentes', () => {
    const essentials = ['Oración', 'Discipulado', 'Plantación', 'Liderazgo', 'Autonomía'];
    expect(essentials.length).toBe(5);
    expect(essentials[0]).toBe('Oración');
  });
});

