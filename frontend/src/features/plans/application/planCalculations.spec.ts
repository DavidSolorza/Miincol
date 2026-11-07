import { describe, it, expect } from 'vitest';
import { calculatePlanMetrics } from './planCalculations';
import type { PhasePlan } from '../domain/plan.types';

describe('planCalculations (Frontend Unit Tests)', () => {
  it('debe calcular métricas y presupuestos de un plan ministerial con precisión', () => {
    const mockPlan: PhasePlan = {
      phaseId: 'entrenamiento',
      phaseName: '4. Entrenamiento',
      year: 2026,
      objectives: [
        {
          id: 'obj-1',
          number: 1,
          title: 'Objetivo 1',
          description: 'Desc 1',
          essentialArea: 'Entrenamiento',
          activities: [
            {
              id: 'act-1',
              objectiveNumber: 1,
              title: 'Actividad 1',
              state: 'Completado',
              totalBudget: 500000,
              unitBudget: 50000,
              timesPerYear: 10,
              frequency: 'Mensual',
              startDate: '2026-01-01',
              endDate: '2026-11-01',
              responsible: 'Hugo',
            },
            {
              id: 'act-2',
              objectiveNumber: 1,
              title: 'Actividad 2',
              state: 'En Proceso',
              totalBudget: 3300000,
              unitBudget: 300000,
              timesPerYear: 11,
              frequency: 'Mensual',
              startDate: '2026-01-01',
              endDate: '2026-11-01',
              responsible: 'Diana',
            },
          ],
        },
      ],
    };

    const metrics = calculatePlanMetrics(mockPlan);

    expect(metrics.totalActivities).toBe(2);
    expect(metrics.completedActivities).toBe(1);
    expect(metrics.inProgressActivities).toBe(1);
    expect(metrics.pendingActivities).toBe(0);
    expect(metrics.totalBudget).toBe(3800000);
    expect(metrics.progressPercentage).toBe(50);
  });

  it('debe retornar 0% de avance si el plan no tiene actividades registradas', () => {
    const emptyPlan: PhasePlan = {
      phaseId: 'investigacion',
      phaseName: '1. Investigación',
      year: 2026,
      objectives: [],
    };

    const metrics = calculatePlanMetrics(emptyPlan);

    expect(metrics.totalActivities).toBe(0);
    expect(metrics.progressPercentage).toBe(0);
    expect(metrics.totalBudget).toBe(0);
  });
});
