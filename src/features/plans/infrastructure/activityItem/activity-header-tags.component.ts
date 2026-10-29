import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { ActivityState } from '../../domain/plan.types';

const STATE_STYLES: Record<ActivityState, string> = {
  Pendiente: 'bg-amber-50/90 text-amber-900 border-amber-200/80 shadow-2xs',
  'En Proceso': 'bg-orange-50/90 text-orange-900 border-orange-200/80 shadow-2xs',
  Completado: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80 shadow-2xs',
};

@Component({
  selector: 'app-activity-header-tags',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2 flex-wrap">
      <div class="relative">
        <select
          [value]="state()"
          (change)="onSelectState($event)"
          [class]="'text-[11px] font-bold py-1 pl-3 pr-6 rounded-xl border transition cursor-pointer appearance-none font-[\\'Outfit\\'] ' + getStyle(state())"
        >
          <option value="Pendiente">⏳ Pendiente</option>
          <option value="En Proceso">🔄 En Proceso</option>
          <option value="Completado">✅ Completado</option>
        </select>
        <app-icon name="chevron-down" className="w-4 h-4 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <span class="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-stone-700 bg-stone-100/80 px-2.5 py-1 rounded-xl border border-stone-200/60 shadow-2xs">
        <app-icon name="layers" className="w-4 h-4 text-[#E67324]" />
        {{ stage() || 'General' }}
      </span>

      <span class="text-[11px] font-semibold text-stone-400">• {{ frequency() }}</span>
    </div>
  `,
})
export class ActivityHeaderTagsComponent {
  readonly state = input.required<ActivityState>();
  readonly stage = input<string | undefined>(undefined);
  readonly frequency = input.required<string>();
  readonly stateChanged = output<ActivityState>();

  getStyle(state: ActivityState): string {
    return STATE_STYLES[state] || STATE_STYLES.Pendiente;
  }

  onSelectState(event: Event): void {
    this.stateChanged.emit((event.target as HTMLSelectElement).value as ActivityState);
  }
}

