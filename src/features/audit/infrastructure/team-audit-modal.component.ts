import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, OnDestroy, signal } from '@angular/core';
import type { TeamAuditLog, TeamTelemetrySummary } from '../domain/audit.types';
import { getStoredAuditLogs, calculateTeamTelemetry } from '../application/auditStorage';
import { serviceBus, type ServiceBusSubscription } from '../../../core/bus';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import { AuditLogItemComponent } from './auditModal/audit-log-item.component';

@Component({
  selector: 'app-team-audit-modal',
  standalone: true,
  imports: [AppIconComponent, AuditLogItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-2xs animate-fadeIn" (click)="close.emit()">
        <div
          class="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200/90 flex flex-col max-h-[85vh] overflow-hidden animate-slideUp"
          (click)="$event.stopPropagation()"
        >
          <div class="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div class="flex items-center gap-2 min-w-0">
              <div class="p-2 rounded-xl text-white shadow-2xs bg-gradient-to-br from-[#8B251E] to-[#E67324]">
                <app-icon name="history" className="w-4 h-4" />
              </div>
              <div class="min-w-0">
                <h3 class="text-sm font-extrabold text-stone-900 truncate">Bitácora de Telemetría y Monitoreo</h3>
                <p class="text-[11px] text-stone-500 truncate">
                  {{ teamName }} &bull; Líder: <strong class="text-stone-700">{{ leaderName }}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              (click)="close.emit()"
              class="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            >
              <app-icon name="x" className="w-4 h-4" />
            </button>
          </div>

          <div class="px-4 py-2 bg-stone-50/80 border-b border-stone-200/60 flex items-center justify-between text-[11px] flex-wrap gap-2">
            <span>
              Último acceso registrado: <strong class="text-stone-800">{{ telemetry().lastLoginFormatted }}</strong>
            </span>
            <div class="flex items-center gap-1">
              @for (tab of tabs; track tab.id) {
                <button
                  type="button"
                  (click)="filter.set(tab.id)"
                  [class]="'px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ' + (filter() === tab.id ? 'bg-stone-900 text-white shadow-2xs' : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200')"
                >
                  {{ tab.label }}
                </button>
              }
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
            @if (filteredLogs.length === 0) {
              <div class="p-8 text-center rounded-xl bg-stone-50 border border-dashed border-stone-200 space-y-2">
                <app-icon name="shield-alert" className="w-7 h-7 text-stone-300 mx-auto" />
                <p class="text-xs font-bold text-stone-600">No hay registros de auditoría para este filtro</p>
              </div>
            } @else {
              @for (log of filteredLogs; track log.id) {
                <app-audit-log-item [log]="log" />
              }
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class TeamAuditModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() teamId = '';
  @Input() teamName = '';
  @Input() leaderName = '';
  @Output() close = new EventEmitter<void>();

  readonly logs = signal<TeamAuditLog[]>([]);
  readonly telemetry = signal<TeamTelemetrySummary>({
    teamId: '',
    lastLoginAt: '',
    lastLoginFormatted: 'Hoy, 09:00',
    isRecentLogin: true,
    lastActionTitle: 'Actividad en PDM',
    lastActionDetail: '',
    lastActionAt: 'Reciente',
    lastActionType: 'login',
    totalActionsCount: 0,
  });
  readonly filter = signal<'all' | 'login' | 'activity' | 'note'>('all');

  readonly tabs: { id: 'all' | 'login' | 'activity' | 'note'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'login', label: 'Ingresos' },
    { id: 'activity', label: 'Actividades' },
    { id: 'note', label: 'Notas' },
  ];

  private sub?: ServiceBusSubscription;

  constructor() {
    this.sub = serviceBus.subscribe('audit:log', (payload) => {
      if (payload.teamId === this.teamId) this.refresh();
    });
  }

  ngOnChanges() {
    if (this.teamId) this.refresh();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  refresh() {
    this.logs.set(getStoredAuditLogs(this.teamId, this.leaderName));
    this.telemetry.set(calculateTeamTelemetry(this.teamId, this.leaderName));
  }

  get filteredLogs(): TeamAuditLog[] {
    const f = this.filter();
    return this.logs().filter((log) => {
      if (f === 'login') return log.actionType === 'login';
      if (f === 'activity') return log.actionType.startsWith('activity_') || log.actionType.startsWith('objective_');
      if (f === 'note') return log.actionType.startsWith('note_');
      return true;
    });
  }
}

