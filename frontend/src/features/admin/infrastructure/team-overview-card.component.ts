// Tarjeta resumen de un equipo misionero con cabecera, métricas de avance, telemetría y modal de auditoría
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, OnDestroy, signal } from '@angular/core';
import type { TeamSupervisionSummary } from '../domain/admin.types';
import { calculateTeamTelemetry } from '../../audit/application/auditStorage';
import { serviceBus, type ServiceBusSubscription } from '../../../core/bus';
import { TeamCardHeaderComponent } from './teamCard/team-card-header.component';
import { TeamCardMetricsComponent } from './teamCard/team-card-metrics.component';
import { TeamCardBottomMetricsComponent } from './teamCard/team-card-bottom-metrics.component';
import { TeamAuditModalComponent } from '../../audit/infrastructure/team-audit-modal.component';

@Component({
  selector: 'app-team-overview-card',
  standalone: true,
  imports: [
    TeamCardHeaderComponent,
    TeamCardMetricsComponent,
    TeamCardBottomMetricsComponent,
    TeamAuditModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      (click)="select.emit()"
      [style.borderTopColor]="themeColor"
      style="border-top-width: 3.5px"
      [class]="'bg-white rounded-2xl border-x border-b transition-all duration-200 p-5 flex flex-col justify-between space-y-3.5 relative overflow-hidden group cursor-pointer h-full ' + (isSelected ? 'border-[#E67324] ring-2 ring-[#E67324]/30 shadow-md' : 'border-stone-200/90 hover:border-stone-300 hover:shadow-md')"
    >
      <app-team-card-header
        [team]="team"
        [themeColor]="themeColor"
        (edit)="editTeam.emit(team)"
        (inspect)="inspectTeam.emit(team.id)"
      />

      <app-team-card-metrics
        [team]="team"
        [themeColor]="themeColor"
      />

      <app-team-card-bottom-metrics
        [team]="team"
        [lastLoginTime]="lastLoginFormatted()"
        (openAudit)="isAuditModalOpen.set(true)"
      />

      <app-team-audit-modal
        [isOpen]="isAuditModalOpen()"
        (close)="isAuditModalOpen.set(false)"
        [teamId]="team.id"
        [teamName]="team.name"
        [leaderName]="team.leader"
      />
    </div>
  `,
})
export class TeamOverviewCardComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) team!: TeamSupervisionSummary; // Resumen del equipo a mostrar
  @Input() isSelected = false; // Indica si la tarjeta está resaltada/seleccionada
  @Output() select = new EventEmitter<void>(); // Emite al hacer clic en la tarjeta para seleccionarla en el mapa
  @Output() inspectTeam = new EventEmitter<string>(); // Emite el ID del equipo para abrir su PDM
  @Output() editTeam = new EventEmitter<TeamSupervisionSummary>(); // Emite el equipo para abrir el modal de edición

  readonly isAuditModalOpen = signal(false); // Controla visibilidad de la bitácora de auditoría
  readonly lastLoginFormatted = signal('Hoy, 09:00'); // Hora formateada del último acceso registrado
  private sub?: ServiceBusSubscription;

  // Devuelve el color identitario de la misión o el terracota institucional por defecto
  get themeColor(): string {
    return this.team.themeColor || '#8B251E';
  }

  // Se suscribe a eventos de auditoría en el bus para refrescar la telemetría en tiempo real
  constructor() {
    this.sub = serviceBus.subscribe('audit:log', (payload) => {
      if (this.team && payload.teamId === this.team.id) {
        this.refreshTelemetry();
      }
    });
  }

  // Actualiza la telemetría cuando cambian los inputs de la tarjeta
  ngOnChanges() {
    if (this.team) this.refreshTelemetry();
  }

  // Cancela la suscripción al bus al destruir el componente
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  // Calcula y actualiza la marca temporal del último ingreso del equipo
  private refreshTelemetry() {
    const t = calculateTeamTelemetry(this.team.id, this.team.leader);
    this.lastLoginFormatted.set(t.lastLoginFormatted);
  }
}

