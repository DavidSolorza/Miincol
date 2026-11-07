import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import type { SpecialExpense, EssentialArea } from '../../domain/plan.types';

@Component({
  selector: 'app-special-expense-modal',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-fadeIn" (click)="closed.emit()">
        <div class="bg-white rounded-2xl shadow-xl border border-stone-200/90 w-full max-w-md overflow-hidden" (click)="$event.stopPropagation()">
          <div class="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF7F2]">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold">
                <app-icon name="sparkles" className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 class="text-sm font-black text-stone-900 font-['Outfit']">Planificar Gasto Especial</h3>
                <p class="text-[11px] text-stone-500">Monto diferenciado (no suma al presupuesto general)</p>
              </div>
            </div>
            <button type="button" (click)="closed.emit()" class="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition cursor-pointer">
              <app-icon name="x" className="w-4 h-4" />
            </button>
          </div>

          <div class="p-5 space-y-3.5 text-xs font-['Outfit']">
            <div>
              <label class="block font-bold text-stone-700 mb-1">Nombre del Gasto Especial *</label>
              <input type="text" [value]="name()" (input)="name.set($any($event.target).value)" placeholder="Ej. Reparación de bote o compra de carpa" class="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400" />
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Descripción y Justificación</label>
              <textarea [value]="description()" (input)="description.set($any($event.target).value)" rows="2" placeholder="Detalle la necesidad o situación que origina este gasto..." class="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-stone-700 mb-1">Presupuesto (COP) *</label>
                <input type="number" [value]="budget()" (input)="budget.set(+$any($event.target).value)" placeholder="0" min="0" step="10000" class="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-bold" />
              </div>

              <div>
                <label class="block font-bold text-stone-700 mb-1">Área en la que se Aplica *</label>
                <select [value]="area()" (change)="area.set($any($event.target).value)" class="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium">
                  <option value="Investigación">Investigación</option>
                  <option value="Encarnación">Encarnación</option>
                  <option value="Evangelización">Evangelización</option>
                  <option value="Entrenamiento">Entrenamiento</option>
                  <option value="Autocuidado">Autocuidado</option>
                </select>
              </div>
            </div>
          </div>

          <div class="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
            <button type="button" (click)="closed.emit()" class="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 transition cursor-pointer text-xs">Cancelar</button>
            <button type="button" (click)="handleSubmit()" class="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition cursor-pointer text-xs shadow-2xs font-['Outfit'] active:scale-95">Guardar Gasto Especial</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class SpecialExpenseModalComponent {
  private readonly toastSvc = inject(ToastService);
  readonly isOpen = input.required<boolean>();
  readonly teamId = input<string>('team-wayuu');
  readonly objectiveNumber = input<number>(1);
  readonly defaultArea = input<EssentialArea>('Investigación');

  readonly closed = output<void>();
  readonly saved = output<Omit<SpecialExpense, 'id' | 'createdAt'>>();

  readonly name = signal('');
  readonly description = signal('');
  readonly budget = signal(0);
  readonly area = signal<string>('Investigación');

  handleSubmit(): void {
    const n = this.name().trim();
    if (!n) {
      this.toastSvc.toast.error('Debe ingresar el nombre del gasto especial', 'Campo Obligatorio');
      return;
    }
    this.saved.emit({
      teamId: this.teamId(),
      objectiveNumber: this.objectiveNumber(),
      name: n,
      description: this.description().trim(),
      budget: Number(this.budget()) || 0,
      area: this.area(),
    });
    this.name.set('');
    this.description.set('');
    this.budget.set(0);
    this.closed.emit();
  }
}

