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
        <div class="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs">
            <span class="text-stone-500 text-[11px] font-semibold hidden md:inline">Año:</span>
            <select
              [value]="currentYear()"
              (change)="handleSelectYear($any($event.target).value)"
              class="bg-transparent text-stone-800 font-bold text-xs focus:outline-hidden cursor-pointer"
              title="Seleccionar año activo de la misión"
            >
              @for (y of availableYears; track y) {
                <option [value]="y" [selected]="y === currentYear()">{{ y }} {{ y === 2026 ? '(Oficial)' : '' }}</option>
              }
            </select>
          </div>

          @if (currentYear() !== 2026) {
            <button
              type="button"
              (click)="changeYear.emit(2026)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
              title="Fijar año oficial en curso (2026)"
            >
              <app-icon name="rotate-ccw" className="w-3.5 h-3.5 text-amber-700" />
              <span>Fijar Año 2026</span>
            </button>
          }

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

  readonly availableYears = [2026, 2025, 2027, 2028, 2029, 2030];

  readonly closeYear = output<void>();
  readonly startNextYear = output<number>();
  readonly changeYear = output<number>();

  handleSelectYear(value: string | number): void {
    const yr = Number(value);
    if (!yr || yr === this.currentYear()) return;
    this.toastSvc.confirmAction({
      title: 'Cambiar Año Ministerial',
      message: `¿Desea cambiar el ciclo activo al año ${yr}? Las métricas y planes reflejarán este período.`,
      confirmText: `Cambiar a ${yr}`,
      cancelText: 'Cancelar',
      variant: 'default',
      onConfirm: () => this.changeYear.emit(yr),
    });
  }

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
