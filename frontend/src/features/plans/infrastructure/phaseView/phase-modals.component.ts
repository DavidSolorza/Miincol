import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import type { Activity, Objective, EssentialArea, AreaLevel, SpecialExpense } from '../../domain/plan.types';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';
import { ActivityModalComponent } from '../activity-modal.component';
import { ObjectiveModalComponent } from '../objective-modal.component';
import { SpecialExpenseModalComponent } from '../specialExpense/special-expense-modal.component';

@Component({
  selector: 'app-phase-modals',
  standalone: true,
  imports: [ActivityModalComponent, ObjectiveModalComponent, SpecialExpenseModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-activity-modal
      [isOpen]="isAddModalOpen()" [mode]="activityModalMode()" [activityToEdit]="editingActivity()"
      [defaultObjectiveNumber]="modalDefaultObjective()" [currentPillarArea]="currentPillarArea()"
      [defaultResponsible]="modalDefaultResponsible()" (closed)="closeActModal.emit()"
      (saved)="activityAdded.emit($event)" (updated)="activityUpdated.emit($event)"
    />

    <app-objective-modal
      [isOpen]="isObjectiveModalOpen()" [mode]="objectiveModalMode()" [objectiveNumber]="$any(editingObjective()?.number)"
      [initialTitle]="editingObjective()?.title || ''" [initialDescription]="editingObjective()?.description || ''"
      [initialEssentialArea]="editingObjective()?.essentialArea || currentPillarArea()" [initialAreaLevel]="editingObjective()?.areaLevel"
      [initialStage]="editingObjective()?.stage || ''" [initialShortTermGoal]="editingObjective()?.shortTermGoal || ''"
      [initialMediumTermGoal]="editingObjective()?.mediumTermGoal || ''" [initialLongTermGoal]="editingObjective()?.longTermGoal || ''"
      [totalObjectivesCount]="totalObjectivesCount()" (closed)="closeObjModal.emit()"
      (saved)="saveObjective.emit($event)" (deleted)="objectiveDeleted.emit($event)"
    />

    <app-special-expense-modal
      [isOpen]="isSpecialModalOpen()"
      [teamId]="activeTeam()?.id || 'team-wayuu'"
      [objectiveNumber]="specialModalObjective()"
      [defaultArea]="currentPillarArea()"
      (closed)="closeSpecialModal.emit()"
      (saved)="saveSpecialExpense.emit($event)"
    />
  `,
})
export class PhaseModalsComponent {
  readonly isAddModalOpen = input.required<boolean>();
  readonly activityModalMode = input.required<'create' | 'edit'>();
  readonly editingActivity = input<Activity | null>(null);
  readonly modalDefaultObjective = input.required<1 | 2 | 3 | 4>();
  readonly currentPillarArea = input.required<EssentialArea>();
  readonly modalDefaultResponsible = input<string>('');
  readonly isObjectiveModalOpen = input.required<boolean>();
  readonly objectiveModalMode = input.required<'create' | 'edit'>();
  readonly editingObjective = input<Objective | null>(null);
  readonly totalObjectivesCount = input.required<number>();
  readonly isSpecialModalOpen = input.required<boolean>();
  readonly specialModalObjective = input.required<number>();
  readonly activeTeam = input<MissionaryTeam | undefined>(undefined);

  readonly closeActModal = output<void>();
  readonly closeObjModal = output<void>();
  readonly closeSpecialModal = output<void>();
  readonly activityAdded = output<{ objectiveNumber: 1 | 2 | 3 | 4; activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'> }>();
  readonly activityUpdated = output<{ activityId: string; updatedFields: Partial<Activity> }>();
  readonly saveObjective = output<{ title: string; description: string; number?: 1 | 2 | 3 | 4; essentialArea?: EssentialArea; areaLevel?: AreaLevel; stage?: string; mediumTermGoal?: string; longTermGoal?: string }>();
  readonly objectiveDeleted = output<number>();
  readonly saveSpecialExpense = output<Omit<SpecialExpense, 'id' | 'createdAt'>>();
}

