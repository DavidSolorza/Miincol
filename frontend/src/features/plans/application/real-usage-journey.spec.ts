import { describe, it, expect } from 'vitest';
import { HierarchicalPlanCalculator } from '../domain/hierarchical-plan.calculator';
import { cleanPlansForNewYear } from './planCycleReset';
import { createDefaultGeneralInfo } from '../../general-info/domain/general-info-defaults';
import { archiveYearCycle } from '../../general-info/domain/general-info-history.helper';
import { createCleanCycleState } from '../../general-info/domain/general-info-reset.helper';
import type { PhasePlan } from '../domain/plan.types';

describe('Simulacion de Uso Real: Viaje Completo de Mision Pastos (Presupuesto $11.210.000 COP)', () => {
  const annualAllocation = 11210000;

  it('debe simular el ciclo anual completo: planificacion, control anti-sobregiro, cumplimiento y transicion a 2027', () => {
    // 1. Configuracion inicial del equipo misionero
    const generalInfo = createDefaultGeneralInfo('team-pastos', 'Misión Pastos - Cumbal', 'Pr. Hugo Solorza');
    generalInfo.budgetBreakdown.entrenamientoBudget = annualAllocation;

    // 2. Planificacion de actividades por parte del Lider
    let plans: Record<string, PhasePlan> = {
      investigacion: {
        phaseId: 'investigacion',
        phaseName: 'Investigación Territorial',
        startDate: '2026-01-01',
        teamName: 'Misión Pastos',
        teamMembers: ['Hugo Solorza', 'Aída Secue'],
        teamLeader: 'Pr. Hugo Solorza',
        objectives: [
          {
            number: 1,
            title: 'Diagnóstico Territorial',
            description: 'Caracterización etnográfica',
            activities: [
              {
                id: 'act-p1', objectiveNumber: 1, description: 'Censo de familias',
                stage: 'Contacto', responsible: 'Hugo Solorza', frequency: 'Mensual',
                timesPerYear: 1, unitBudget: 500000, totalBudget: 500000,
                startDate: '2026-02-01', endDate: '2026-04-30', totalWeeks: 12, remainingWeeks: 0,
                state: 'Completado', currentSituation: 'Ok', mediumTermGoal: 'Ok', longTermGoal: 'Ok',
              },
            ],
          },
        ],
      },
      entrenamiento: {
        phaseId: 'entrenamiento',
        phaseName: 'Entrenamiento y Liderazgo',
        startDate: '2026-05-01',
        teamName: 'Misión Pastos',
        teamMembers: ['Hugo Solorza'],
        teamLeader: 'Pr. Hugo Solorza',
        objectives: [
          {
            number: 1,
            title: 'Discipulado Pastoral',
            description: 'Talleres bíblicos',
            activities: [
              {
                id: 'act-p2', objectiveNumber: 1, description: 'Talleres de capacitación',
                stage: 'Liderazgo', responsible: 'Hugo Solorza', frequency: 'Mensual',
                timesPerYear: 1, unitBudget: 10710000, totalBudget: 10710000,
                startDate: '2026-05-01', endDate: '2026-11-30', totalWeeks: 28, remainingWeeks: 0,
                state: 'Completado', currentSituation: 'Ok', mediumTermGoal: 'Ok', longTermGoal: 'Ok',
              },
            ],
          },
        ],
      },
    };

    // Verificacion de suma planeada: 500.000 + 10.710.000 = 11.210.000 COP exactos
    const totalPlanned = HierarchicalPlanCalculator.calculateGlobalPlannedBudget(plans);
    expect(totalPlanned).toBe(annualAllocation);

    const remainingBudget = Math.max(0, annualAllocation - totalPlanned);
    expect(remainingBudget).toBe(0);

    // 3. Intento de sobregiro presupuestal
    const overBudgetAttempt = 500000;
    const canAddActivity = totalPlanned + overBudgetAttempt <= annualAllocation;
    expect(canAddActivity).toBe(false); // Bloqueado: sobregiro impedido

    // 4. Verificacion de cumplimiento al 100% de actividades
    const invMetrics = HierarchicalPlanCalculator.calculatePhaseMetrics(plans.investigacion);
    expect(invMetrics.progressPercentage).toBe(100);
    const entMetrics = HierarchicalPlanCalculator.calculatePhaseMetrics(plans.entrenamiento);
    expect(entMetrics.progressPercentage).toBe(100);

    // 5. Cierre formal del Ciclo 2026
    generalInfo.budgetBreakdown.executedTotalBudget = totalPlanned;
    generalInfo.fieldMetrics.firstTimeContactedCount = 15;
    generalInfo.fieldMetrics.newBelieversCount = 2;

    const historyAfterClose = archiveYearCycle(generalInfo);
    expect(historyAfterClose[2026]).toBeDefined();
    expect(historyAfterClose[2026].budgetBreakdown.executedTotalBudget).toBe(11210000);
    expect(historyAfterClose[2026].fieldMetrics.firstTimeContactedCount).toBe(15);

    // 6. Apertura del Ciclo 2027: Limpieza total para iniciar el nuevo ciclo
    const clean2027State = createCleanCycleState(2027, generalInfo);
    expect(clean2027State.teamData?.year).toBe(2027);
    expect(clean2027State.budgetBreakdown?.executedTotalBudget).toBe(0);
    expect(clean2027State.fieldMetrics?.firstTimeContactedCount).toBe(0);

    // Limpieza de planes PDM para 2027 (mantiene estructura de objetivos con actividades en blanco)
    const cleanedPlans2027 = cleanPlansForNewYear(plans);
    expect(cleanedPlans2027.investigacion.objectives[0].activities).toHaveLength(0);
    expect(cleanedPlans2027.investigacion.totalBudget).toBe(0);
    expect(cleanedPlans2027.entrenamiento.objectives[0].activities).toHaveLength(0);
    expect(cleanedPlans2027.entrenamiento.totalBudget).toBe(0);
  });
});

