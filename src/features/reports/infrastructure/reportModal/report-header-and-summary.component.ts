import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MisincolLogoComponent } from '../../../../shared/components/misincol-logo.component';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import type { ReportData } from '../../application/report-data.helper';

@Component({
  selector: 'app-report-header-and-summary',
  standalone: true,
  imports: [MisincolLogoComponent, AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="no-print flex items-center justify-between bg-[#FAF7F2] p-3.5 rounded-xl border border-stone-200">
        <span class="text-xs text-stone-600 font-medium">
          💡 Puede imprimir o guardar directamente este informe como archivo <strong>PDF</strong> con formato oficial.
        </span>
        <button
          type="button"
          (click)="printed.emit()"
          class="bg-linear-to-r from-[#8B251E] to-[#E67324] hover:from-[#731E18] hover:to-[#D05E12] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <app-icon name="printer" className="w-4 h-4" />
          <span>Imprimir / Descargar PDF</span>
        </button>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#8B251E] pb-6">
        <div>
          <app-misincol-logo size="lg" />
          <p class="text-xs text-stone-500 mt-2 font-medium">
            Misiones Indígenas en Colombia • Dirección Nacional de Desarrollo Ministerial
          </p>
        </div>
        <div class="text-left sm:text-right">
          <span class="text-[10px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-3 py-1 rounded-full">
            Informe Oficial PDM
          </span>
          <h2 class="text-lg font-black text-stone-900 mt-2 font-['Outfit']">{{ report().phaseName }}</h2>
          <span class="text-xs text-stone-500 block">Fecha de emisión: {{ report().generatedAt }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F2] p-4 rounded-xl border border-stone-200/80 text-xs">
        <div>
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Equipo Ministerial</span>
          <span class="font-bold text-stone-800">{{ report().teamName }}</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Líder Responsable</span>
          <span class="font-bold text-stone-800">{{ report().teamLeader }}</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Fecha Inicio Fase</span>
          <span class="font-bold text-stone-800">{{ report().startDate }}</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Presupuesto Consolidado</span>
          <span class="font-black text-[#8B251E] text-sm">{{ formatCurrency(report().totalBudget) }}</span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
          <span class="text-[11px] font-bold text-stone-500 uppercase block">Progreso de Fase</span>
          <span class="text-2xl font-black text-[#8B251E] font-['Outfit']">{{ report().progressPercentage }}%</span>
          <span class="text-[10px] text-stone-400 block mt-0.5">Avance general</span>
        </div>
        <div class="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
          <span class="text-[11px] font-bold text-stone-500 uppercase block">Iniciativas Totales</span>
          <span class="text-2xl font-black text-stone-800 font-['Outfit']">{{ report().totalActivities }}</span>
          <span class="text-[10px] text-stone-400 block mt-0.5">4 objetivos estratégicos</span>
        </div>
        <div class="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
          <span class="text-[11px] font-bold text-stone-500 uppercase block">Completadas vs Curso</span>
          <span class="text-2xl font-black text-emerald-700 font-['Outfit']">{{ report().completedCount }} / {{ report().inProgressCount }}</span>
          <span class="text-[10px] text-stone-400 block mt-0.5">{{ report().pendingCount }} pendientes</span>
        </div>
      </div>
    </div>
  `,
})
export class ReportHeaderAndSummaryComponent {
  readonly report = input.required<ReportData>();
  readonly printed = output<void>();

  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }
}

