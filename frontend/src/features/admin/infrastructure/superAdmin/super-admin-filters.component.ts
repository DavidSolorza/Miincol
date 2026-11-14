// Barra de búsqueda y control de ciclo anual ministerial
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-super-admin-filters',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full font-['Outfit']">
      <div class="relative flex-1 min-w-[180px]">
        <app-icon name="search" className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          [value]="searchTerm"
          (input)="searchTermChange.emit($any($event.target).value)"
          placeholder="Buscar por etnia, misión o departamento..."
          class="w-full pl-11 pr-10 py-2.5 text-xs sm:text-[13px] rounded-2xl bg-white border border-stone-200/90 shadow-2xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 transition"
        />
        @if (searchTerm) {
          <button
            type="button"
            (click)="searchTermChange.emit('')"
            class="p-1 rounded-full text-stone-400 hover:text-stone-700 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition"
            title="Limpiar búsqueda"
          >
            <app-icon name="x" className="w-3.5 h-3.5" />
          </button>
        }
      </div>

      <div class="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
        <app-icon name="calendar" className="w-3.5 h-3.5 text-[#E67324]" />
        <span class="text-[11px] font-bold text-stone-600 hidden md:inline">Año:</span>
        <select
          [value]="activeYear"
          (change)="onYearSelect($any($event.target).value)"
          class="bg-transparent text-stone-900 font-bold text-xs focus:outline-hidden cursor-pointer"
          title="Seleccionar año ministerial para todas las misiones"
        >
          @for (y of availableYears; track y) {
            <option [value]="y" [selected]="y === activeYear">{{ y }} {{ y === 2026 ? '(Oficial)' : '' }}</option>
          }
        </select>
        @if (activeYear !== 2026) {
          <button
            type="button"
            (click)="resetTo2026.emit()"
            class="ml-1 px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 font-bold text-[10.5px] transition cursor-pointer border border-amber-300"
            title="Restablecer todas las misiones al año oficial 2026"
          >
            Fijar 2026
          </button>
        }
      </div>
    </div>
  `,
})
export class SuperAdminFiltersComponent {
  @Input() searchTerm = '';
  @Input() activeYear = 2026;
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() yearChanged = new EventEmitter<number>();
  @Output() resetTo2026 = new EventEmitter<void>();

  readonly availableYears = [2026, 2025, 2027, 2028, 2029, 2030];

  onYearSelect(val: string | number): void {
    const yr = Number(val);
    if (yr) this.yearChanged.emit(yr);
  }
}
