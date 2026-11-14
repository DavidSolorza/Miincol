import { describe, it, expect } from 'vitest';
import { calculateNationalKpis } from './adminKpiCalculations';
import { FIXTURE_NATIONAL_TEAMS } from './initialTeams/index';

describe('adminKpiCalculations (Frontend Unit Tests)', () => {
  it('debe calcular exactamente los KPIs nacionales con los 6 equipos territoriales', () => {
    const kpis = calculateNationalKpis(FIXTURE_NATIONAL_TEAMS);

    expect(kpis.totalTeams).toBe(6);
    expect(kpis.totalNationalBudget).toBe(94610000);
    expect(kpis.totalExecutedBudget).toBe(44206000);
    expect(kpis.totalMissionaries).toBeGreaterThan(0);
    expect(kpis.nationalAverageProgress).toBeGreaterThan(0);
  });

  it('debe manejar una lista vacía de equipos de forma segura', () => {
    const emptyKpis = calculateNationalKpis([]);

    expect(emptyKpis.totalTeams).toBe(0);
    expect(emptyKpis.totalNationalBudget).toBe(0);
    expect(emptyKpis.totalExecutedBudget).toBe(0);
    expect(emptyKpis.nationalAverageProgress).toBe(0);
  });
});
