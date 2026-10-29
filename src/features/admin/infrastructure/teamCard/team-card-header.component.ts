import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { IconName } from '../../../../shared/components/icon/icon.types';

@Component({
  selector: 'app-team-card-header',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1.5 text-left">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span
            class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs font-['Outfit']"
            [style.backgroundColor]="themeColor"
          >
            {{ team.ethnicity }}
          </span>
          <span [class]="'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ' + badgeConfig.bg">
            <span [class]="'w-1.5 h-1.5 rounded-full ' + badgeConfig.dot"></span>
            <app-icon [name]="badgeConfig.icon" className="w-3 h-3" />
            <span>{{ badgeConfig.label }}</span>
          </span>
        </div>

        <div class="flex items-center gap-1 text-stone-400 shrink-0">
          <button
            type="button"
            (click)="$event.stopPropagation(); edit.emit()"
            class="p-1 rounded-md hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            title="Editar misión"
          >
            <app-icon name="pencil" className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            (click)="$event.stopPropagation(); inspect.emit()"
            class="p-1 rounded-md hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            title="Supervisar plan"
          >
            <app-icon name="arrow-up-right" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 class="font-extrabold text-base sm:text-[17px] text-stone-900 font-['Outfit'] truncate group-hover:text-[#8B251E] transition">
        {{ team.name }}
      </h3>

      <div class="flex items-center justify-between text-xs text-stone-500 gap-2">
        <span class="flex items-center gap-1.5 truncate">
          <app-icon name="map-pin" className="w-3.5 h-3.5 text-[#E67324] shrink-0" />
          <span class="truncate">{{ team.region }}</span>
        </span>
        <span class="flex items-center gap-1.5 shrink-0">
          <app-icon name="users" className="w-3.5 h-3.5 text-stone-400" />
          <span>{{ team.membersCount }} obreros</span>
        </span>
      </div>

      <div class="flex items-center gap-1.5 text-xs text-stone-600 font-medium truncate">
        <app-icon name="user" className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span class="text-stone-400">Líder:</span>
        <span class="font-bold text-stone-800 truncate">{{ team.leader }}</span>
      </div>
    </div>
  `,
})
export class TeamCardHeaderComponent {
  @Input({ required: true }) team!: TeamSupervisionSummary;
  @Input() themeColor = '#8B251E';
  @Output() edit = new EventEmitter<void>();
  @Output() inspect = new EventEmitter<void>();

  get badgeConfig(): { bg: string; dot: string; icon: IconName; label: string } {
    const map: Record<string, { bg: string; dot: string; icon: IconName; label: string }> = {
      Optimo: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', icon: 'shield-check', label: 'Operación Estable' },
      Atención: { bg: 'bg-amber-50 text-amber-900 border-amber-200', dot: 'bg-amber-500', icon: 'alert-triangle', label: 'Requiere Atención' },
      Crítico: { bg: 'bg-rose-50 text-rose-900 border-rose-200', dot: 'bg-rose-600', icon: 'alert-octagon', label: 'Alerta Territorial' },
    };
    return map[this.team.healthStatus] || map['Optimo'];
  }
}

