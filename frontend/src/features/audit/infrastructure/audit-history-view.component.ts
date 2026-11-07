import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import { AuditHistoryService } from '../application/audit-history.service';
import { AdminDashboardService } from '../../admin/application/admin-dashboard.service';
import { AuditFiltersBarComponent } from './auditHistory/audit-filters-bar.component';
import { AuditChangesTableComponent } from './auditHistory/audit-changes-table.component';
import { AuditLoginsTableComponent } from './auditHistory/audit-logins-table.component';

@Component({
  selector: 'app-audit-history-view',
  standalone: true,
  imports: [AppIconComponent, AuditFiltersBarComponent, AuditChangesTableComponent, AuditLoginsTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-4 max-w-full overflow-x-hidden animate-fadeIn select-none">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-stone-900 text-[#E67324] flex items-center justify-center shadow-2xs">
            <app-icon name="clock" className="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-lg border border-[#8B251E]/15 font-['Outfit']">
                Seguridad & Observabilidad
              </span>
            </div>
            <h2 class="text-base sm:text-lg font-black text-stone-900 font-['Outfit'] tracking-tight mt-0.5">
              Historial de Ingresos y Auditoría de Cambios
            </h2>
            <p class="text-xs text-stone-500 font-medium">Trazabilidad de modificaciones, comparativa de valores y registros de acceso nacional</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 gap-1">
            <button
              type="button"
              (click)="activeTab.set('changes')"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-['Outfit']"
              [class]="activeTab() === 'changes' ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'"
            >
              Trazabilidad de Cambios ({{ auditSvc.changeLogs().length }})
            </button>
            <button
              type="button"
              (click)="activeTab.set('logins')"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-['Outfit']"
              [class]="activeTab() === 'logins' ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'"
            >
              Historial de Ingresos ({{ auditSvc.loginLogs().length }})
            </button>
          </div>

          <button
            type="button"
            (click)="backToDashboard.emit()"
            class="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs active:scale-95 cursor-pointer font-['Outfit']"
            title="Volver al tablero de supervisión"
          >
            <app-icon name="arrow-left" className="w-3.5 h-3.5 text-[#E67324]" />
            <span class="hidden sm:inline">Volver al Dashboard</span>
          </button>
        </div>
      </div>

      <app-audit-filters-bar
        [searchTerm]="auditSvc.searchTerm()"
        [selectedTeamId]="auditSvc.selectedTeamId()"
        [teams]="dashboardSvc.allTeams()"
        [totalResults]="activeTab() === 'changes' ? auditSvc.changeLogs().length : auditSvc.loginLogs().length"
        (searchChanged)="auditSvc.searchTerm.set($event)"
        (teamChanged)="auditSvc.selectedTeamId.set($event)"
      />

      @if (activeTab() === 'changes') {
        <app-audit-changes-table [logs]="auditSvc.changeLogs()" />
      } @else {
        <app-audit-logins-table [logs]="auditSvc.loginLogs()" />
      }
    </div>
  `,
})
export class AuditHistoryViewComponent {
  readonly auditSvc = inject(AuditHistoryService);
  readonly dashboardSvc = inject(AdminDashboardService);
  readonly backToDashboard = output<void>();

  readonly activeTab = signal<'changes' | 'logins'>('changes');
}

