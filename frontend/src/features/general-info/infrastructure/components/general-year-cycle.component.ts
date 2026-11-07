import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-general-year-cycle',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-['Outfit'] select-none">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-stone-900 text-[#E67324] flex items-center justify-center font-black text-xs">
          {{ currentYear() }}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-xs sm:text-sm font-black text-stone-900">Ciclo Ministerial: Año {{ currentYear() }}</h4>
            <span
              class="text-[9.5px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider"
              [class]="isYearClosed() ? 'bg-stone-100 text-stone-600 border-stone-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200'"
            >
              {{ isYearClosed() ? 'Año Cerrado' : 'Período Activo' }}
            </span>
          </div>
          <p class="text-[11px] text-stone-500">
            {{ isYearClosed() ? 'El período está cerrado. No se permiten nuevas asignaciones sin orden nacional.' : 'Ciclo habilitado para registro de metas y actividades.' }}
          </p>
        </div>
      </div>

      @if (isAdmin()) {
        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
          @if (!isYearClosed()) {
            <button
              type="button"
              (click)="confirmCloseYear()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
              title="Cerrar el ciclo del año actual"
            >
              <app-icon name="lock" className="w-3.5 h-3.5 text-stone-500" />
              <span>Cerrar Año {{ currentYear() }}</span>
            </button>
          }

          <button
            type="button"
            (click)="confirmStartNewYear()"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
            title="Iniciar el siguiente ciclo anual"
          >
            <app-icon name="calendar" className="w-3.5 h-3.5 text-[#E67324]" />
            <span>Iniciar Año {{ currentYear() + 1 }}</span>
          </button>
        </div>
      }
    </div>
  `,
})
export class GeneralYearCycleComponent {
  private readonly toastSvc = inject(ToastService);
  readonly currentYear = input.required<number>();
  readonly isYearClosed = input<boolean>(false);
  readonly isAdmin = input<boolean>(false);

  readonly closeYear = output<void>();
  readonly startNextYear = output<number>();

  confirmCloseYear(): void {
    this.toastSvc.confirmAction({
      title: 'Cerrar Período Ministerial',
      message: `¿Desea cerrar el ciclo del año ${this.currentYear()}? El período quedará congelado para nuevas asignaciones.`,
      confirmText: 'Sí, cerrar año',
      cancelText: 'Cancelar',
      variant: 'default',
      onConfirm: () => this.closeYear.emit(),
    });
  }

  confirmStartNewYear(): void {
    const next = this.currentYear() + 1;
    this.toastSvc.confirmAction({
      title: 'Iniciar Nuevo Año Ministerial',
      message: `¿Desea formalizar el inicio del período ${next}? Se habilitará la planificación para el nuevo ciclo.`,
      confirmText: `Iniciar Año ${next}`,
      cancelText: 'Cancelar',
      variant: 'default',
      onConfirm: () => this.startNextYear.emit(next),
    });
  }
}

