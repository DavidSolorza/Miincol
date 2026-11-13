import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import type { FieldMinistryMetrics, GeneralTeamData, AnnualHistoryRecord } from '../../domain/general-info.types';
import { ANNUAL_TABLE_ROWS } from '../../domain/general-annual-table.rows';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-general-annual-table',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none font-['Outfit'] text-left">
      <div class="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
            <app-icon name="table" className="w-4 h-4 text-[#E67324]" />
          </div>
          <div>
            <h3 class="text-xs sm:text-sm font-black text-stone-900 tracking-tight">Seguimiento Multianual de Campo (Modelo Excel)</h3>
            <p class="text-[10.5px] text-stone-500">Métricas comparativas por año ministerial de la misión</p>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[620px] text-xs">
          <thead>
            <tr class="bg-stone-50/90 text-stone-600 text-[10.5px] uppercase tracking-wider border-b border-stone-200">
              <th class="py-2.5 px-3.5 font-bold">Métrica Ministerial / Etapa</th>
              <th class="py-2.5 px-3 font-bold text-center">Año 2025</th>
              @if (currentYear() > 2026) {
                <th class="py-2.5 px-3 font-bold text-center text-stone-800">Año 2026</th>
              }
              <th class="py-2.5 px-3 font-bold text-center bg-amber-500/10 text-stone-900">
                Año {{ currentYear() }} (Activo)
              </th>
              <th class="py-2.5 px-3 font-bold text-center">Año {{ currentYear() + 1 }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            @for (row of rows; track row.key) {
              @if (row.section) {
                <tr class="bg-stone-50/50 font-bold text-stone-700 text-[11px]">
                  <td [attr.colspan]="currentYear() > 2026 ? 5 : 4" class="py-1 px-3.5 uppercase tracking-wide">
                    {{ row.section }}
                  </td>
                </tr>
              }
              <tr>
                <td class="py-2 px-3.5 text-stone-700">{{ row.label }}</td>
                <td class="py-2 px-3 text-center text-stone-400 font-mono">
                  {{ getPastValue(2025, row.key, row.default2025) }}
                </td>
                @if (currentYear() > 2026) {
                  <td class="py-2 px-3 text-center text-stone-700 font-bold font-mono">
                    {{ getPastValue(2026, row.key, row.default2025) }}
                  </td>
                }
                <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                  @if (canEdit()) {
                    <input
                      type="number"
                      [value]="metrics()[row.key]"
                      (change)="onMetricChange(row.key, $event)"
                      class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold"
                    />
                  } @else {
                    {{ metrics()[row.key] }}
                  }
                </td>
                <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class GeneralAnnualTableComponent {
  readonly metrics = input.required<FieldMinistryMetrics>();
  readonly teamData = input.required<GeneralTeamData>();
  readonly history = input<Record<number, AnnualHistoryRecord>>();
  readonly canEdit = input<boolean>(false);
  readonly metricChanged = output<Partial<FieldMinistryMetrics>>();

  readonly rows = ANNUAL_TABLE_ROWS;
  readonly currentYear = computed(() => this.teamData().year);

  getPastValue(year: number, key: keyof FieldMinistryMetrics, fallback: number): number | string {
    const hist = this.history();
    if (hist && hist[year]?.fieldMetrics?.[key] !== undefined) {
      return hist[year].fieldMetrics[key];
    }
    return year === 2025 ? fallback : '—';
  }

  onMetricChange(field: keyof FieldMinistryMetrics, event: Event): void {
    const val = Number((event.target as HTMLInputElement).value) || 0;
    this.metricChanged.emit({ [field]: val });
  }
}
