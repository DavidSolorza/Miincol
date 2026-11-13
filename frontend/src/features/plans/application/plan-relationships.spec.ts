import { describe, it, expect } from 'vitest';
import type { PhasePlan, Objective, Activity } from '../domain/plan.types';
import { STAGES_BY_AREA } from '../domain/plan.types';
import { HierarchicalPlanCalculator } from '../domain/hierarchical-plan.calculator';
import { applyAddObjective } from './planObjectiveActions';

describe('Pruebas de Relacion PDM (Fase -> Objetivos -> Actividades -> Presupuesto)', () => {
  const createMockActivity = (id: string, objNum: number, unit: number, times: number, state: 'Pendiente' | 'Completado' = 'Pendiente'): Activity => ({
    id,
    objectiveNumber: objNum,
    description: `Actividad ${id}`,
    stage: 'Contacto',
    responsible: 'Pr. Hugo',
    frequency: 'Mensual',
    timesPerYear: times,
    unitBudget: unit,
    totalBudget: unit * times,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    totalWeeks: 52,
    remainingWeeks: 26,
    state,
    mediumTermGoal: 'Meta media',
    longTermGoal: 'Meta larga',
    currentSituation: 'Situacion inicial',
  });

  const mockPhase: PhasePlan = {
    phaseId: 'investigacion',
    phaseName: 'Investigación Territorial',
    startDate: '2026-01-01',
    teamName: 'Misión Pastos',
    teamMembers: ['Hugo Solorza', 'Aída Secue'],
    teamLeader: 'Pr. Hugo',
    objectives: [
      {
        number: 1,
        title: 'Diagnóstico Territorial',
        description: 'Mapeo de comunidades',
        stage: 'Contacto',
        activities: [
          createMockActivity('act-1', 1, 250000, 2, 'Completado'), // 500.000
          createMockActivity('act-2', 1, 100000, 3, 'Pendiente'),  // 300.000
        ],
      },
      {
        number: 2,
        title: 'Relaciones Comunitarias',
        description: 'Vínculos con autoridades',
        stage: 'Contacto',
        activities: [
          createMockActivity('act-3', 2, 200000, 2, 'Completado'), // 400.000
        ],
      },
    ],
  };

  it('debe mantener la coherencia relacional de presupuestos de actividades hacia la fase', () => {
    const totalPhaseBudget = HierarchicalPlanCalculator.calculatePhaseBudget(mockPhase);
    expect(totalPhaseBudget).toBe(1200000); // 500k + 300k + 400k
  });

  it('debe calcular correctamente el avance porcentual a traves de la relacion de actividades', () => {
    const metrics = HierarchicalPlanCalculator.calculatePhaseMetrics(mockPhase);
    expect(metrics.totalActivities).toBe(3);
    expect(metrics.completedActivities).toBe(2);
    expect(metrics.progressPercentage).toBe(67); // 2/3 = 66.6% -> 67%
  });

  it('debe restringir la relacion a maximo 4 objetivos por fase', () => {
    let current = mockPhase;
    // Agregamos objetivo 3
    const r3 = applyAddObjective(current, { title: 'Obj 3', description: 'Desc 3' });
    expect(r3).not.toBeNull();
    current = r3!.updatedPlan;

    // Agregamos objetivo 4
    const r4 = applyAddObjective(current, { title: 'Obj 4', description: 'Desc 4' });
    expect(r4).not.toBeNull();
    current = r4!.updatedPlan;

    // Intento de agregar objetivo 5 -> Debe ser rechazado (null)
    const r5 = applyAddObjective(current, { title: 'Obj 5', description: 'Desc 5' });
    expect(r5).toBeNull();
    expect(current.objectives).toHaveLength(4);
  });

  it('debe validar la pertenencia relacional estricta de etapas por area esencial', () => {
    expect(STAGES_BY_AREA.Investigación).toContain('Contacto');
    expect(STAGES_BY_AREA.Investigación).not.toContain('Comunicar');

    expect(STAGES_BY_AREA.Encarnación).toEqual(['Contacto', 'Comunicar', 'Respuesta']);
    expect(STAGES_BY_AREA.Evangelización).toEqual(['Respuesta', 'Reunirse', 'Consolidar']);
    expect(STAGES_BY_AREA.Entrenamiento).toEqual(['Consolidar', 'Liderazgo', 'Desarrollo eclesial']);
    expect(STAGES_BY_AREA.Autocuidado).toEqual(['Auto-cuidado']);
  });
});

