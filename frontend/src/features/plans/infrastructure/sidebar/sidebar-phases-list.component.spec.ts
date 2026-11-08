import { describe, it, expect } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { SidebarPhasesListComponent } from './sidebar-phases-list.component';
import type { PhasePlan } from '../../domain/plan.types';

describe('SidebarPhasesListComponent (Unit Tests)', () => {
  const createComponent = (): SidebarPhasesListComponent => {
    const injector = createEnvironmentInjector([], null as unknown as import('@angular/core').EnvironmentInjector);
    return runInInjectionContext(injector, () => new SidebarPhasesListComponent());
  };

  it('debe calcular objetivos totales y objetivos cumplidos por fase', () => {
    const comp = createComponent();

    const mockPhasePlan: PhasePlan = {
      phaseId: 'entrenamiento',
      phaseName: '4. Entrenamiento',
      year: 2026,
      teamName: 'Misión Pastos',
      teamLeader: 'Hugo Solorza',
      teamMembers: ['Hugo Solorza', 'Diana Viera'],
      objectives: [
        {
          number: 1,
          title: 'Obj 1 Cumplido',
          description: 'Desc',
          activities: [
            {
              id: 'a1', objectiveNumber: 1, stage: 'Liderazgo', description: 'Act 1',
              currentSituation: '', mediumTermGoal: '', longTermGoal: '',
              responsible: 'Hugo', frequency: 'Mensual', timesPerYear: 1,
              startDate: '', endDate: '', totalWeeks: 1, remainingWeeks: 0,
              unitBudget: 0, totalBudget: 0, state: 'Completado', obstacles: '',
            },
          ],
        },
        {
          number: 2,
          title: 'Obj 2 Pendiente',
          description: 'Desc',
          activities: [
            {
              id: 'a2', objectiveNumber: 2, stage: 'Liderazgo', description: 'Act 2',
              currentSituation: '', mediumTermGoal: '', longTermGoal: '',
              responsible: 'Diana', frequency: 'Mensual', timesPerYear: 1,
              startDate: '', endDate: '', totalWeeks: 1, remainingWeeks: 1,
              unitBudget: 0, totalBudget: 0, state: 'Pendiente', obstacles: '',
            },
          ],
        },
      ],
    };

    (comp as unknown as { allPlans: () => Record<string, PhasePlan> }).allPlans = () => ({
      entrenamiento: mockPhasePlan,
    });

    const counts = comp.getPhaseCounts('entrenamiento');
    expect(counts.total).toBe(2);
    expect(counts.completed).toBe(1);
  });

  it('debe retornar 0/0 si la fase no existe en el plan del equipo', () => {
    const comp = createComponent();
    (comp as unknown as { allPlans: () => Record<string, PhasePlan> }).allPlans = () => ({});

    const counts = comp.getPhaseCounts('investigacion');
    expect(counts.total).toBe(0);
    expect(counts.completed).toBe(0);
  });
});
