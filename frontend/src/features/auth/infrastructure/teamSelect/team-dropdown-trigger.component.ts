import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

// Datos resumidos de un equipo para mostrar en el selector desplegable
export interface TeamDropdownItem {
  id: string;
  name: string;
  ethnicity: string;
  region: string;
  department?: string;
  themeColor?: string;
  leader?: string;
}

@Component({
  selector: 'app-team-dropdown-trigger',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle.emit()"
      class="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 transition-all text-xs font-bold text-stone-800 cursor-pointer shadow-2xs group focus:outline-hidden"
      title="Cambiar de equipo territorial"
    >
      <span class="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs transition-transform group-hover:scale-110 bg-[#8B251E]"></span>
      <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md text-white shadow-2xs shrink-0 bg-[#8B251E]">
        {{ activeTeam?.ethnicity || 'Etnia' }}
      </span>
      <span class="font-bold text-xs text-stone-800 truncate max-w-[140px] sm:max-w-[220px] font-['Outfit']">
        {{ activeTeam?.name || 'Seleccionar equipo' }}
      </span>
      <app-icon
        name="chevron-down"
        [className]="'w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform duration-200 shrink-0 ' + (isOpen ? 'rotate-180 text-[#8B251E]' : '')"
      />
    </button>
  `,
})
// Botón disparador que muestra la etnia y nombre del equipo activo en la barra superior
export class TeamDropdownTriggerComponent {
  // Equipo activo actual, estado de apertura del menú y evento para alternar visibilidad
  @Input() activeTeam?: TeamDropdownItem;
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();
}

