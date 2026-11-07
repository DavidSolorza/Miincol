import { Injectable, signal, computed } from '@angular/core';
import type { SpecialExpense } from '../domain/plan.types';
import { loadStoredSpecialExpenses, persistSpecialExpenses } from './specialExpensesStorage';

@Injectable({ providedIn: 'root' })
export class SpecialExpensesService {
  private activeTeamId = 'team-wayuu';
  readonly expenses = signal<SpecialExpense[]>(loadStoredSpecialExpenses(this.activeTeamId));

  readonly totalExpenses = computed(() =>
    this.expenses().reduce((sum, e) => sum + (e.budget || 0), 0)
  );

  loadForTeam(teamId: string): void {
    this.activeTeamId = teamId;
    this.expenses.set(loadStoredSpecialExpenses(teamId));
  }

  addExpense(dto: Omit<SpecialExpense, 'id' | 'createdAt'>): void {
    const newExp: SpecialExpense = {
      ...dto,
      id: 'sp-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    const updated = [newExp, ...this.expenses()];
    this.expenses.set(updated);
    persistSpecialExpenses(this.activeTeamId, updated);
  }

  deleteExpense(id: string): void {
    const updated = this.expenses().filter((e) => e.id !== id);
    this.expenses.set(updated);
    persistSpecialExpenses(this.activeTeamId, updated);
  }

  getExpensesForObjective(objNum: number): SpecialExpense[] {
    return this.expenses().filter((e) => !e.objectiveNumber || e.objectiveNumber === objNum);
  }
}
