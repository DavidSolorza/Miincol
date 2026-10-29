import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

@Component({
  selector: 'app-activity-budget-quick-edit',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2">
      @if (isEditingBudget()) {
        <div class="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border border-stone-200 shadow-2xs" (click)="$event.stopPropagation()">
          <div class="flex items-center gap-1 text-xs">
            <span class="text-[10px] text-stone-400 font-bold">$</span>
            <input
              type="number"
              [value]="unitBudgetInput()"
              (input)="onUnitBudgetInput($event)"
              class="w-20 p-1 text-xs border border-stone-200 rounded-lg bg-white text-stone-900 font-bold"
              title="Valor unitario"
            />
            <span class="text-[10px] text-stone-400">×</span>
            <input
              type="number"
              [value]="timesPerYearInput()"
              (input)="onTimesInput($event)"
              class="w-10 p-1 text-xs border border-stone-200 rounded-lg bg-white text-stone-900 font-bold"
              min="1"
              title="Veces al año"
            />
          </div>
          <button
            type="button"
            (click)="handleSave($event)"
            class="p-1.5 rounded-lg bg-[#8B251E] text-white hover:bg-[#731E18] text-xs transition cursor-pointer shadow-2xs"
            title="Guardar"
          >
            <app-icon name="check" className="w-4 h-4" />
          </button>
        </div>
      } @else {
        <div class="flex items-center gap-2">
          <div class="bg-stone-50/90 px-3 py-1.5 rounded-xl border border-stone-200/70 text-right shadow-2xs">
            <span class="text-sm font-black text-stone-900 font-['Outfit'] block leading-none">{{ formatCurrency(totalBudget()) }}</span>
            <span class="text-[9.5px] text-stone-400 font-semibold block mt-0.5">({{ formatCurrency(unitBudget()) }} × {{ timesPerYear() }}/año)</span>
          </div>
          <button
            type="button"
            (click)="handleEditClick($event)"
            class="w-7 h-7 rounded-xl text-stone-400 hover:text-[#8B251E] hover:bg-stone-100 flex items-center justify-center transition cursor-pointer"
            title="Editar actividad completa"
          >
            <app-icon name="edit-3" className="w-4 h-4" />
          </button>
        </div>
      }

      <button
        type="button"
        (click)="handleDeleteClick($event)"
        class="w-7 h-7 rounded-xl text-stone-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
        title="Eliminar actividad"
      >
        <app-icon name="trash-2" className="w-4 h-4" />
      </button>
    </div>
  `,
})
// Control de visualización y edición rápida en línea del presupuesto y acciones de una actividad
export class ActivityBudgetQuickEditComponent {
  private readonly toastService = inject(ToastService); // Servicio de alertas y confirmación de borrado

  readonly totalBudget = input.required<number>(); // Presupuesto total calculado de la actividad
  readonly unitBudget = input.required<number>(); // Costo unitario de la actividad
  readonly timesPerYear = input.required<number>(); // Cantidad de veces que se realiza al año
  readonly isEditingBudget = input.required<boolean>(); // Indica si el formulario rápido de presupuesto está activo
  readonly unitBudgetInput = input.required<number>(); // Valor editable del costo unitario
  readonly timesPerYearInput = input.required<number>(); // Valor editable de repeticiones por año

  readonly editingBudgetToggled = output<boolean>(); // Alterna el modo de edición rápida de presupuesto
  readonly unitBudgetChanged = output<number>(); // Emite cambios en el input de presupuesto unitario
  readonly timesPerYearChanged = output<number>(); // Emite cambios en el input de repeticiones anuales
  readonly budgetSaved = output<void>(); // Emite para guardar el nuevo presupuesto rápido
  readonly deleted = output<void>(); // Emite cuando el usuario confirma eliminar la actividad
  readonly edited = output<void>(); // Emite para abrir el modal de edición completa de la actividad

  // Formatea un número a moneda en pesos colombianos (COP)
  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }

  // Emite el valor numérico ingresado como presupuesto unitario
  onUnitBudgetInput(event: Event): void {
    this.unitBudgetChanged.emit(Number((event.target as HTMLInputElement).value));
  }

  // Emite el valor numérico ingresado como cantidad de veces al año
  onTimesInput(event: Event): void {
    this.timesPerYearChanged.emit(Number((event.target as HTMLInputElement).value));
  }

  // Detiene la propagación del clic y emite el evento de guardado rápido
  handleSave(event: MouseEvent): void {
    event.stopPropagation();
    this.budgetSaved.emit();
  }

  // Detiene la propagación del clic y solicita abrir el modal de edición completa
  handleEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.edited.emit();
  }

  // Solicita confirmación mediante diálogo antes de eliminar la actividad permanentemente
  handleDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toastService.confirmAction({
      title: '¿Eliminar Actividad del Plan?',
      message: 'Esta actividad y su presupuesto asociado se eliminarán permanentemente de este objetivo.',
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      type: 'danger',
      onConfirm: () => {
        this.deleted.emit();
        this.toastService.toast.success('Actividad eliminada del plan', 'Actividad Removida');
      },
    });
  }
}

