import { Component, ChangeDetectionStrategy, input, output, signal, effect, inject } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ObjectiveFormFieldsComponent } from './objectiveModal/objective-form-fields.component';
import { ObjectiveModalActionsComponent } from './objectiveModal/objective-modal-actions.component';
import type { EssentialArea, AreaLevel } from '../domain/plan.types';

@Component({
  selector: 'app-objective-modal',
  standalone: true,
  imports: [ModalComponent, ObjectiveFormFieldsComponent, ObjectiveModalActionsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [title]="mode() === 'edit' ? 'Editar Objetivo #' + objectiveNumber() : 'Nuevo Objetivo Estratégico'"
      [subtitle]="mode() === 'edit' ? 'Modifique área, etapa y justificación estratégica' : 'Defina un nuevo eje estratégico ministerial'"
      maxWidth="lg"
      (closed)="closed.emit()"
    >
      <form (submit)="handleSubmit($event)" novalidate class="space-y-4 text-xs">
        <app-objective-form-fields
          [totalObjectivesCount]="totalObjectivesCount()"
          [error]="error()"
          [title]="title()"
          [description]="description()"
          [essentialArea]="essentialArea()"
          [stage]="stage()"
          [mediumTermGoal]="mediumTermGoal()"
          [longTermGoal]="longTermGoal()"
          (titleChanged)="title.set($event)"
          (descriptionChanged)="description.set($event)"
          (essentialAreaChanged)="essentialArea.set($event)"
          (stageChanged)="stage.set($event)"
          (mediumTermGoalChanged)="mediumTermGoal.set($event)"
          (longTermGoalChanged)="longTermGoal.set($event)"
        />
        <app-objective-modal-actions
          [isEdit]="mode() === 'edit'"
          [objectiveNumber]="objectiveNumber()"
          [totalObjectivesCount]="totalObjectivesCount()"
          [confirmDelete]="confirmDelete()"
          (confirmDeleteChanged)="confirmDelete.set($event)"
          (deleted)="handleDelete()"
          (closed)="closed.emit()"
        />
      </form>
    </app-modal>
  `,
})
export class ObjectiveModalComponent {
  private readonly toastService = inject(ToastService);

  readonly isOpen = input.required<boolean>();
  readonly mode = input.required<'create' | 'edit'>();
  readonly objectiveNumber = input<1 | 2 | 3 | 4 | undefined>(undefined);
  readonly initialTitle = input<string>('');
  readonly initialDescription = input<string>('');
  readonly initialEssentialArea = input<EssentialArea | undefined>(undefined);
  readonly initialAreaLevel = input<AreaLevel | undefined>(undefined);
  readonly initialStage = input<string | undefined>('');
  readonly initialMediumTermGoal = input<string | undefined>('');
  readonly initialLongTermGoal = input<string | undefined>('');
  readonly totalObjectivesCount = input.required<number>();

  readonly closed = output<void>();
  readonly saved = output<{
    title: string; description: string; number?: 1 | 2 | 3 | 4;
    essentialArea?: EssentialArea; areaLevel?: AreaLevel;
    stage?: string; mediumTermGoal?: string; longTermGoal?: string;
  }>();
  readonly deleted = output<1 | 2 | 3 | 4>();

  readonly title = signal('');
  readonly description = signal('');
  readonly essentialArea = signal<EssentialArea>('Investigación');
  readonly stage = signal('');
  readonly mediumTermGoal = signal('');
  readonly longTermGoal = signal('');
  readonly error = signal<string | null>(null);
  readonly confirmDelete = signal(false);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.title.set(this.initialTitle());
        this.description.set(this.initialDescription());
        this.essentialArea.set(this.initialEssentialArea() || 'Investigación');
        this.stage.set(this.initialStage() || '');
        this.mediumTermGoal.set(this.initialMediumTermGoal() || '');
        this.longTermGoal.set(this.initialLongTermGoal() || '');
        this.error.set(null);
        this.confirmDelete.set(false);
      }
    });
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error.set(null);
    if (!this.title().trim() || !this.description().trim()) {
      const msg = 'El título y la descripción del objetivo son obligatorios.';
      this.error.set(msg);
      this.toastService.toast.warning(msg, 'Campo Requerido');
      return;
    }

    this.saved.emit({
      title: this.title().trim(),
      description: this.description().trim(),
      number: this.objectiveNumber(),
      essentialArea: this.essentialArea(),
      stage: this.stage().trim() || undefined,
      mediumTermGoal: this.mediumTermGoal().trim(),
      longTermGoal: this.longTermGoal().trim(),
    });
    this.toastService.toast.success(
      this.mode() === 'edit' ? `Objetivo #${this.objectiveNumber()} actualizado` : 'Nuevo objetivo agregado',
      'Objetivo Guardado'
    );
    this.closed.emit();
  }

  handleDelete(): void {
    const objNum = this.objectiveNumber();
    if (!objNum) return;
    if (this.totalObjectivesCount() <= 1) {
      const msg = 'Debe contar con al menos un objetivo por fase.';
      this.error.set(msg);
      this.toastService.toast.warning(msg, 'Regla Ministerial');
      return;
    }
    if (!this.confirmDelete()) {
      this.confirmDelete.set(true);
      return;
    }
    this.deleted.emit(objNum);
    this.toastService.toast.info(`Objetivo #${objNum} eliminado`, 'Objetivo Eliminado');
    this.closed.emit();
  }
}
