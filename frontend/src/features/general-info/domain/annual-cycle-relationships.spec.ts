import { describe, it, expect } from 'vitest';
import { createDefaultGeneralInfo } from './general-info-defaults';
import { archiveYearCycle } from './general-info-history.helper';
import { createCleanCycleState } from './general-info-reset.helper';
import { ANNUAL_TABLE_ROWS } from './general-annual-table.rows';

describe('Pruebas de Relacion del Ciclo Multianual (2025 Base -> 2026 Cerrado -> 2027 Activo)', () => {
  it('debe mantener la relacion inmutable de los anios cerrados en el historial', () => {
    const generalInfo = createDefaultGeneralInfo('team-pastos', 'Misión Pastos', 'Pr. Hugo Solorza');

    // Estado del anio 2026 antes de cerrar
    generalInfo.fieldMetrics.firstTimeContactedCount = 15;
    generalInfo.fieldMetrics.baptizedCount = 2;
    generalInfo.budgetBreakdown.executedTotalBudget = 4500000;

    // Ejecuta el archivado en historial
    const history = archiveYearCycle(generalInfo);

    expect(history[2025]).toBeDefined();
    expect(history[2025].fieldMetrics.firstTimeContactedCount).toBe(10); // Base 2025

    expect(history[2026]).toBeDefined();
    expect(history[2026].fieldMetrics.firstTimeContactedCount).toBe(15); // Snapshot 2026
    expect(history[2026].fieldMetrics.baptizedCount).toBe(2);
    expect(history[2026].budgetBreakdown.executedTotalBudget).toBe(4500000);
  });

  it('debe limpiar los contadores y presupuesto ejecutado manteniendo los datos del equipo para 2027', () => {
    const generalInfo = createDefaultGeneralInfo('team-pastos', 'Misión Pastos');
    generalInfo.fieldMetrics.firstTimeContactedCount = 18;
    generalInfo.budgetBreakdown.executedTotalBudget = 11210000;

    const clean2027 = createCleanCycleState(2027, generalInfo);

    // Verificacion de relacion de datos de equipo preservados
    expect(clean2027.teamData?.teamName).toBe('Misión Pastos');
    expect(clean2027.teamData?.year).toBe(2027);
    expect(clean2027.teamData?.isYearClosed).toBe(false);

    // Verificacion de reseteo limpio para iniciar el nuevo ciclo
    expect(clean2027.fieldMetrics?.firstTimeContactedCount).toBe(0);
    expect(clean2027.fieldMetrics?.baptizedCount).toBe(0);
    expect(clean2027.fieldMetrics?.regularBibleStudyParticipantsCount).toBe(0);
    expect(clean2027.ministerialTraining?.practicalMinisterialTrainingCount).toBe(0);
    expect(clean2027.churchDevelopment?.finalChurchesCount).toBe(0);
    expect(clean2027.budgetBreakdown?.executedTotalBudget).toBe(0);
  });

  it('debe relacionar exactamente las 8 metricas de campo oficiales con las filas del modelo Excel', () => {
    const keys = ANNUAL_TABLE_ROWS.map((r) => r.key);
    expect(keys).toHaveLength(8);
    expect(keys).toEqual([
      'firstTimeContactedCount',
      'interestedInGospelCount',
      'seekingGodCount',
      'gospelResponseOpportunitiesCount',
      'newBelieversCount',
      'baptizedCount',
      'regularBibleStudyParticipantsCount',
      'personalMentorshipCount',
    ]);
  });
});
