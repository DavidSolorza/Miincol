import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { TeamAuditLog } from '../../domain/audit.types';
import { formatTimeHour } from '../../application/auditStorage';

@Component({
  selector: 'app-audit-logins-table',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr class="bg-stone-50/80 text-stone-600 text-[10.5px] uppercase font-['Outfit'] tracking-wider border-b border-stone-200">
              <th class="py-2.5 px-3.5 font-bold">Fecha / Hora</th>
              <th class="py-2.5 px-3.5 font-bold">Usuario Autenticado</th>
              <th class="py-2.5 px-3.5 font-bold">Rol en Sistema</th>
              <th class="py-2.5 px-3.5 font-bold">Misión Asignada</th>
              <th class="py-2.5 px-3.5 font-bold">Detalle y Conexión</th>
              <th class="py-2.5 px-3.5 font-bold text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-xs font-['Outfit']">
            @if (logs().length === 0) {
              <tr>
                <td colspan="6" class="py-10 text-center text-stone-400">
                  <app-icon name="info" className="w-6 h-6 mx-auto mb-1 text-stone-300" />
                  No hay registros de ingreso que coincidan con la búsqueda.
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
                  </td>

                  <td class="py-2.5 px-3.5">
                    <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider font-['Outfit']" [class]="getRoleBadge(log.userRole)">
                      {{ log.userRole || 'Líder equipo' }}
                    </span>
                  </td>

                  <td class="py-2.5 px-3.5">
                    <div class="text-stone-800 font-medium">{{ log.teamName || log.teamId }}</div>
                  </td>

                  <td class="py-2.5 px-3.5">
                    <div class="text-stone-600">{{ log.detail }}</div>
                    @if (log.ipAddress) {
                      <div class="text-[10px] text-stone-400 font-mono">IP: {{ log.ipAddress }}</div>
                    }
                  </td>

                  <td class="py-2.5 px-3.5 text-center">
                    <span class="inline-flex items-center gap-1 font-bold text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Exitoso
                    </span>
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
export class AuditLoginsTableComponent {
  readonly logs = input.required<TeamAuditLog[]>();

  fmtTime(iso: string): string {
    return formatTimeHour(iso);
  }

  getRoleBadge(role?: string): string {
    if (role === 'Director nacional' || role === 'ROLE_NACIONAL') return 'bg-stone-900 text-[#E67324] border-stone-800';
    if (role === 'Líder equipo' || role === 'ROLE_LIDER') return 'bg-amber-50 text-amber-900 border-amber-300';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
}
