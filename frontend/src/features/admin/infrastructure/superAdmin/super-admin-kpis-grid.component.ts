// Cuadrícula de 4 tarjetas KPI nacionales (Misiones Activas, Presupuesto, Avance Promedio y Alertas)
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import type { NationalKpis } from '../../domain/admin.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-super-admin-kpis-grid',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      <div class="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between text-stone-400 mb-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">Misiones Activas</span>
          <app-icon name="compass" className="w-3.5 h-3.5 text-[#8B251E]" />
        </div>
        <div class="text-xl font-black text-stone-900 font-['Outfit']">{{ kpis.totalTeams }}</div>
        <div class="text-[10px] text-stone-400 mt-0.5">{{ kpis.totalMissionaries }} misioneros desplegados</div>
      </div>

      <div class="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between text-stone-400 mb-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">Presupuesto Nal.</span>
          <app-icon name="coins" className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div class="text-xl font-black text-stone-900 font-mono font-['Outfit'] truncate">
          {{ formatCOP(kpis.totalNationalBudget) }}
        </div>
        <div class="text-[10px] text-stone-400 mt-0.5">Ejecutado: {{ formatCOP(kpis.totalExecutedBudget) }}</div>
      </div>

      <div class="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between text-stone-400 mb-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">Avance Promedio</span>
          <app-icon name="trending-up" className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div class="text-xl font-black text-emerald-700 font-['Outfit']">{{ kpis.nationalAverageProgress }}%</div>
        <div class="text-[10px] text-stone-400 mt-0.5">
          {{ kpis.completedActivities }} de {{ kpis.totalActivities }} actividades listas
        </div>
      </div>

      <div class="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between text-stone-400 mb-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">Alertas Críticas</span>
          <app-icon name="alert-triangle" className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div [class]="'text-xl font-black font-[\\'Outfit\\'] ' + (kpis.activeCriticalAlerts > 0 ? 'text-rose-600' : 'text-emerald-700')">
          {{ kpis.activeCriticalAlerts }}
        </div>
        <div class="text-[10px] text-stone-400 mt-0.5">
          {{ kpis.activeCriticalAlerts > 0 ? 'Requieren intervención' : 'Territorios estables' }}
        </div>
      </div>
    </div>
  `,
})
export class SuperAdminKpisGridComponent {
  @Input({ required: true }) kpis!: NationalKpis; // Objeto con los indicadores nacionales consolidados

  // Formatea montos numéricos al estándar de pesos colombianos (COP)
  formatCOP(val: number): string {
    return formatCurrencyCOP(val);
  }
}

