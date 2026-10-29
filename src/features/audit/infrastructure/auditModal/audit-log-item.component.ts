import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import type { TeamAuditLog } from '../../domain/audit.types';
import { formatTimeHour } from '../../application/auditStorage';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { IconName } from '../../../../shared/components/icon/icon.types';

// Configuración visual de etiquetas, iconos y colores para cada tipo de acción de auditoría
const ACTION_CONFIG: Record<string, { label: string; icon: IconName; bg: string }> = {
  login: { label: 'Ingreso', icon: 'log-in', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  activity_update: { label: 'Actividad Editada', icon: 'edit-3', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  activity_add: { label: 'Actividad Creada', icon: 'plus-circle', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  activity_delete: { label: 'Actividad Eliminada', icon: 'trash-2', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  objective_update: { label: 'Objetivo Editado', icon: 'check-square', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  objective_add: { label: 'Objetivo Creado', icon: 'plus-circle', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  note_add: { label: 'Nota / Agenda', icon: 'notebook-pen', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  note_delete: { label: 'Nota Eliminada', icon: 'trash-2', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  report_generate: { label: 'Informe PDM', icon: 'file-text', bg: 'bg-stone-50 text-stone-700 border-stone-200' },
};

@Component({
  selector: 'app-audit-log-item',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:bg-white hover:shadow-xs transition space-y-1">
      <div class="flex items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span [class]="'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ' + config.bg">
            <app-icon [name]="config.icon" className="w-2.5 h-2.5" />
            <span>{{ config.label }}</span>
          </span>
          <span class="font-bold text-stone-800">{{ log.title }}</span>
        </div>
        <span class="text-[11px] font-mono text-stone-400 shrink-0">{{ formattedTime }}</span>
      </div>
      <p class="text-xs text-stone-600 pl-0.5">{{ log.detail }}</p>
      <div class="text-[10px] text-stone-400 pl-0.5 pt-0.5 flex items-center justify-between">
        <span>Usuario: <strong class="text-stone-700">{{ log.userName }}</strong></span>
        @if (log.phaseId) {
          <span class="bg-stone-200/60 px-1.5 py-0.5 rounded text-stone-600 font-semibold uppercase text-[9px]">
            Fase {{ log.phaseId }}
          </span>
        }
      </div>
    </div>
  `,
})
// Ítem visual que muestra un registro individual dentro de la bitácora de auditoría
export class AuditLogItemComponent {
  // Registro de auditoría a mostrar en la tarjeta
  @Input({ required: true }) log!: TeamAuditLog;

  // Obtiene la configuración de estilo e ícono según el tipo de acción
  get config() {
    return ACTION_CONFIG[this.log.actionType] || ACTION_CONFIG['login'];
  }

  // Retorna la fecha y hora formateada del evento de auditoría
  get formattedTime(): string {
    return formatTimeHour(this.log.timestamp);
  }
}

