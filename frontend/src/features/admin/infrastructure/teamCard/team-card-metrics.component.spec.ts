import { describe, it, expect } from 'vitest';
import { TeamCardMetricsComponent } from './team-card-metrics.component';
import type { TeamSupervisionSummary } from '../../domain/admin.types';

describe('TeamCardMetricsComponent (Component Unit Tests)', () => {
  const baseTeam: TeamSupervisionSummary = {
    id: 'team-pastos',
    name: 'Equipo Étnico Pastos',
    pdmPhase: 'Inmersión Comunitaria',
    year: 2026,
    progressPercentage: 45,
    totalBudget: 11210000,
    executedBudget: 5605000,
    status: 'Activo',
    activeInitiatives: [
      { id: 'act-1', name: 'Contacto Inicial', stage: 'Contacto', progress: 80 },
      { id: 'act-2', name: 'Traducción Oral', stage: 'Comunicar', progress: 50 },
    ],
  };

  it('debe calcular el porcentaje de presupuesto ejecutado correctamente', () => {
    const comp = new TeamCardMetricsComponent();
    comp.team = { ...baseTeam, totalBudget: 10000000, executedBudget: 5000000 };

    expect(comp.budgetPercentage).toBe(50);
  });

  it('debe limitar el porcentaje al 100% si el ejecutado excede el presupuesto', () => {
    const comp = new TeamCardMetricsComponent();
    comp.team = { ...baseTeam, totalBudget: 10000000, executedBudget: 15000000 };

    expect(comp.budgetPercentage).toBe(100);
  });

  it('debe retornar 0% cuando el presupuesto total es cero o no existe', () => {
    const comp = new TeamCardMetricsComponent();
    comp.team = { ...baseTeam, totalBudget: 0, executedBudget: 0 };

    expect(comp.budgetPercentage).toBe(0);
  });

  it('debe formatear el presupuesto total en formato COP legible', () => {
    const comp = new TeamCardMetricsComponent();
    comp.team = baseTeam;

    expect(comp.formattedBudget).toContain('11.210.000');
  });

  it('debe extraer las etapas activas únicas de las iniciativas', () => {
    const comp = new TeamCardMetricsComponent();
    comp.team = baseTeam;

    expect(comp.activeStages).toEqual(['Contacto', 'Comunicar']);
  });

  it('debe usar etapas por defecto cuando no hay iniciativas activas', () => {
    const comp = new TeamCardMetricsComponent();
    comp.team = { ...baseTeam, activeInitiatives: [] };

    expect(comp.activeStages).toEqual(['Contacto', 'Comunicar']);
  });
});
