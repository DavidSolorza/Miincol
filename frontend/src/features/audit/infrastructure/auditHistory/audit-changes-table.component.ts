import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { TeamAuditLog } from '../../domain/audit.types';
import { formatTimeHour } from '../../application/auditStorage';

@Component({
  selector: 'app-audit-changes-table',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr class="bg-stone-50/80 text-stone-600 text-[10.5px] uppercase font-['Outfit'] tracking-wider border-b border-stone-200">
              <th class="py-2.5 px-3.5 font-bold">Fecha / Hora</th>
              <th class="py-2.5 px-3.5 font-bold">Usuario Responsable</th>
              <th class="py-2.5 px-3.5 font-bold">Misión Territorial</th>
              <th class="py-2.5 px-3.5 font-bold">Elemento Modificado</th>
              <th class="py-2.5 px-3.5 font-bold">Comparativa (Anterior ➔ Nuevo)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-xs font-['Outfit']">
            @if (logs().length === 0) {
              <tr>
                <td colspan="5" class="py-10 text-center text-stone-400">
                  <app-icon name="info" className="w-6 h-6 mx-auto mb-1 text-stone-300" />
                  No se encontraron registros de modificaciones con los filtros seleccionados.
                </td>
              </tr>
            } @else {
              @for (log of logs(); track log.id) {
                <tr class="hover:bg-stone-50/60 transition-colors">
                  <td class="py-2.5 px-3.5 whitespace-nowrap">
                    <div class="font-bold text-stone-800">{{ fmtTime(log.timestamp) }}</div>
                    <div class="text-[10px] text-stone-400">{{ log.timestamp.slice(0, 10) }}</div>
                  </td>

                  <td class="py-2.5 px-3.5">
                    <div class="font-bold text-stone-900 leading-tight">{{ log.userName }}</div>
                    <span class="inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 border border-stone-200 mt-0.5">
                      {{ log.userRole || 'Colaborador' }}
                    </span>
                  </td>

                  <td class="py-2.5 px-3.5">
                    <div class="text-stone-800 font-medium">{{ log.teamName || log.teamId }}</div>
                    <div class="text-[10.5px] text-stone-400">{{ log.title }}</div>
                  </td>

                  <td class="py-2.5 px-3.5">
                    <span class="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200/70 text-[11px]">
                      {{ log.fieldModified || 'Registro PDM' }}
                    </span>
                  </td>

                  <td class="py-2.5 px-3.5">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="line-through bg-rose-50 text-rose-700 px-2 py-0.5 rounded-lg border border-rose-200/70 text-[11px]">
                        {{ log.previousValue || 'N/A' }}
                      </span>
                      <app-icon name="arrow-right" className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span class="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-lg border border-emerald-200 text-[11px] shadow-2xs">
                        {{ log.newValue || 'N/A' }}
                      </span>
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AuditChangesTableComponent {
  readonly logs = input.required<TeamAuditLog[]>();

  fmtTime(iso: string): string {
    return formatTimeHour(iso);
  }
}

