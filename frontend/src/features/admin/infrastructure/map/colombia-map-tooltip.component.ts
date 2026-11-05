// Tarjeta flotante (tooltip) en la esquina inferior del mapa con resumen y acceso al equipo seleccionado
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-colombia-map-tooltip',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (team) {
      <div class="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-200/90 animate-fadeIn z-20">
        <div class="flex items-start justify-between gap-1">
          <div class="flex items-center gap-1.5 min-w-0">
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0"
              [style.backgroundColor]="color"
            ></span>
            <h4 class="font-extrabold text-xs text-stone-900 truncate font-['Outfit']">
              {{ team.name }}
            </h4>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
          >
            <app-icon name="x" className="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="mt-2 space-y-1 text-[11px] text-stone-600">
          <div class="flex items-center gap-1 text-stone-500 truncate">
            <app-icon name="map-pin" className="w-3 h-3 text-[#E67324] shrink-0" />
            <span class="truncate">{{ team.region }} ({{ team.department }})</span>
          </div>
          <div class="flex items-center gap-1 text-stone-700 truncate">
            <app-icon name="user" className="w-3 h-3 text-stone-400 shrink-0" />
            <span>Líder: <strong>{{ team.leader }}</strong></span>
          </div>
        </div>

        <div class="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-stone-400 font-semibold block uppercase">Avance</span>
            <span class="text-xs font-black text-stone-900">{{ team.progressPercentage }}%</span>
          </div>

          <button
            type="button"
            (click)="inspect.emit(team.id)"
            class="px-2.5 py-1 rounded-lg text-white font-bold text-[11px] transition flex items-center gap-1 shadow-xs cursor-pointer hover:brightness-110"
            [style.backgroundColor]="color"
          >
            <span>Supervisar</span>
            <app-icon name="arrow-right" className="w-3 h-3" />
          </button>
        </div>
      </div>
    }
  `,
})
export class ColombiaMapTooltipComponent {
  @Input() team: TeamSupervisionSummary | null = null; // Equipo activo a mostrar en el tooltip
  @Output() close = new EventEmitter<void>(); // Emite para cerrar el tooltip y limpiar selección
  @Output() inspect = new EventEmitter<string>(); // Emite el ID del equipo al pulsar "Supervisar"

  // Devuelve el color institucional de la misión activa
  get color(): string {
    return this.team?.themeColor || '#8B251E';
  }
}

