import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import type { ReportObjectiveSummary } from '../../application/report-data.helper';

@Component({
  selector: 'app-report-activities-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h3 class="text-sm font-bold text-stone-900 mb-2 font-['Outfit'] uppercase tracking-wider text-[#8B251E]">
        2. Detalle Operativo de Actividades y Contingencias Territoriales
      </h3>
      <div class="space-y-3">
        @for (act of flatActivities(); track act.id) {
          <div class="p-3 rounded-lg border border-stone-200 bg-stone-50/40 text-xs space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-800">[Obj #{{ act.objectiveNumber }}] {{ act.description }}</span>
              <span
                [class]="
                  'px-2 py-0.5 rounded-full text-[10px] font-bold ' +
                  (act.state === 'Completado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : act.state === 'En Proceso'
                    ? 'bg-orange-100 text-[#8B251E]'
                    : 'bg-amber-100 text-amber-800')
                "
              >
                {{ act.state }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-600">
              <div><strong>Responsable:</strong> {{ act.responsible }}</div>
              <div><strong>Frecuencia:</strong> {{ act.frequency }} ({{ act.timesPerYear }}/año)</div>
              <div><strong>Presupuesto:</strong> {{ formatCurrency(act.totalBudget) }}</div>
            </div>

            @if (act.obstacles) {
              <p class="text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200/60 mt-1">
                <strong>Dificultades en territorio:</strong> {{ act.obstacles }}
              </p>
            }
          </div>
        }
      </div>

      <div class="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
        <div class="border-t border-stone-400 pt-2">
          <span class="font-bold text-stone-800 block">{{ teamLeader() }}</span>
          <span class="text-[11px] text-stone-500">Líder Misionero en Territorio</span>
          <span class="text-[10px] text-stone-400 block">{{ teamName() }}</span>
        </div>
        <div class="border-t border-stone-400 pt-2">
          <span class="font-bold text-stone-800 block">Comité Pastoral Nacional</span>
          <span class="text-[11px] text-stone-500">Supervisión y Acompañamiento PDM</span>
          <span class="text-[10px] text-stone-400 block">MISINCOL Colombia</span>
        </div>
      </div>
    </div>
  `,
})
// Sección de detalle operativo de actividades, contingencias territoriales y firmas del informe
export class ReportActivitiesDetailComponent {
  // Entradas con el resumen de objetivos, nombre del líder y nombre del equipo misionero
  readonly objectivesSummary = input.required<ReportObjectiveSummary[]>();
  readonly teamLeader = input.required<string>();
  readonly teamName = input.required<string>();

  // Signal computado que aplana todas las actividades de los objetivos en una sola lista
  readonly flatActivities = computed(() =>
    this.objectivesSummary().flatMap((obj) => obj.activities)
  );

  // Formatea valores monetarios en pesos colombianos (COP)
  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }
}

