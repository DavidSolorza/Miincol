import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { GeneralTeamData } from '../../domain/general-info.types';

@Component({
  selector: 'app-general-team-card',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-[#8B251E]/10 text-[#8B251E] flex items-center justify-center">
            <app-icon name="users" className="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-stone-900 font-['Outfit']">Datos de Conformación de Equipo</h3>
            <p class="text-[11px] text-stone-500">Información macro del territorio y liderazgo</p>
          </div>
        </div>
        <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">Año {{ teamData().year }}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <div class="p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/60">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Líder de Equipo</span>
          <span class="font-bold text-stone-800 text-sm mt-0.5 block truncate">{{ teamData().teamLeader }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/60">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Población / Territorio</span>
          <span class="font-bold text-stone-800 text-sm mt-0.5 block truncate">{{ teamData().population }} • {{ teamData().territory }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/60">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Presencia Evangélica</span>
          <span class="font-bold text-stone-800 text-sm mt-0.5 block truncate">
            {{ teamData().evangelicalCongregationsCount }} Congregaciones • {{ teamData().evangelicalBelieversCount }} Creyentes
          </span>
        </div>
      </div>

      <div class="space-y-2 pt-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-stone-700 uppercase tracking-wider font-['Outfit']">Integrantes del Equipo ({{ teamData().members.length }})</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          @for (m of teamData().members; track m.id) {
            <div class="p-2.5 rounded-xl border border-stone-200/80 bg-white flex items-center justify-between gap-2 shadow-2xs">
              <div class="min-w-0">
                <span class="text-xs font-bold text-stone-900 block truncate">{{ m.name }}</span>
                <span class="text-[10px] text-stone-500 block truncate">{{ m.role }} • {{ m.phone }}</span>
              </div>
              <button type="button" (click)="removeMember.emit(m.id)" class="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition" title="Remover integrante">
                <app-icon name="trash-2" className="w-3.5 h-3.5" />
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class GeneralTeamCardComponent {
  readonly teamData = input.required<GeneralTeamData>();
  readonly removeMember = output<string>();
}
