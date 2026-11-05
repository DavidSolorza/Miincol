import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { IconName } from '../../../../shared/components/icon/icon.types';
import type { PhasePlan, PhaseType } from '../../domain/plan.types';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';

// Configuración estática de los 5 pilares ministeriales del PDM con su icono y etiqueta
const PHASES_CONFIG: { id: PhaseType; label: string; icon: IconName }[] = [
  { id: 'investigacion', label: 'Investigación', icon: 'compass' },
  { id: 'encarnacion', label: 'Encarnación', icon: 'users' },
  { id: 'evangelizacion', label: 'Evangelización', icon: 'flame' },
  { id: 'entrenamiento', label: 'Entrenamiento', icon: 'graduation-cap' },
  { id: 'autocuidado', label: 'Autocuidado', icon: 'heart' },
];

@Component({
  selector: 'app-sidebar-phases-list',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1 pt-0.5">
      @if (!isCollapsed()) {
        <div class="px-1 mb-1.5 flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500 block font-['Outfit']">
            Pilares PDM
          </span>
          <span class="text-[9.5px] font-bold text-stone-600 bg-stone-200/70 border border-stone-300/60 px-2 py-0.5 rounded-full uppercase tracking-wider font-['Outfit']">
            {{ activeTeam().ethnicity }}
          </span>
        </div>
      }

      @for (p of phasesConfig; track p.id) {
        @let isPhaseActive = activePhaseId() === p.id && activeView() === 'plans';
        @let counts = getPhaseCounts(p.id);
        <button
          type="button"
          (click)="handleSelectPhase(p.id)"
          [class]="
            'w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-200 ease-out cursor-pointer group select-none ' +
            (isPhaseActive
              ? 'bg-white border-l-3.5 border-l-[#D95B14] border-stone-200/90 shadow-2xs text-stone-950 font-bold'
              : 'bg-white/60 hover:bg-white border border-transparent hover:border-stone-200/80 text-stone-600 hover:text-stone-900 font-medium') +
            (isCollapsed() ? ' justify-center p-2' : '')
          "
          [title]="'Pilar: ' + p.label"
        >
          <div class="flex items-center gap-2 overflow-hidden">
            <app-icon
              [name]="p.icon"
              [className]="'w-3.5 h-3.5 shrink-0 transition ' + (isPhaseActive ? 'text-[#D95B14]' : 'text-stone-400 group-hover:text-stone-700')"
            />
            @if (!isCollapsed()) {
              <span [class]="'truncate font-[Outfit] text-xs ' + (isPhaseActive ? 'font-bold text-stone-950' : 'font-medium text-stone-700')">
                {{ p.label }}
              </span>
            }
          </div>

          @if (!isCollapsed()) {
            <span
              [class]="
                'text-[10px] font-bold px-1.5 py-0.5 rounded-md transition shrink-0 ' +
                (isPhaseActive
                  ? 'bg-[#D95B14] text-white shadow-2xs'
                  : 'bg-stone-100/90 border border-stone-200/60 text-stone-500 group-hover:text-stone-700')
              "
            >
              {{ counts.total }}/{{ counts.completed }}
            </span>
          }
        </button>
      }
    </div>
  `,
})
// Lista de navegación de los pilares del PDM con contador de actividades por fase
export class SidebarPhasesListComponent {
  readonly allPlans = input.required<Record<string, PhasePlan>>(); // Diccionario de planes por fase del equipo
  readonly activePhaseId = input.required<PhaseType>(); // Fase ministerial actualmente seleccionada
  readonly activeView = input.required<'plans' | 'general' | 'superadmin'>(); // Vista activa de la aplicación
  readonly isCollapsed = input.required<boolean>(); // Indica si la barra lateral está contraída
  readonly activeTeam = input.required<MissionaryTeam>(); // Datos del equipo misionero activo

  readonly phaseSelected = output<PhaseType>(); // Emite la fase seleccionada por el usuario
  readonly viewChanged = output<'plans' | 'general' | 'superadmin'>(); // Emite cambio hacia la vista de planes si estaba en otra

  readonly phasesConfig = PHASES_CONFIG; // Referencia a los pilares configurados para la plantilla

  // Calcula el total de actividades y cuántas están completadas en una fase específica
  getPhaseCounts(phaseId: PhaseType): { total: number; completed: number } {
    const phasePlan = this.allPlans()[phaseId];
    if (!phasePlan) return { total: 0, completed: 0 };
    const total = phasePlan.objectives.reduce((sum, o) => sum + o.activities.length, 0);
    const completed = phasePlan.objectives.reduce(
      (sum, o) => sum + o.activities.filter((a) => a.state === 'Completado').length,
      0
    );
    return { total, completed };
  }

  // Selecciona una fase y asegura que la vista activa sea la de planes
  handleSelectPhase(phaseId: PhaseType): void {
    this.phaseSelected.emit(phaseId);
    if (this.activeView() !== 'plans') {
      this.viewChanged.emit('plans');
    }
  }
}

