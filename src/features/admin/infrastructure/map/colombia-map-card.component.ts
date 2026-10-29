import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal } from '@angular/core';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { resolveTeamLocation, normalizeText } from './colombiaLocations';
import { ColombiaMapFiltersComponent } from './colombia-map-filters.component';
import { ColombiaDeptBadgeComponent } from './colombia-dept-badge.component';
import { ColombiaMapSvgComponent } from './colombia-map-svg.component';
import { ColombiaMapTooltipComponent } from './colombia-map-tooltip.component';

@Component({
  selector: 'app-colombia-map-card',
  standalone: true,
  imports: [
    ColombiaMapFiltersComponent,
    ColombiaDeptBadgeComponent,
    ColombiaMapSvgComponent,
    ColombiaMapTooltipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm flex flex-col h-full min-h-0 relative overflow-hidden group">
      <app-colombia-map-filters
        [selectedDept]="selectedDept()"
        (selectDept)="selectedDept.set($event)"
        [selectedStatus]="selectedStatus()"
        (selectStatus)="selectedStatus.set($event)"
        [selectedPhase]="selectedPhase()"
        (selectPhase)="selectedPhase.set($event)"
        [selectedEthnicity]="selectedEthnicity()"
        (selectEthnicity)="selectedEthnicity.set($event)"
        [departments]="departments"
      />

      <div class="flex-1 min-h-0 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF8F5]">
        <app-colombia-dept-badge
          [deptName]="currentBadgeDept"
          [activeTeamName]="currentBadgeTeam?.name || null"
          [themeColor]="currentBadgeTeam?.themeColor || null"
        />

        <div class="w-full h-full max-w-[620px] max-h-[740px] aspect-[520/660] flex items-center justify-center transition-all duration-300">
          <app-colombia-map-svg
            [teams]="filteredTeams"
            [selectedTeamId]="selectedTeamId"
            [hoveredTeamId]="hoveredTeam()?.id || null"
            [selectedDeptName]="selectedDept()"
            (selectTeam)="selectTeamId.emit($event ? $event.id : null)"
            (hoverTeam)="hoveredTeam.set($event)"
            (hoverDept)="hoveredDept.set($event)"
            (selectDept)="toggleDept($event)"
          />
        </div>

        <app-colombia-map-tooltip
          [team]="activeTeam"
          (close)="selectTeamId.emit(null); hoveredTeam.set(null)"
          (inspect)="inspectTeam.emit($event)"
        />
      </div>
    </div>
  `,
  styles: [`:host { display: flex; flex-direction: column; height: 100%; min-height: 0; }`],
})
export class ColombiaMapCardComponent {
  @Input() teams: TeamSupervisionSummary[] = [];
  @Input() selectedTeamId: string | null = null;
  @Output() selectTeamId = new EventEmitter<string | null>();
  @Output() inspectTeam = new EventEmitter<string>();

  readonly selectedDept = signal('ALL');
  readonly selectedStatus = signal('ALL');
  readonly selectedPhase = signal('ALL');
  readonly selectedEthnicity = signal('ALL');
  readonly hoveredTeam = signal<TeamSupervisionSummary | null>(null);
  readonly hoveredDept = signal<string | null>(null);

  get departments(): string[] {
    const list = Array.from(new Set(this.teams.map((t) => resolveTeamLocation(t).departmentName))).filter(Boolean);
    return list.sort();
  }

  get filteredTeams(): TeamSupervisionSummary[] {
    const dept = this.selectedDept();
    const status = this.selectedStatus();
    const phase = this.selectedPhase();
    const eth = this.selectedEthnicity();

    return this.teams.filter((t) => {
      const loc = resolveTeamLocation(t);
      const matchDept =
        dept === 'ALL' ||
        normalizeText(loc.departmentName) === normalizeText(dept) ||
        normalizeText(t.department).includes(normalizeText(dept));
      const matchStatus = status === 'ALL' || t.healthStatus === status;
      const matchPhase = phase === 'ALL' || t.currentPhaseId === phase;
      const matchEth = eth === 'ALL' || t.ethnicity.toLowerCase().includes(eth.toLowerCase());
      return matchDept && matchStatus && matchPhase && matchEth;
    });
  }

  get activeTeam(): TeamSupervisionSummary | null {
    return this.teams.find((t) => t.id === this.selectedTeamId) || this.hoveredTeam();
  }

  get currentBadgeDept(): string | null {
    return this.hoveredDept() || (this.selectedDept() !== 'ALL' ? this.selectedDept() : null);
  }

  get currentBadgeTeam(): TeamSupervisionSummary | null {
    const hd = this.hoveredDept();
    if (hd) {
      const norm = normalizeText(hd);
      return this.teams.find((t) => normalizeText(resolveTeamLocation(t).departmentName) === norm) || null;
    }
    const sd = this.selectedDept();
    if (sd !== 'ALL') {
      const norm = normalizeText(sd);
      return this.teams.find((t) => normalizeText(resolveTeamLocation(t).departmentName) === norm) || null;
    }
    return null;
  }

  toggleDept(dept: string) {
    this.selectedDept.set(this.selectedDept() === dept ? 'ALL' : dept);
  }
}

