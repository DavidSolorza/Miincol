import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import type { ReportObjectiveSummary } from '../../application/report-data.helper';

@Component({
  selector: 'app-report-objectives-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h3 class="text-sm font-bold text-stone-900 mb-2 font-['Outfit'] uppercase tracking-wider text-[#8B251E]">
        1. Balance por Objetivos Estratégicos
      </h3>
      <div class="overflow-x-auto rounded-xl border border-stone-200">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#FAF7F2] border-b border-stone-200 text-stone-700">
            <tr>
              <th class="p-2.5 font-bold">#</th>
              <th class="p-2.5 font-bold">Objetivo de Área</th>
              <th class="p-2.5 font-bold text-center">Total Actividades</th>
              <th class="p-2.5 font-bold text-center">Estado (Listas / Curso / Pend)</th>
              <th class="p-2.5 font-bold text-right">Presupuesto Anual</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            @for (obj of objectivesSummary(); track obj.number) {
              <tr class="hover:bg-stone-50/50">
                <td class="p-2.5 font-black text-[#8B251E]">#{{ obj.number }}</td>
                <td class="p-2.5">
                  <span class="font-bold text-stone-800 block">{{ obj.title }}</span>
                  <span class="text-[11px] text-stone-500 line-clamp-1">{{ obj.description }}</span>
                </td>
                <td class="p-2.5 text-center font-semibold">{{ obj.activitiesCount }}</td>
                <td class="p-2.5 text-center text-[11px]">
                  <span class="text-emerald-700 font-bold">{{ obj.completedCount }}</span> /
                  <span class="text-[#D05E12] font-bold">{{ obj.inProgressCount }}</span> /
                  <span class="text-amber-700 font-bold">{{ obj.pendingCount }}</span>
                </td>
                <td class="p-2.5 text-right font-black text-[#8B251E]">
                  {{ formatCurrency(obj.totalBudget) }}
                </td>
              </tr>
            }
            <tr class="bg-[#FAF7F2] font-bold border-t-2 border-stone-300">
              <td colspan="4" class="p-2.5 text-right uppercase tracking-wider text-stone-700">
                Total Presupuestal Fase:
              </td>
              <td class="p-2.5 text-right text-sm font-black text-[#8B251E]">
                {{ formatCurrency(totalBudget()) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ReportObjectivesTableComponent {
  readonly objectivesSummary = input.required<ReportObjectiveSummary[]>();
  readonly totalBudget = input.required<number>();

  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }
}

