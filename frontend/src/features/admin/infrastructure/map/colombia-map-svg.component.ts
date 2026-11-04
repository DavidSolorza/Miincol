// Lienzo SVG interactivo del mapa de Colombia con siluetas departamentales, halos de calor y marcadores
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import departmentsData from './data/colombiaDepartments.json';
import { resolveTeamLocation, COLOMBIA_DEPARTMENTS, normalizeText, type ResolvedLocation } from './colombiaLocations';
interface DepartmentPath { id: string; name: string; d: string; }
const DEPARTMENTS = departmentsData as DepartmentPath[]; // Geometrías SVG de los departamentos

@Component({
  selector: 'app-colombia-map-svg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 520 660" class="w-full h-full select-none" (click)="selectTeam.emit(null)">
      <defs>
        <filter id="colombia-relief-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="#8B251E" flood-opacity="0.045" />
          <feDropShadow dx="0" dy="1.5" stdDeviation="3" flood-color="#000000" flood-opacity="0.025" />
        </filter>
        <filter id="active-dept-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#8B251E" flood-opacity="0.18" />
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.06" />
        </filter>
        @for (team of teams; track team.id) {
          <radialGradient [attr.id]="'glow-' + team.id" cx="50%" cy="50%" r="50%">
            <stop offset="0%" [attr.stop-color]="getTeamColor(team)" stop-opacity="0.28" />
            <stop offset="45%" [attr.stop-color]="getTeamColor(team)" stop-opacity="0.10" />
            <stop offset="75%" [attr.stop-color]="getTeamColor(team)" stop-opacity="0.03" />
            <stop offset="100%" [attr.stop-color]="getTeamColor(team)" stop-opacity="0" />
          </radialGradient>
        }
      </defs>

      <g filter="url(#colombia-relief-shadow)" class="transition-all duration-300">
        @for (dept of departments; track dept.id) {
          @let s = getDeptStyle(dept);
          <g class="dept-group group">
            <path
              [attr.d]="dept.d"
              [attr.fill]="s.fill"
              [attr.stroke]="s.stroke"
              [attr.stroke-width]="s.strokeWidth"
              stroke-linejoin="round"
              stroke-linecap="round"
              [attr.filter]="s.filter"
              class="transition-all duration-200 cursor-pointer hover:fill-[#FED7AA]/60 hover:stroke-[#E67324] hover:stroke-[2.2px]"
              (mouseenter)="hoverDept.emit(dept.name)"
              (mouseleave)="hoverDept.emit(null)"
              (click)="onDeptClick($event, dept)"
            >
              <title>{{ getDeptTitle(dept) }}</title>
            </path>
          </g>
        }
      </g>

      <g class="heat-glows pointer-events-none opacity-30">
        @for (team of teams; track team.id) {
          <circle
            [attr.cx]="getLoc(team).x"
            [attr.cy]="getLoc(team).y"
            [attr.r]="team.healthStatus === 'Crítico' ? 65 : team.healthStatus === 'Atención' ? 50 : 40"
            [attr.fill]="'url(#glow-' + team.id + ')'"
            class="transition-all duration-700 animate-pulse"
          />
        }
      </g>

      <g class="map-markers cursor-pointer">
        @for (team of teams; track team.id) {
          <g
            [attr.transform]="'translate(' + getLoc(team).x + ', ' + getLoc(team).y + ')'"
            (click)="onMarkerClick($event, team)"
            (mouseenter)="hoverTeam.emit(team)"
            (mouseleave)="hoverTeam.emit(null)"
            class="transition-transform duration-300 group"
          >
            @if (selectedTeamId === team.id || hoveredTeamId === team.id) {
              <circle r="20" [attr.fill]="getTeamColor(team)" opacity="0.28" class="animate-ping" />
            }
            <circle
              [attr.r]="selectedTeamId === team.id ? 12 : hoveredTeamId === team.id ? 10 : 8"
              fill="#FFFFFF"
              [attr.stroke]="getTeamColor(team)"
              [attr.stroke-width]="selectedTeamId === team.id ? 3.5 : 2.5"
              class="filter drop-shadow-md transition-all duration-200"
            />
            <circle [attr.r]="selectedTeamId === team.id ? 6.5 : hoveredTeamId === team.id ? 5.5 : 4" [attr.fill]="getTeamColor(team)" />
            <title>{{ team.name }} • {{ team.ethnicity }} ({{ getLoc(team).locationLabel }})</title>
          </g>
        }
      </g>
    </svg>
  `,
  styles: [`:host { display: block; width: 100%; height: 100%; }`],
})
export class ColombiaMapSvgComponent {
  @Input() teams: TeamSupervisionSummary[] = []; // Equipos visibles en el mapa
  @Input() selectedTeamId: string | null = null; // ID del equipo seleccionado
  @Input() hoveredTeamId: string | null = null; // ID del equipo bajo el cursor
  @Input() selectedDeptName: string | null = null; // Nombre del departamento filtrado
  @Output() selectTeam = new EventEmitter<TeamSupervisionSummary | null>(); // Emite equipo al hacer clic en marcador
  @Output() hoverTeam = new EventEmitter<TeamSupervisionSummary | null>(); // Emite equipo al pasar el cursor
  @Output() hoverDept = new EventEmitter<string | null>(); // Emite nombre del departamento bajo el cursor
  @Output() selectDept = new EventEmitter<string>(); // Emite departamento al hacer clic en su silueta
  readonly departments = DEPARTMENTS; // Lista de trazos departamentales
  getLoc(team: TeamSupervisionSummary): ResolvedLocation { return resolveTeamLocation(team); } // Coordenadas SVG del equipo
  getTeamColor(team: TeamSupervisionSummary): string { return team.themeColor || this.getLoc(team).accentColor || '#8B251E'; } // Color del marcador
  // Busca si algún equipo misionero pertenece al departamento indicado
  private getMatchingTeam(deptName: string): TeamSupervisionSummary | undefined {
    const norm = normalizeText(deptName);
    return this.teams.find((t) => normalizeText(this.getLoc(t).departmentName) === norm);
  }

  // Calcula relleno, borde y sombra del departamento según selección o presencia misionera
  getDeptStyle(dept: DepartmentPath) {
    const normDeptName = normalizeText(dept.name);
    const matchingTeam = this.getMatchingTeam(dept.name);
    const deptInfo = COLOMBIA_DEPARTMENTS.find((d) => d.id === dept.id);
    const activeSelectedTeam = this.teams.find((t) => t.id === this.selectedTeamId);
    const selectedDeptFromTeam = activeSelectedTeam ? this.getLoc(activeSelectedTeam).departmentName : null;
    const isSelected =
      (this.selectedDeptName && this.selectedDeptName !== 'ALL' && normalizeText(this.selectedDeptName) === normDeptName) ||
      (selectedDeptFromTeam && normalizeText(selectedDeptFromTeam) === normDeptName);
    const themeColor = matchingTeam?.themeColor || deptInfo?.accentColor || '#8B251E';

    if (isSelected) return { fill: `${themeColor}40`, stroke: themeColor, strokeWidth: 3.2, filter: 'url(#active-dept-glow)' };
    if (matchingTeam) return { fill: `${themeColor}22`, stroke: themeColor, strokeWidth: 1.8, filter: null };
    return { fill: '#FAF8F4', stroke: '#D1CBC3', strokeWidth: 0.9, filter: null };
  }

  // Genera el texto emergente nativo (<title>) para cada departamento
  getDeptTitle(dept: DepartmentPath): string {
    const m = this.getMatchingTeam(dept.name);
    return m ? `${dept.name} • Misión Activa: ${m.name} (${m.ethnicity})` : dept.name;
  }

  // Selecciona el departamento al hacer clic y, si tiene misión asignada, también selecciona el equipo
  onDeptClick(e: Event, dept: DepartmentPath) {
    e.stopPropagation();
    this.selectDept.emit(dept.name);
    const m = this.getMatchingTeam(dept.name);
    if (m) this.selectTeam.emit(m);
  }

  // Selecciona directamente un equipo al hacer clic en su marcador circular
  onMarkerClick(e: Event, team: TeamSupervisionSummary) { e.stopPropagation(); this.selectTeam.emit(team); }
}
