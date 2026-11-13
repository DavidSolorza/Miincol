import type { TeamGeneralInfo, AnnualHistoryRecord } from './general-info.types';

// Crea un registro inmutable del ciclo anual que se esta cerrando
export function createHistorySnapshot(info: TeamGeneralInfo): AnnualHistoryRecord {
  return {
    year: info.teamData.year,
    closedAt: new Date().toISOString(),
    fieldMetrics: { ...info.fieldMetrics },
    training: { ...info.ministerialTraining },
    church: { ...info.churchDevelopment },
    budgetBreakdown: { ...info.budgetBreakdown },
    essentialsToDevelop: [...info.essentialsToDevelop],
  };
}

// Consolida el registro del anio en el mapa de historial multianual del equipo
export function archiveYearCycle(info: TeamGeneralInfo): Record<number, AnnualHistoryRecord> {
  const currentHistory = info.annualMetricsHistory || {};
  const snapshot = createHistorySnapshot(info);
  return {
    ...currentHistory,
    [info.teamData.year]: snapshot,
  };
}

// Respalda el estado de planes y actividades PDM del anio cerrado en almacenamiento local
export function backupPdmPlansSnapshot(teamId: string, closingYear: number): void {
  try {
    const plansKey = `misincol_pdm_plans_${teamId}`;
    const raw = localStorage.getItem(plansKey);
    if (raw) {
      localStorage.setItem(`misincol_pdm_history_${teamId}_${closingYear}`, raw);
    }
  } catch (e) {
    console.warn(`[HistoryHelper] Error al respaldar snapshot PDM de ${closingYear}:`, e);
  }
}

