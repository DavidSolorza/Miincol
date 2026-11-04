import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, HostListener, inject, signal } from '@angular/core';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import { TeamDropdownTriggerComponent, type TeamDropdownItem } from './teamSelect/team-dropdown-trigger.component';
import { TeamOptionItemComponent } from './teamSelect/team-option-item.component';

// Menú desplegable con buscador en tiempo real para cambiar de misión territorial desde la cabecera
@Component({
  selector: 'app-team-select-dropdown',
  standalone: true,
  imports: [AppIconComponent, TeamDropdownTriggerComponent, TeamOptionItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-block text-left">
      <app-team-dropdown-trigger
        [activeTeam]="activeTeam"
        [isOpen]="isOpen()"
        (toggle)="isOpen.set(!isOpen())"
      />

      @if (isOpen()) {
        <div class="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/90 py-2 z-50 overflow-hidden animate-fadeIn">
          <div class="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <app-icon name="sparkles" className="w-3.5 h-3.5 text-[#E67324]" />
              <span class="text-[11px] font-black uppercase tracking-wider text-stone-700 font-['Outfit']">Misiones Territoriales</span>
            </div>
            <span class="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{{ teams.length }} equipos</span>
          </div>

          <div class="p-2 border-b border-stone-100">
            <div class="relative flex items-center">
              <app-icon name="search" className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                [value]="searchTerm()"
                (input)="searchTerm.set($any($event.target).value)"
                placeholder="Buscar por etnia, nombre o región..."
                class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200/70 focus:outline-hidden focus:border-[#8B251E] focus:bg-white text-stone-800 transition"
              />
            </div>
          </div>

          <div class="max-h-72 overflow-y-auto p-1.5 space-y-1 no-scrollbar">
            @if (filteredTeams.length === 0) {
              <div class="p-4 text-center text-xs text-stone-400 font-medium">
                No se encontraron misiones con "{{ searchTerm() }}"
              </div>
            } @else {
              @for (team of filteredTeams; track team.id) {
                <app-team-option-item
                  [team]="team"
                  [isSelected]="team.id === activeTeamId"
                  (select)="handleSelect(team.id)"
                />
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class TeamSelectDropdownComponent {
  private readonly elRef = inject(ElementRef);

  // Lista de equipos disponibles, ID del equipo activo y evento de selección
  @Input() teams: TeamDropdownItem[] = [];
  @Input() activeTeamId = '';
  @Output() selectTeam = new EventEmitter<string>();

  // Signals para controlar apertura del dropdown y texto de búsqueda
  readonly isOpen = signal(false);
  readonly searchTerm = signal('');

  // Obtiene el objeto del equipo actualmente seleccionado
  get activeTeam(): TeamDropdownItem | undefined {
    return this.teams.find((t) => t.id === this.activeTeamId) || this.teams[0];
  }

  // Filtra los equipos por nombre, etnia o región según el término buscado
  get filteredTeams(): TeamDropdownItem[] {
    const q = this.searchTerm().toLowerCase();
    return this.teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.ethnicity.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q)
    );
  }

  // Selecciona un equipo, cierra el menú y limpia el buscador
  handleSelect(teamId: string) {
    this.selectTeam.emit(teamId);
    this.isOpen.set(false);
    this.searchTerm.set('');
  }

  // Cierra el menú desplegable al hacer clic fuera del componente
  @HostListener('document:mousedown', ['$event'])
  onDocClick(event: MouseEvent) {
    if (this.isOpen() && !this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  // Cierra el menú desplegable al presionar la tecla Escape
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) this.isOpen.set(false);
  }
}

