import { describe, it, expect } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { GeneralAnnualTableComponent } from './general-annual-table.component';
import type { GeneralTeamData, FieldMinistryMetrics, AnnualHistoryRecord } from '../../domain/general-info.types';

describe('GeneralAnnualTableComponent', () => {
  const createComponent = (): GeneralAnnualTableComponent => {
    const injector = createEnvironmentInjector([], null as unknown as import('@angular/core').EnvironmentInjector);
    return runInInjectionContext(injector, () => new GeneralAnnualTableComponent());
  };

  const mockTeamData: GeneralTeamData = {
    teamName: 'Misión Pastos',
    year: 2027,
    population: '120.000',
    territory: 'Cumbal',
    teamLeader: 'Pr. Hugo',
    evangelicalCongregationsCount: 4,
    evangelicalBelieversCount: 400,
    members: [],
  };

  const mockHistory: Record<number, AnnualHistoryRecord> = {
    2026: {
      year: 2026,
      closedAt: '2026-12-31T23:59:59.000Z',
      fieldMetrics: {
        firstTimeContactedCount: 15,
        interestedInGospelCount: 6,
        heardGospelCount: 4,
        seekingGodCount: 2,
        gospelResponseOpportunitiesCount: 2,
        newBelieversCount: 2,
        baptizedCount: 0,
        regularBibleStudyParticipantsCount: 45,
        personalMentorshipCount: 12,
        newGroupsMeetingInYearCount: 1,
      },
      training: {} as any,
      church: {} as any,
      budgetBreakdown: {} as any,
      essentialsToDevelop: [],
    },
  };

  it('debe definir las 8 filas de metricas de campo oficiales del modelo Excel', () => {
    const comp = createComponent();
    expect(comp.rows).toHaveLength(8);
    expect(comp.rows[0].key).toBe('firstTimeContactedCount');
    expect(comp.rows[7].key).toBe('personalMentorshipCount');
  });

  it('debe computar el anio actual desde teamData', () => {
    const comp = createComponent();
    (comp as unknown as { teamData: () => GeneralTeamData }).teamData = () => mockTeamData;
    expect(comp.currentYear()).toBe(2027);
  });

  it('debe obtener el valor archivado del historial para el anio 2026', () => {
    const comp = createComponent();
    (comp as unknown as { history: () => Record<number, AnnualHistoryRecord> }).history = () => mockHistory;
    const val = comp.getPastValue(2026, 'firstTimeContactedCount', 10);
    expect(val).toBe(15);
  });

  it('debe devolver el valor base por defecto para el anio 2025 si no esta en historial', () => {
    const comp = createComponent();
    (comp as unknown as { history: () => Record<number, AnnualHistoryRecord> | undefined }).history = () => undefined;
    const val = comp.getPastValue(2025, 'firstTimeContactedCount', 10);
    expect(val).toBe(10);
  });

  it('debe emitir la metrica actualizada al invocar onMetricChange', () => {
    const comp = createComponent();
    let emitted: Partial<FieldMinistryMetrics> | undefined;
    comp.metricChanged.subscribe((m) => { emitted = m; });

    const fakeEvent = { target: { value: '25' } } as unknown as Event;
    comp.onMetricChange('firstTimeContactedCount', fakeEvent);

    expect(emitted).toEqual({ firstTimeContactedCount: 25 });
  });
});

