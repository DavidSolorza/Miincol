import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { IconName } from '../../../../shared/components/icon/icon.types';
import type { PhasePlan, PhaseType } from '../../domain/plan.types';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';

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
          [style.background]="isPhaseActive ? 'linear-gradient(90deg, #FDF0E8 0%, #F18A38 60%, #B83A05 100%)' : null"
          [class]="
            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all duration-200 ease-out cursor-pointer group select-none ' +
            (isPhaseActive
              ? 'text-stone-950 font-bold shadow-2xs overflow-hidden'
              : 'bg-white/90 border border-stone-200/70 hover:border-[#E67324]/50 hover:bg-orange-50/30 text-stone-700 font-semibold') +
            (isCollapsed() ? ' justify-center p-1.5' : '')
          "
          [title]="'Pilar: ' + p.label"
        >
          <div class="flex items-center gap-2 overflow-hidden">
            <app-icon
              [name]="p.icon"
              [className]="'w-3.5 h-3.5 shrink-0 transition ' + (isPhaseActive ? 'text-stone-900' : 'text-[#8B251E] group-hover:text-[#E67324]')"
            />
            @if (!isCollapsed()) {
              <span [class]="'truncate font-[Outfit] text-xs ' + (isPhaseActive ? 'font-bold text-stone-950' : 'font-semibold text-stone-800')">
                {{ p.label }}
              </span>
            }
          </div>

          @if (!isCollapsed()) {
            <span
              [class]="
                'text-[10px] font-bold px-1.5 py-0.5 rounded-md transition shrink-0 ' +
                (isPhaseActive
                  ? 'bg-black/15 text-white'
                  : 'bg-orange-50/70 border border-orange-100/80 text-[#8B251E] group-hover:bg-orange-100/60')
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
export class SidebarPhasesListComponent {
  readonly allPlans = input.required<Record<string, PhasePlan>>();
  readonly activePhaseId = input.required<PhaseType>();
  readonly activeView = input.required<'plans' | 'superadmin'>();
  readonly isCollapsed = input.required<boolean>();
  readonly activeTeam = input.required<MissionaryTeam>();

  readonly phaseSelected = output<PhaseType>();
  readonly viewChanged = output<'plans' | 'superadmin'>();

  readonly phasesConfig = PHASES_CONFIG;

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

  handleSelectPhase(phaseId: PhaseType): void {
    this.phaseSelected.emit(phaseId);
    if (this.activeView() !== 'plans') {
      this.viewChanged.emit('plans');
    }
  }
}

