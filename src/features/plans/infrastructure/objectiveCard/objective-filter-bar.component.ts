import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-objective-filter-bar',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-3.5 pt-3.5 border-t border-stone-100">
      <div class="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          (click)="filterStateChanged.emit('ALL')"
          [class]="
            'px-3 py-1.5 rounded-xl text-[11px] transition whitespace-nowrap cursor-pointer font-[\\'Outfit\\'] ' +
            (filterState() === 'ALL'
              ? 'bg-stone-900 text-white font-bold shadow-xs'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100')
          "
        >
          Todas ({{ totalActivities() }})
        </button>
        <button
          type="button"
          (click)="filterStateChanged.emit('Pendiente')"
          [class]="
            'px-3 py-1.5 rounded-xl text-[11px] transition whitespace-nowrap cursor-pointer font-[\\'Outfit\\'] border ' +
            (filterState() === 'Pendiente'
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-xs'
              : 'bg-amber-50/50 text-amber-800 border-amber-200/50 hover:bg-amber-100/70')
          "
        >
          ⏳ Pendientes ({{ pendingCount() }})
        </button>
        <button
          type="button"
          (click)="filterStateChanged.emit('En Proceso')"
          [class]="
            'px-3 py-1.5 rounded-xl text-[11px] transition whitespace-nowrap cursor-pointer font-[\\'Outfit\\'] border ' +
            (filterState() === 'En Proceso'
              ? 'bg-orange-100 text-[#8B251E] border-orange-300 font-bold shadow-xs'
              : 'bg-orange-50/50 text-[#8B251E] border-orange-200/50 hover:bg-orange-100/70')
          "
        >
          🔄 En Proceso ({{ inProgressCount() }})
        </button>
        <button
          type="button"
          (click)="filterStateChanged.emit('Completado')"
          [class]="
            'px-3 py-1.5 rounded-xl text-[11px] transition whitespace-nowrap cursor-pointer font-[\\'Outfit\\'] border ' +
            (filterState() === 'Completado'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold shadow-xs'
              : 'bg-emerald-50/50 text-emerald-800 border-emerald-200/50 hover:bg-emerald-100/70')
          "
        >
          ✅ Completadas ({{ completedCount() }})
        </button>
      </div>

      <div class="relative w-full sm:w-56">
        <app-icon name="search" className="w-4.5 h-4.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          [value]="searchTerm()"
          (input)="onSearchInput($event)"
          placeholder="Buscar iniciativa..."
          class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50/60 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20 focus:border-[#E67324] transition"
        />
      </div>
    </div>
  `,
})
// Barra de filtros por estado de ejecución y buscador de texto para las actividades de un objetivo
export class ObjectiveFilterBarComponent {
  readonly filterState = input.required<string>(); // Estado de filtro activo ('ALL', 'Pendiente', 'En Proceso', 'Completado')
  readonly searchTerm = input.required<string>(); // Texto actual del buscador de iniciativas
  readonly totalActivities = input.required<number>(); // Cantidad total de actividades del objetivo
  readonly pendingCount = input.required<number>(); // Cantidad de actividades en estado 'Pendiente'
  readonly inProgressCount = input.required<number>(); // Cantidad de actividades en estado 'En Proceso'
  readonly completedCount = input.required<number>(); // Cantidad de actividades en estado 'Completado'

  readonly filterStateChanged = output<string>(); // Emite el nuevo estado seleccionado para filtrar
  readonly searchTermChanged = output<string>(); // Emite el texto ingresado en el campo de búsqueda

  // Captura la entrada del buscador y emite el término actualizado
  onSearchInput(event: Event): void {
    this.searchTermChanged.emit((event.target as HTMLInputElement).value);
  }
}

