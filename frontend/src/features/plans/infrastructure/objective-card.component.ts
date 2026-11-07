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
    <div class="space-y-3.5 sm:space-y-4">
      <div class="bg-white/95 rounded-2xl border border-stone-200/80 shadow-xs p-4 sm:p-5">
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

      <div class="bg-white/95 rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <app-objective-activities-list
          [activities]="filteredActivities()"
          [objectiveNumber]="objectiveNumber()"
          [canEdit]="canEdit()"
          (activityUpdated)="activityUpdated.emit($event)"
          (activityDeleted)="activityDeleted.emit($event)"
          (openAddModal)="openAddModal.emit($event)"
          (activityEdited)="activityEdited.emit($event)"
        />

        <div class="px-4 pb-4">
          <app-special-expenses-list
            [expenses]="objectiveSpecialExpenses()"
            [canEdit]="canEdit()"
            (deleteExpense)="specialExpensesSvc.deleteExpense($event)"
          />
        </div>
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
