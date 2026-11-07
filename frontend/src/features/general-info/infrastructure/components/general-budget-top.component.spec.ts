import { describe, it, expect } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { GeneralBudgetTopComponent } from './general-budget-top.component';
import type { PillarBudgetBreakdown } from '../../domain/general-info.types';

describe('GeneralBudgetTopComponent (Component Unit Tests)', () => {
  const mockPillars: PillarBudgetBreakdown = {
    investigacionBudget: 2500000,
    encarnacionBudget: 3000000,
    evangelizacionBudget: 1500000,
    entrenamientoBudget: 2210000,
    autocuidadoBudget: 2000000,
  };

  const createComponent = (): GeneralBudgetTopComponent => {
    const injector = createEnvironmentInjector([], null as unknown as import('@angular/core').EnvironmentInjector);
    return runInInjectionContext(injector, () => new GeneralBudgetTopComponent());
  };

  it('debe listar los 5 pilares estratégicos ministeriales en orden', () => {
    const comp = createComponent();
    expect(comp.pillars).toHaveLength(5);
    expect(comp.pillars.map((p) => p.key)).toEqual([
      'investigacionBudget',
      'encarnacionBudget',
      'evangelizacionBudget',
      'entrenamientoBudget',
      'autocuidadoBudget',
    ]);
  });

  it('debe obtener los montos correctos por cada pilar de presupuesto', () => {
    const comp = createComponent();
    (comp as unknown as { budget: () => PillarBudgetBreakdown }).budget = () => mockPillars;

    expect(comp.getBudgetAmount('investigacionBudget')).toBe(2500000);
    expect(comp.getBudgetAmount('encarnacionBudget')).toBe(3000000);
    expect(comp.getBudgetAmount('evangelizacionBudget')).toBe(1500000);
    expect(comp.getBudgetAmount('entrenamientoBudget')).toBe(2210000);
    expect(comp.getBudgetAmount('autocuidadoBudget')).toBe(2000000);
  });

  it('debe formatear los valores monetarios en pesos colombianos (COP)', () => {
    const comp = createComponent();
    const formatted = comp.formatCurrency(11210000);
    expect(formatted).toContain('11.210.000');
  });

  it('debe manejar montos no definidos o nulos devolviendo 0', () => {
    const comp = createComponent();
    (comp as unknown as { budget: () => Partial<PillarBudgetBreakdown> }).budget = () => ({});
    expect(comp.getBudgetAmount('investigacionBudget')).toBe(0);
  });
});
