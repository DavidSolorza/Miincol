import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import type { Objective, Activity } from '../domain/plan.types';
import { ObjectiveCardHeaderComponent } from './objectiveCard/objective-card-header.component';
import { ObjectiveFilterBarComponent } from './objectiveCard/objective-filter-bar.component';
import { ObjectiveActivitiesListComponent } from './objectiveCard/objective-activities-list.component';

@Component({
  selector: 'app-objective-card',
  standalone: true,
  imports: [
    ObjectiveCardHeaderComponent,
    ObjectiveFilterBarComponent,
    ObjectiveActivitiesListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3.5 sm:space-y-4">
      <div class="bg-white/95 rounded-2xl border border-stone-200/80 shadow-xs p-4 sm:p-5">
        <app-objective-card-header
          [objective]="objective()"
          [completedCount]="completedCount()"
          [totalObjectiveBudget]="totalObjectiveBudget()"
          (editObjective)="editObjective.emit($event)"
          (openAddModal)="openAddModal.emit(objectiveNumber())"
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
          (activityUpdated)="activityUpdated.emit($event)"
          (activityDeleted)="activityDeleted.emit($event)"
          (openAddModal)="openAddModal.emit($event)"
          (activityEdited)="activityEdited.emit($event)"
        />
      </div>
    </div>
  `,
})
export class ObjectiveCardComponent {
  readonly objective = input.required<Objective>();
  readonly activityUpdated = output<{ activityId: string; updatedFields: Partial<Activity> }>();
  readonly activityDeleted = output<string>();
  readonly openAddModal = output<1 | 2 | 3 | 4>();
  readonly editObjective = output<Objective>();
  readonly activityEdited = output<Activity>();

  readonly filterState = signal<string>('ALL');
  readonly searchTerm = signal<string>('');

  readonly objectiveNumber = computed(() => (this.objective().number as 1 | 2 | 3 | 4) || 1);
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

