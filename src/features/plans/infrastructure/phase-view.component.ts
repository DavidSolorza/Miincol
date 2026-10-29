import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import type { PhasePlan, Objective, Activity } from '../domain/plan.types';
import type { MissionaryTeam } from '../../auth/domain/auth.types';
import { PhaseHeaderBarComponent } from './phaseView/phase-header-bar.component';
import { PhaseObjectiveCardsGridComponent } from './phaseView/phase-objective-cards-grid.component';
import { ObjectiveCardComponent } from './objective-card.component';
import { ActivityModalComponent } from './activity-modal.component';
import { ObjectiveModalComponent } from './objective-modal.component';

@Component({
  selector: 'app-phase-view',
  standalone: true,
  imports: [
    PhaseHeaderBarComponent,
    PhaseObjectiveCardsGridComponent,
    ObjectiveCardComponent,
    ActivityModalComponent,
    ObjectiveModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-3.5 sm:space-y-4">
      <div class="bg-white/95 p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-3">
        <app-phase-header-bar
          [phaseName]="plan().phaseName"
          [objectivesCount]="plan().objectives.length"
          [hasMaxObjectives]="plan().objectives.length >= 4"
          (toggleMobileMenu)="toggleMobileMenu.emit()"
          (resetToDefaults)="resetToDefaults.emit()"
          (openCreateObjective)="openObjModal('create', null)"
        />
        <div class="flex-1 flex flex-col justify-between">
          <app-phase-objective-cards-grid
            [objectives]="plan().objectives"
            [activeObjectiveNumber]="activeObjectiveNumber()"
            (selectObjective)="selectObjective.emit($event)"
            (openCreateObjective)="openObjModal('create', null)"
          />
        </div>
      </div>

      @if (activeObjective(); as obj) {
        <app-objective-card
          [objective]="obj"
          (activityUpdated)="activityUpdated.emit($event)"
          (activityDeleted)="activityDeleted.emit($event)"
          (openAddModal)="openActModal('create', null, $event)"
          (editObjective)="openObjModal('edit', $event)"
          (activityEdited)="openActModal('edit', $event, $event.objectiveNumber)"
        />
      }

      <app-activity-modal
        [isOpen]="isAddModalOpen()"
        [mode]="activityModalMode()"
        [activityToEdit]="editingActivity()"
        [defaultObjectiveNumber]="modalDefaultObjective()"
        (closed)="closeActModal()"
        (saved)="activityAdded.emit($event)"
        (updated)="activityUpdated.emit($event)"
      />

      <app-objective-modal
        [isOpen]="isObjectiveModalOpen()"
        [mode]="objectiveModalMode()"
        [objectiveNumber]="editingObjective()?.number"
        [initialTitle]="editingObjective()?.title || ''"
        [initialDescription]="editingObjective()?.description || ''"
        [totalObjectivesCount]="plan().objectives.length"
        (closed)="isObjectiveModalOpen.set(false)"
        (saved)="handleSaveObjective($event)"
        (deleted)="objectiveDeleted.emit($event)"
      />
    </div>
  `,
})
// Vista principal de una fase ministerial que coordina objetivos estratégicos, actividades y modales
export class PhaseViewComponent {
  readonly plan = input.required<PhasePlan>(); // Plan completo de la fase activa
  readonly activeObjectiveNumber = input.required<number>(); // Número del objetivo seleccionado (1 a 4)
  readonly activeTeam = input<MissionaryTeam | undefined>(undefined); // Equipo misionero activo

  readonly selectObjective = output<number>(); // Emite cuando se selecciona una tarjeta de objetivo
  readonly activityUpdated = output<{ activityId: string; updatedFields: Partial<Activity> }>(); // Emite cambios sobre una actividad
  readonly activityDeleted = output<string>(); // Emite el ID de la actividad a eliminar
  readonly activityAdded = output<{ objectiveNumber: 1 | 2 | 3 | 4; activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'> }>(); // Emite una nueva actividad creada
  readonly objectiveUpdated = output<{ objectiveNumber: 1 | 2 | 3 | 4; updates: { title?: string; description?: string } }>(); // Emite cambios de un objetivo
  readonly objectiveAdded = output<{ title: string; description: string }>(); // Emite la creación de un nuevo objetivo
  readonly objectiveDeleted = output<1 | 2 | 3 | 4>(); // Emite el número del objetivo a eliminar
  readonly resetToDefaults = output<void>(); // Solicita restablecer los datos originales de la fase
  readonly toggleMobileMenu = output<void>(); // Solicita abrir el menú lateral en móvil

  readonly isAddModalOpen = signal(false); // Controla la visibilidad del modal de actividad
  readonly modalDefaultObjective = signal<1 | 2 | 3 | 4>(1); // Objetivo predeterminado al abrir el modal de actividad
  readonly activityModalMode = signal<'create' | 'edit'>('create'); // Modo del modal de actividad (crear o editar)
  readonly editingActivity = signal<Activity | null>(null); // Actividad en edición dentro del modal

  readonly isObjectiveModalOpen = signal(false); // Controla la visibilidad del modal de objetivo
  readonly objectiveModalMode = signal<'create' | 'edit'>('create'); // Modo del modal de objetivo (crear o editar)
  readonly editingObjective = signal<Objective | null>(null); // Objetivo en edición dentro del modal

  // Obtiene el objeto del objetivo estratégico actualmente seleccionado
  readonly activeObjective = computed(
    () => this.plan().objectives.find((o) => o.number === this.activeObjectiveNumber()) || this.plan().objectives[0]
  );

  // Abre el modal de actividad en modo creación o edición para un objetivo dado
  openActModal(mode: 'create' | 'edit', act: Activity | null, objNum: 1 | 2 | 3 | 4): void {
    this.activityModalMode.set(mode);
    this.editingActivity.set(act);
    this.modalDefaultObjective.set(objNum);
    this.isAddModalOpen.set(true);
  }

  // Cierra el modal de actividad y limpia la actividad en edición
  closeActModal(): void {
    this.isAddModalOpen.set(false);
    this.editingActivity.set(null);
  }

  // Abre el modal de objetivo estratégico en modo creación o edición
  openObjModal(mode: 'create' | 'edit', obj: Objective | null): void {
    this.objectiveModalMode.set(mode);
    this.editingObjective.set(obj);
    this.isObjectiveModalOpen.set(true);
  }

  // Procesa el guardado del modal de objetivo emitiendo creación o actualización según el modo
  handleSaveObjective(data: { title: string; description: string; number?: 1 | 2 | 3 | 4 }): void {
    if (this.objectiveModalMode() === 'create') {
      this.objectiveAdded.emit({ title: data.title, description: data.description });
    } else if (data.number) {
      this.objectiveUpdated.emit({ objectiveNumber: data.number, updates: { title: data.title, description: data.description } });
    }
  }
}
