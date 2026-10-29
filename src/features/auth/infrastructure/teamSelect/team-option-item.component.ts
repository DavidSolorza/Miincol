import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { TeamDropdownItem } from './team-dropdown-trigger.component';

@Component({
  selector: 'app-team-option-item',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="select.emit()"
      [class]="'w-full p-2 rounded-xl text-left transition flex items-center justify-between gap-2.5 cursor-pointer ' + (isSelected ? 'bg-[#8B251E]/10 border border-[#8B251E]/30 text-stone-900 shadow-2xs' : 'hover:bg-stone-50 border border-transparent text-stone-700')"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs bg-[#8B251E]"></span>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded text-white shadow-2xs shrink-0 bg-[#8B251E]">
              {{ team.ethnicity }}
            </span>
            <span [class]="'font-bold text-xs truncate font-[\\'Outfit\\'] ' + (isSelected ? 'text-[#8B251E]' : 'text-stone-900')">
              {{ team.name }}
            </span>
          </div>
          <p class="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5 truncate">
            <app-icon name="map-pin" className="w-2.5 h-2.5 text-[#E67324] shrink-0" />
            <span class="truncate">{{ team.region }}</span>
            @if (team.leader) {
              <span class="text-stone-400 truncate">• {{ team.leader }}</span>
            }
          </p>
        </div>
      </div>
      @if (isSelected) {
        <app-icon name="check" className="w-4 h-4 text-[#8B251E] shrink-0" />
      }
    </button>
  `,
})
export class TeamOptionItemComponent {
  @Input({ required: true }) team!: TeamDropdownItem;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<void>();
}

