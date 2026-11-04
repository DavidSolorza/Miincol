import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { MissionaryTeam } from '../domain/auth.types';
import { ModalComponent } from '../../../shared/components/modal.component';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';

// Modal para seleccionar y cambiar el equipo misionero activo
@Component({
  selector: 'app-team-selector',
  standalone: true,
  imports: [ModalComponent, AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="isOpen"
      (close)="close.emit()"
      title="Selección de Equipo Ministerial MISINCOL"
      subtitle="Elija la misión territorial activa para visualizar o editar su Plan de Desarrollo Ministerial"
      maxWidth="lg"
    >
      <div class="space-y-3">
        @for (t of teams; track t.id) {
          <button
            type="button"
            (click)="selectAndClose(t.id)"
            [class]="'w-full p-4 rounded-xl text-left border transition-all flex items-start justify-between gap-3 cursor-pointer ' + (t.id === activeTeamId ? 'border-[#8B251E] bg-[#8B251E]/5 shadow-xs ring-1 ring-[#8B251E]/30' : 'border-stone-200 bg-white hover:border-stone-400/60 hover:bg-[#FAF7F2]')"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs bg-[#8B251E]">
                  Etnia: {{ t.ethnicity }}
                </span>
                <span class="text-xs text-stone-500 flex items-center gap-1">
                  <app-icon name="map-pin" className="w-3 h-3 text-[#E67324]" />
                  {{ t.region }}
                </span>
              </div>
              <h4 class="text-base font-bold text-stone-900 mt-1.5 font-['Outfit']">
                {{ t.name }}
              </h4>
              <p class="text-xs text-stone-600 mt-0.5">
                Líder: <strong>{{ t.leader }}</strong> • {{ t.members.length }} miembros en campo
              </p>
            </div>

            @if (t.id === activeTeamId) {
              <div class="w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 mt-1 shadow-xs bg-[#8B251E]">
                <app-icon name="check" className="w-4 h-4" [strokeWidth]="3" />
              </div>
            } @else {
              <div class="w-6 h-6 rounded-full border border-stone-300 shrink-0 mt-1"></div>
            }
          </button>
        }
      </div>
    </app-modal>
  `,
})
export class TeamSelectorComponent {
  // Estado de apertura del modal, lista de equipos e ID del equipo seleccionado
  @Input() isOpen = false;
  @Input() teams: MissionaryTeam[] = [];
  @Input() activeTeamId = '';
  // Eventos para cerrar el modal o notificar el cambio de equipo
  @Output() close = new EventEmitter<void>();
  @Output() selectTeam = new EventEmitter<string>();

  // Emite el ID del equipo elegido y cierra el diálogo modal
  selectAndClose(teamId: string) {
    this.selectTeam.emit(teamId);
    this.close.emit();
  }
}

