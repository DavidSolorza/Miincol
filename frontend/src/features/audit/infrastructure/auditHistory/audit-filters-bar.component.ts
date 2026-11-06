import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { TeamSupervisionSummary } from '../../../admin/domain/admin.types';

@Component({
  selector: 'app-audit-filters-bar',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/95 p-3 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="relative min-w-[200px] sm:min-w-[260px]">
          <input
            type="text"
            [value]="searchTerm()"
            (input)="searchChanged.emit($any($event.target).value)"
            placeholder="Buscar por usuario, detalle o valor..."
            class="w-full text-xs py-2 pl-8.5 pr-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-['Outfit']"
          />
          <app-icon name="search" className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div class="relative">
          <select
            [value]="selectedTeamId()"
            (change)="teamChanged.emit($any($event.target).value)"
            class="text-xs py-2 pl-3 pr-8 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-bold focus:bg-white focus:outline-none cursor-pointer appearance-none font-['Outfit']"
          >
            <option value="ALL">Todas las Misiones</option>
            @for (t of teams(); track t.id) {
              <option [value]="t.id">{{ t.name }}</option>
            }
          </select>
          <app-icon name="chevron-down" className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div class="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <span class="inline-flex items-center gap-1 font-bold text-stone-700 font-['Outfit']">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          {{ totalResults() }} eventos
        </span>
      </div>
    </div>
  `,
})
export class AuditFiltersBarComponent {
  readonly searchTerm = input.required<string>();
  readonly selectedTeamId = input.required<string>();
  readonly teams = input<TeamSupervisionSummary[]>([]);
  readonly totalResults = input<number>(0);

  readonly searchChanged = output<string>();
  readonly teamChanged = output<string>();
}
