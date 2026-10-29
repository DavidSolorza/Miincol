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
// Contenedor de detalle de un objetivo estratégico con cabecera, filtros y lista de actividades
export class ObjectiveCardComponent {
  readonly objective = input.required<Objective>(); // Objetivo estratégico que se visualiza
  readonly activityUpdated = output<{ activityId: string; updatedFields: Partial<Activity> }>(); // Emite actualizaciones de una actividad
  readonly activityDeleted = output<string>(); // Emite el ID de la actividad eliminada
  readonly openAddModal = output<1 | 2 | 3 | 4>(); // Solicita abrir el modal para agregar actividad en este objetivo
  readonly editObjective = output<Objective>(); // Solicita abrir el modal de edición del objetivo
  readonly activityEdited = output<Activity>(); // Solicita abrir el modal de edición para una actividad

  readonly filterState = signal<string>('ALL'); // Estado seleccionado para filtrar actividades ('ALL' o estado específico)
  readonly searchTerm = signal<string>(''); // Término de búsqueda textual para filtrar actividades

  // Número del objetivo tipado del 1 al 4
  readonly objectiveNumber = computed(() => (this.objective().number as 1 | 2 | 3 | 4) || 1);
  // Suma total del presupuesto de todas las actividades del objetivo
  readonly totalObjectiveBudget = computed(() =>
    this.objective().activities.reduce((acc, act) => acc + (act.totalBudget || 0), 0)
  );
  // Cantidad de actividades en estado 'Completado'
  readonly completedCount = computed(() =>
    this.objective().activities.filter((act) => act.state === 'Completado').length
  );
  // Cantidad de actividades en estado 'En Proceso'
  readonly inProgressCount = computed(() =>
    this.objective().activities.filter((act) => act.state === 'En Proceso').length
  );
  // Cantidad de actividades en estado 'Pendiente'
  readonly pendingCount = computed(() =>
    this.objective().activities.filter((act) => act.state === 'Pendiente').length
  );

  // Lista de actividades filtradas por estado y coincidencia de texto en descripción, responsable o etapa
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

