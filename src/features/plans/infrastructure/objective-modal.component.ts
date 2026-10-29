import { Component, ChangeDetectionStrategy, input, output, signal, effect, inject } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ObjectiveFormFieldsComponent } from './objectiveModal/objective-form-fields.component';
import { ObjectiveModalActionsComponent } from './objectiveModal/objective-modal-actions.component';

@Component({
  selector: 'app-objective-modal',
  standalone: true,
  imports: [ModalComponent, ObjectiveFormFieldsComponent, ObjectiveModalActionsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [title]="mode() === 'edit' ? 'Editar Objetivo #' + objectiveNumber() : 'Nuevo Objetivo Estratégico'"
      [subtitle]="
        mode() === 'edit'
          ? 'Modifique el título y la justificación estratégica de este objetivo en la fase actual'
          : 'Defina un nuevo eje estratégico para el equipo territorial (' + totalObjectivesCount() + '/4 objetivos)'
      "
      maxWidth="lg"
      (closed)="closed.emit()"
    >
      <form (submit)="handleSubmit($event)" novalidate class="space-y-4 text-xs">
        <app-objective-form-fields
          [totalObjectivesCount]="totalObjectivesCount()"
          [error]="error()"
          [title]="title()"
          [description]="description()"
          (titleChanged)="title.set($event)"
          (descriptionChanged)="description.set($event)"
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
  readonly totalObjectivesCount = input.required<number>();

  readonly closed = output<void>();
  readonly saved = output<{ title: string; description: string; number?: 1 | 2 | 3 | 4 }>();
  readonly deleted = output<1 | 2 | 3 | 4>();

  readonly title = signal('');
  readonly description = signal('');
  readonly error = signal<string | null>(null);
  readonly confirmDelete = signal(false);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.title.set(this.initialTitle());
        this.description.set(this.initialDescription());
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
    });
    this.toastService.toast.success(
      this.mode() === 'edit'
        ? `Objetivo #${this.objectiveNumber()} actualizado correctamente`
        : 'Nuevo objetivo estratégico agregado a la fase',
      'Objetivo Guardado'
    );
    this.closed.emit();
  }

  handleDelete(): void {
    const objNum = this.objectiveNumber();
    if (!objNum) return;
    if (this.totalObjectivesCount() <= 1) {
      const msg = 'No se puede eliminar: Toda fase ministerial debe contar con al menos un objetivo.';
      this.error.set(msg);
      this.toastService.toast.warning(msg, 'Regla Ministerial');
      return;
    }
    if (!this.confirmDelete()) {
      this.confirmDelete.set(true);
      return;
    }
    this.deleted.emit(objNum);
    this.toastService.toast.info(`Objetivo #${objNum} eliminado de la fase`, 'Objetivo Eliminado');
    this.closed.emit();
  }
}

