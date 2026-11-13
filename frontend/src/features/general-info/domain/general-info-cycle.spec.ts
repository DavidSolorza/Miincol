import { describe, it, expect } from 'vitest';
import { createDefaultGeneralInfo } from './general-info-defaults';
import { createHistorySnapshot, archiveYearCycle } from './general-info-history.helper';
import { createCleanCycleState } from './general-info-reset.helper';
import { cleanPlansForNewYear } from '../../plans/application/planCycleReset';
import type { PhasePlan } from '../../plans/domain/plan.types';

describe('General Info Cycle & History Helpers', () => {
  it('debe crear un snapshot completo e inmutable del anio que se cierra', () => {
    const info = createDefaultGeneralInfo('team-test', 'Test Team', 'Pr. Juan');
    info.fieldMetrics.firstTimeContactedCount = 25;
    info.budgetBreakdown.executedTotalBudget = 5000000;

    const snapshot = createHistorySnapshot(info);

    expect(snapshot.year).toBe(2026);
    expect(snapshot.fieldMetrics.firstTimeContactedCount).toBe(25);
    expect(snapshot.budgetBreakdown.executedTotalBudget).toBe(5000000);
    expect(snapshot.closedAt).toBeDefined();
  });

  it('debe archivar el anio cerrado preservando el historial previo', () => {
    const info = createDefaultGeneralInfo('team-test');
    info.annualMetricsHistory = {
      2025: {
        year: 2025,
        closedAt: '2025-12-31T23:59:59.000Z',
        fieldMetrics: { ...info.fieldMetrics, firstTimeContactedCount: 10 },
        training: { ...info.ministerialTraining },
        church: { ...info.churchDevelopment },
        budgetBreakdown: { ...info.budgetBreakdown },
        essentialsToDevelop: ['1. Liderazgo'],
      },
    };

    const updatedHistory = archiveYearCycle(info);

    expect(updatedHistory[2025]).toBeDefined();
    expect(updatedHistory[2025].fieldMetrics.firstTimeContactedCount).toBe(10);
    expect(updatedHistory[2026]).toBeDefined();
    expect(updatedHistory[2026].year).toBe(2026);
  });

  it('debe limpiar las metricas y presupuesto al iniciar el anio 2027', () => {
    const info = createDefaultGeneralInfo('team-test');
    info.fieldMetrics.firstTimeContactedCount = 15;
    info.budgetBreakdown.executedTotalBudget = 4500000;

    const cleanState = createCleanCycleState(2027, info);

    expect(cleanState.teamData?.year).toBe(2027);
    expect(cleanState.teamData?.isYearClosed).toBe(false);
    expect(cleanState.fieldMetrics?.firstTimeContactedCount).toBe(0);
    expect(cleanState.fieldMetrics?.baptizedCount).toBe(0);
    expect(cleanState.ministerialTraining?.practicalMinisterialTrainingCount).toBe(0);
    expect(cleanState.churchDevelopment?.finalChurchesCount).toBe(0);
    expect(cleanState.budgetBreakdown?.executedTotalBudget).toBe(0);
  });

  it('debe limpiar las actividades de los planes PDM manteniendo los objetivos base para 2027', () => {
    const mockPlans: Record<string, PhasePlan> = {
      investigacion: {
        id: 'p1',
        title: 'Investigación',
        phaseNumber: 1,
        totalBudget: 500000,
        objectives: [
          {
            id: 'obj-1',
            number: 1,
            title: 'Diagnóstico Territorial',
            description: 'Levantamiento de campo',
            totalBudget: 500000,
            activities: [
              {
                id: 'act-1',
                objectiveNumber: 1,
                description: 'Censo poblacional',
                responsible: 'Líder',
                frequency: 'Mensual',
                timesPerYear: 1,
                unitBudget: 500000,
                totalBudget: 500000,
                startDate: '2026-01-01',
                endDate: '2026-03-01',
                totalWeeks: 8,
                remainingWeeks: 0,
                state: 'Completado',
              },
            ],
          },
        ],
      },
    };

    const cleaned = cleanPlansForNewYear(mockPlans);

    expect(cleaned['investigacion'].totalBudget).toBe(0);
    expect(cleaned['investigacion'].objectives[0].activities).toHaveLength(0);
    expect(cleaned['investigacion'].objectives[0].title).toBe('Diagnóstico Territorial');
  });
});

