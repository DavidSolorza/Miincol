import type { SpecialExpense } from '../domain/plan.types';

export const loadStoredSpecialExpenses = (teamId: string): SpecialExpense[] => {
  try {
    const raw = localStorage.getItem(`misincol_special_expenses_${teamId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const persistSpecialExpenses = (teamId: string, expenses: SpecialExpense[]): void => {
  try {
    localStorage.setItem(`misincol_special_expenses_${teamId}`, JSON.stringify(expenses));
  } catch (e) {
    console.warn('Error al guardar gastos especiales:', e);
  }
};
