import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, effect } from '@angular/core';
import { type PhasePlan, type Objective, type Activity, type EssentialArea, type AreaLevel, PHASE_TO_AREA } from '../domain/plan.types';
import type { MissionaryTeam } from '../../auth/domain/auth.types';
import { PlanService } from '../application/plan.service';
import { AppSessionService } from '../../../app/auth/app-session.service';
import { SpecialExpensesService } from '../application/special-expenses.service';
import { PhaseHeaderBarComponent } from './phaseView/phase-header-bar.component';
import { PhaseObjectiveCardsGridComponent } from './phaseView/phase-objective-cards-grid.component';
import { ObjectiveCardComponent } from './objective-card.component';
import { PhaseModalsComponent } from './phaseView/phase-modals.component';
import { PhaseEmptyObjectivesComponent } from './phaseView/phase-empty-objectives.component';

@Component({
  selector: 'app-phase-view',
  standalone: true,
  imports: [
    PhaseHeaderBarComponent, PhaseObjectiveCardsGridComponent,
    ObjectiveCardComponent, PhaseModalsComponent, PhaseEmptyObjectivesComponent,
  ],
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
          (openSpecialModal)="openSpecialModal($event)"
          (editObjective)="openObjModal('edit', $event)"
          (activityEdited)="openActModal('edit', $event, $any($event.objectiveNumber))"
        />
      } @else {
        <app-phase-empty-objectives
          [canEdit]="canEdit()"
          (createObjective)="openObjModal('create', null)"
        />
      }

      <app-phase-modals
        [isAddModalOpen]="isAddModalOpen()" [activityModalMode]="activityModalMode()" [editingActivity]="editingActivity()"
        [modalDefaultObjective]="modalDefaultObjective()" [currentPillarArea]="currentPillarArea()"
        [modalDefaultResponsible]="modalDefaultResponsible()" [isObjectiveModalOpen]="isObjectiveModalOpen()"
        [objectiveModalMode]="objectiveModalMode()" [editingObjective]="editingObjective()"
        [totalObjectivesCount]="plan().objectives.length" [isSpecialModalOpen]="isSpecialModalOpen()"
        [specialModalObjective]="specialModalObjective()" [activeTeam]="activeTeam()"
        (closeActModal)="closeActModal()" (closeObjModal)="isObjectiveModalOpen.set(false)"
        (closeSpecialModal)="isSpecialModalOpen.set(false)" (activityAdded)="activityAdded.emit($event)"
        (activityUpdated)="activityUpdated.emit($event)" (saveObjective)="handleSaveObjective($event)"
        (objectiveDeleted)="objectiveDeleted.emit($event)" (saveSpecialExpense)="specialExpensesSvc.addExpense($event)"
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
  readonly isSpecialModalOpen = signal(false);
  readonly specialModalObjective = signal(1);
  readonly modalDefaultObjective = signal<1 | 2 | 3 | 4>(1);
  readonly modalDefaultResponsible = signal('');
  readonly activityModalMode = signal<'create' | 'edit'>('create');
  readonly editingActivity = signal<Activity | null>(null);
  readonly isObjectiveModalOpen = signal(false);
  readonly objectiveModalMode = signal<'create' | 'edit'>('create');
  readonly editingObjective = signal<Objective | null>(null);

  private readonly planService = inject(PlanService);
  private readonly sessionSvc = inject(AppSessionService);
  readonly specialExpensesSvc = inject(SpecialExpensesService);

  readonly isReadOnly = computed(() => ['member', 'director_general'].includes(this.sessionSvc.session()?.role || ''));
  readonly canEdit = computed(() => !this.isReadOnly());
  readonly currentPillarArea = computed<EssentialArea>(() => PHASE_TO_AREA[this.plan().phaseId] || 'Investigación');
  readonly activeObjectiveIndex = computed(() => this.plan().objectives.findIndex((o) => o.number === this.activeObjectiveNumber()));
  readonly activeObjective = computed(() => this.plan().objectives.find((o) => o.number === this.activeObjectiveNumber()) || this.plan().objectives[0]);

  constructor() {
    effect(() => {
      const a = this.planService.pendingAssignee();
      if (a && !this.isReadOnly()) { this.openActModal('create', null, 1, a); this.planService.pendingAssignee.set(null); }
    });
  }

  openActModal(m: 'create' | 'edit', act: Activity | null, obj: 1 | 2 | 3 | 4, r = ''): void {
    if (this.isReadOnly()) return;
    this.activityModalMode.set(m); this.editingActivity.set(act); this.modalDefaultObjective.set(obj); this.modalDefaultResponsible.set(r); this.isAddModalOpen.set(true);
  }

  openSpecialModal(obj: 1 | 2 | 3 | 4): void {
    if (this.isReadOnly()) return;
    this.specialModalObjective.set(obj); this.isSpecialModalOpen.set(true);
  }

  closeActModal(): void { this.isAddModalOpen.set(false); this.editingActivity.set(null); this.modalDefaultResponsible.set(''); }

  openObjModal(m: 'create' | 'edit', obj: Objective | null): void {
    if (this.isReadOnly() || (m === 'create' && this.plan().objectives.length >= 4)) return;
    this.objectiveModalMode.set(m); this.editingObjective.set(obj); this.isObjectiveModalOpen.set(true);
  }

  handleSaveObjective(d: { title: string; description: string; number?: 1 | 2 | 3 | 4; essentialArea?: EssentialArea; areaLevel?: AreaLevel; stage?: string; mediumTermGoal?: string; longTermGoal?: string }): void {
    if (this.isReadOnly()) return;
    const p = { ...d, essentialArea: d.essentialArea || this.currentPillarArea() };
    if (this.objectiveModalMode() === 'create') this.objectiveAdded.emit(p);
    else if (p.number) this.objectiveUpdated.emit({ objectiveNumber: p.number, updates: p });
  }
}
