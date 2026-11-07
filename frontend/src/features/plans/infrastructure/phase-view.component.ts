import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, effect } from '@angular/core';
import { type PhasePlan, type Objective, type Activity, type EssentialArea, type AreaLevel, PHASE_TO_AREA } from '../domain/plan.types';
import type { MissionaryTeam } from '../../auth/domain/auth.types';
import { PlanService } from '../application/plan.service';
import { AppSessionService } from '../../../app/auth/app-session.service';
import { PhaseHeaderBarComponent } from './phaseView/phase-header-bar.component';
import { PhaseObjectiveCardsGridComponent } from './phaseView/phase-objective-cards-grid.component';
import { ObjectiveCardComponent } from './objective-card.component';
import { ActivityModalComponent } from './activity-modal.component';
import { ObjectiveModalComponent } from './objective-modal.component';

@Component({
  selector: 'app-phase-view',
  standalone: true,
  imports: [PhaseHeaderBarComponent, PhaseObjectiveCardsGridComponent, ObjectiveCardComponent, ActivityModalComponent, ObjectiveModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-3.5 sm:space-y-4">
      <div class="bg-white/95 p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-3">
        <app-phase-header-bar
          [phaseName]="plan().phaseName"
          [objectivesCount]="plan().objectives.length"
          [hasMaxObjectives]="plan().objectives.length >= 4"
          [canEdit]="canEdit()"
          (toggleMobileMenu)="toggleMobileMenu.emit()"
          (resetToDefaults)="resetToDefaults.emit()"
          (openCreateObjective)="openObjModal('create', null)"
        />
        <div class="flex-1 flex flex-col justify-between">
          <app-phase-objective-cards-grid
            [objectives]="plan().objectives"
            [activeObjectiveNumber]="activeObjectiveNumber()"
            [canEdit]="canEdit()"
            (selectObjective)="selectObjective.emit($event)"
            (openCreateObjective)="openObjModal('create', null)"
          />
        </div>
      </div>

      @if (activeObjective(); as obj) {
        <app-objective-card
          [objective]="obj"
          [index]="activeObjectiveIndex()"
          [canEdit]="canEdit()"
          (activityUpdated)="activityUpdated.emit($event)"
          (activityDeleted)="activityDeleted.emit($event)"
          (openAddModal)="openActModal('create', null, $event)"
          (editObjective)="openObjModal('edit', $event)"
          (activityEdited)="openActModal('edit', $event, $any($event.objectiveNumber))"
        />
      }

      <app-activity-modal
        [isOpen]="isAddModalOpen()" [mode]="activityModalMode()" [activityToEdit]="editingActivity()"
        [defaultObjectiveNumber]="modalDefaultObjective()" [currentPillarArea]="currentPillarArea()"
        [defaultResponsible]="modalDefaultResponsible()" (closed)="closeActModal()"
        (saved)="activityAdded.emit($event)" (updated)="activityUpdated.emit($event)"
      />

      <app-objective-modal
        [isOpen]="isObjectiveModalOpen()" [mode]="objectiveModalMode()" [objectiveNumber]="$any(editingObjective()?.number)"
        [initialTitle]="editingObjective()?.title || ''" [initialDescription]="editingObjective()?.description || ''"
        [initialEssentialArea]="editingObjective()?.essentialArea || currentPillarArea()" [initialAreaLevel]="editingObjective()?.areaLevel"
        [initialStage]="editingObjective()?.stage || ''" [initialShortTermGoal]="editingObjective()?.shortTermGoal || ''"
        [initialMediumTermGoal]="editingObjective()?.mediumTermGoal || ''" [initialLongTermGoal]="editingObjective()?.longTermGoal || ''"
        [totalObjectivesCount]="plan().objectives.length" (closed)="isObjectiveModalOpen.set(false)"
        (saved)="handleSaveObjective($event)" (deleted)="objectiveDeleted.emit($event)"
      />
    </div>
  `,
})
export class PhaseViewComponent {
  readonly plan = input.required<PhasePlan>();
  readonly activeObjectiveNumber = input.required<number>();
  readonly activeTeam = input<MissionaryTeam | undefined>(undefined);

  readonly selectObjective = output<number>();
  readonly activityUpdated = output<{ activityId: string; updatedFields: Partial<Activity> }>();
  readonly activityDeleted = output<string>();
  readonly activityAdded = output<{ objectiveNumber: 1 | 2 | 3 | 4; activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'> }>();
  readonly objectiveUpdated = output<{ objectiveNumber: number; updates: Partial<Objective> }>();
  readonly objectiveAdded = output<{ title: string; description: string; essentialArea?: EssentialArea; areaLevel?: AreaLevel; stage?: string; mediumTermGoal?: string; longTermGoal?: string }>();
  readonly objectiveDeleted = output<number>();
  readonly resetToDefaults = output<void>();
  readonly toggleMobileMenu = output<void>();

  readonly isAddModalOpen = signal(false);
  readonly modalDefaultObjective = signal<1 | 2 | 3 | 4>(1);
  readonly modalDefaultResponsible = signal('');
  readonly activityModalMode = signal<'create' | 'edit'>('create');
  readonly editingActivity = signal<Activity | null>(null);
  readonly isObjectiveModalOpen = signal(false);
  readonly objectiveModalMode = signal<'create' | 'edit'>('create');
  readonly editingObjective = signal<Objective | null>(null);

  private readonly planService = inject(PlanService);
  private readonly sessionSvc = inject(AppSessionService);

  readonly isMember = computed(() => this.sessionSvc.session()?.role === 'member');
  readonly canEdit = computed(() => !this.isMember());
  readonly currentPillarArea = computed<EssentialArea>(() => PHASE_TO_AREA[this.plan().phaseId] || 'Investigación');
  readonly activeObjectiveIndex = computed(() => this.plan().objectives.findIndex((o) => o.number === this.activeObjectiveNumber()));
  readonly activeObjective = computed(() => this.plan().objectives.find((o) => o.number === this.activeObjectiveNumber()) || this.plan().objectives[0]);

  constructor() {
    effect(() => {
      const assignee = this.planService.pendingAssignee();
      if (assignee && !this.isMember()) {
        this.openActModal('create', null, 1, assignee);
        this.planService.pendingAssignee.set(null);
      }
    }, { allowSignalWrites: true });
  }

  openActModal(mode: 'create' | 'edit', act: Activity | null, objNum: 1 | 2 | 3 | 4, responsible = ''): void {
    if (this.isMember()) return;
    this.activityModalMode.set(mode);
    this.editingActivity.set(act);
    this.modalDefaultObjective.set(objNum);
    this.modalDefaultResponsible.set(responsible);
    this.isAddModalOpen.set(true);
  }

  closeActModal(): void { this.isAddModalOpen.set(false); this.editingActivity.set(null); this.modalDefaultResponsible.set(''); }

  openObjModal(mode: 'create' | 'edit', obj: Objective | null): void {
    if (this.isMember() || (mode === 'create' && this.plan().objectives.length >= 4)) return;
    this.objectiveModalMode.set(mode); this.editingObjective.set(obj); this.isObjectiveModalOpen.set(true);
  }

  handleSaveObjective(data: { title: string; description: string; number?: 1 | 2 | 3 | 4; essentialArea?: EssentialArea; areaLevel?: AreaLevel; stage?: string; mediumTermGoal?: string; longTermGoal?: string }): void {
    if (this.isMember()) return;
    const payload = { ...data, essentialArea: data.essentialArea || this.currentPillarArea() };
    if (this.objectiveModalMode() === 'create') {
      this.objectiveAdded.emit(payload);
    } else if (payload.number) {
      this.objectiveUpdated.emit({ objectiveNumber: payload.number, updates: payload });
    }
  }
}
