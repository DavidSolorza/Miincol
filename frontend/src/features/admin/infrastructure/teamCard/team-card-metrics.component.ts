import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

@Component({
  selector: 'app-team-card-metrics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2 pt-2 border-t border-stone-100 text-left">
      <!-- Avance de Plan -->
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-stone-500 font-['Outfit']">
            Avance de Plan
          </span>
          <span class="text-xs font-black text-stone-800 font-['Outfit']">
            {{ team.progressPercentage }}%
          </span>
        </div>
        <div class="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            [style.width.%]="team.progressPercentage"
            [style.backgroundColor]="themeColor"
          ></div>
        </div>
      </div>

      <!-- Barra de Presupuesto en Porcentaje con Gastado y Restante -->
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-stone-500 font-['Outfit']">
            Uso Presupuesto ({{ budgetPercentage }}%)
          </span>
          <span class="text-[11px] font-bold font-mono text-stone-700">
            {{ formattedBudget }}
          </span>
        </div>
        <div class="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            [class]="progressColorClass"
            [style.width.%]="budgetPercentage"
          ></div>
        </div>
        <div class="flex items-center justify-between text-[9.5px] font-mono text-stone-500 pt-1">
          <span>Gastado: <strong class="text-[#8B251E] font-bold">{{ formattedExecuted }}</strong></span>
          <span>Queda: <strong class="text-emerald-700 font-bold">{{ formattedRemaining }}</strong></span>
        </div>
      </div>

      <!-- Etapas de Trabajo y con Objetivos -->
      @if (activeStages.length > 0) {
        <div class="pt-1 flex items-center gap-1 flex-wrap">
          <span class="text-[9.5px] font-bold text-stone-400 uppercase tracking-wider">Etapas:</span>
          @for (st of activeStages; track st) {
            <span class="inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
              {{ st }}
            </span>
          }
        </div>
      }
    </div>
  `,
})
export class TeamCardMetricsComponent {
  @Input({ required: true }) team!: TeamSupervisionSummary;
  @Input() themeColor = '#8B251E';

  get budgetPercentage(): number {
    if (!this.team.totalBudget || this.team.totalBudget <= 0) return 0;
    const executed = this.team.executedBudget || 0;
    return Math.min(100, Math.round((executed / this.team.totalBudget) * 100));
  }

  get remainingBudget(): number {
    return Math.max(0, (this.team.totalBudget || 0) - (this.team.executedBudget || 0));
  }

  get formattedBudget(): string {
    return formatCurrencyCOP(this.team.totalBudget || 0);
  }

  get formattedExecuted(): string {
    return formatCurrencyCOP(this.team.executedBudget || 0);
  }

  get formattedRemaining(): string {
    return formatCurrencyCOP(this.remainingBudget);
  }

  get progressColorClass(): string {
    if (this.budgetPercentage >= 100) return 'bg-[#8B251E]';
    if (this.budgetPercentage > 80) return 'bg-amber-500';
    return 'bg-emerald-600';
  }

  get activeStages(): string[] {
    const fromActs = (this.team.activeInitiatives || []).map((i) => i.stage).filter((s): s is string => !!s);
    return Array.from(new Set(fromActs.length > 0 ? fromActs : ['Contacto', 'Comunicar'])).slice(0, 3);
  }
}
