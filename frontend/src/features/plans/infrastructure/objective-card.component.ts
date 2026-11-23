import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject } from '@angular/core';
import type { Objective, Activity } from '../domain/plan.types';
import { ObjectiveCardHeaderComponent } from './objectiveCard/objective-card-header.component';
import { ObjectiveFilterBarComponent } from './objectiveCard/objective-filter-bar.component';
import { ObjectiveActivitiesListComponent } from './objectiveCard/objective-activities-list.component';
import { SpecialExpensesListComponent } from './specialExpense/special-expenses-list.component';
import { SpecialExpensesService } from '../application/special-expenses.service';

@Component({
  selector: 'app-objective-card',
  standalone: true,
  imports: [
    ObjectiveCardHeaderComponent,
    ObjectiveFilterBarComponent,
    ObjectiveActivitiesListComponent,
    SpecialExpensesListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden transition-all">
      <div class="p-4 sm:p-5 lg:p-6 border-b border-stone-200/80 bg-white">
        <app-objective-card-header
          [objective]="objective()"
          [index]="index()"
          [completedCount]="completedCount()"
          [totalObjectiveBudget]="totalObjectiveBudget()"
          [specialBudget]="specialExpensesBudget()"
          [canEdit]="canEdit()"
          (editObjective)="editObjective.emit($event)"
          (openAddModal)="openAddModal.emit(objectiveNumber())"
          (openSpecialModal)="openSpecialModal.emit(objectiveNumber())"
        />
        <div class="mt-3.5 pt-3.5 border-t border-stone-100">
          <app-objective-filter-bar
            [filterState]="filterState()"
            [searchTerm]="searchTerm()"
            [totalActivities]="objective().activities.length"
            [pendingCount]="pendingCount()"
            [inProgressCount]="inProgressCount()"
            [completedCount]="completedCount()"
            (filterStateChanged)="filterState.set($event)"
            (searchTermChanged)="searchTerm.set($event)"
          />
        </div>
      </div>

      <div class="p-4 sm:p-5 lg:p-6 bg-[#FAF7F2]/50">
        <div class="flex items-center justify-between gap-2 mb-3.5 px-0.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-stone-600 font-['Outfit']">Matriz de Actividades</span>
            <span class="text-[11px] font-black px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
              {{ filteredActivities().length }}
            </span>
          </div>
        </div>

        <app-objective-activities-list
          [activities]="filteredActivities()"
          [objectiveNumber]="objectiveNumber()"
          [canEdit]="canEdit()"
          (activityUpdated)="activityUpdated.emit($event)"
          (activityDeleted)="activityDeleted.emit($event)"
          (openAddModal)="openAddModal.emit($event)"
          (activityEdited)="activityEdited.emit($event)"
        />

        @if (objectiveSpecialExpenses().length > 0) {
          <div class="mt-4 pt-4 border-t border-stone-200/70">
            <app-special-expenses-list
              [expenses]="objectiveSpecialExpenses()"
              [canEdit]="canEdit()"
              (deleteExpense)="specialExpensesSvc.deleteExpense($event)"
            />
          </div>
        }
      </div>
    </div>
  `,
})
export class ObjectiveCardComponent {
  readonly specialExpensesSvc = inject(SpecialExpensesService);

  readonly objective = input.required<Objective>();
  readonly index = input<number | undefined>(undefined);
  readonly canEdit = input<boolean>(true);
  readonly activityUpdated = output<{ activityId: string; updatedFields: Partial<Activity> }>();
  readonly activityDeleted = output<string>();
  readonly openAddModal = output<1 | 2 | 3 | 4>();
  readonly openSpecialModal = output<1 | 2 | 3 | 4>();
  readonly editObjective = output<Objective>();
  readonly activityEdited = output<Activity>();

  readonly filterState = signal<string>('ALL');
  readonly searchTerm = signal<string>('');

  readonly objectiveNumber = computed(() => (this.objective().number as 1 | 2 | 3 | 4) || 1);

  readonly objectiveSpecialExpenses = computed(() =>
    this.specialExpensesSvc.getExpensesForObjective(this.objectiveNumber())
  );

  readonly specialExpensesBudget = computed(() =>
    this.objectiveSpecialExpenses().reduce((sum, e) => sum + (e.budget || 0), 0)
  );

  readonly totalObjectiveBudget = computed(() =>
    this.objective().activities.reduce((acc, act) => acc + (act.totalBudget || 0), 0)
  );

  readonly completedCount = computed(() =>
    this.objective().activities.filter((act) => act.state === 'Completado').length
  );
  readonly inProgressCount = computed(() =>
    this.objective().activities.filter((act) => act.state === 'En Proceso').length
  );
  readonly pendingCount = computed(() =>
    this.objective().activities.filter((act) => act.state === 'Pendiente').length
  );

  readonly filteredActivities = computed(() => {
    const fState = this.filterState();
    const query = this.searchTerm().toLowerCase();
    return this.objective().activities.filter((act) => {
      const matchesState = fState === 'ALL' || act.state === fState;
      const matchesSearch =
        act.description.toLowerCase().includes(query) ||
        act.responsible.toLowerCase().includes(query) ||
        act.stage.toLowerCase().includes(query);
      return matchesState && matchesSearch;
    });
  });
}
