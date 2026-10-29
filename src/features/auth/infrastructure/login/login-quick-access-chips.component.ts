import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

export interface QuickCredentialPayload {
  type: 'admin' | 'team';
  user: string;
  pass: string;
  chipKey: string;
}

const PREDEFINED_CHIPS = [
  { type: 'admin' as const, user: 'admin', pass: '210910624Dj', key: 'admin', label: 'admin (210910624Dj)', isSpecial: true, color: '' },
  { type: 'team' as const, user: 'wayuu', pass: 'wayuu2026', key: 'wayuu', label: 'wayuu (wayuu2026)', isSpecial: false, color: '#8B251E' },
  { type: 'team' as const, user: 'nasa', pass: 'nasa2026', key: 'nasa', label: 'nasa (nasa2026)', isSpecial: false, color: '#047857' },
  { type: 'team' as const, user: 'pastos', pass: 'pastos2026', key: 'pastos', label: 'pastos (pastos2026)', isSpecial: false, color: '#1D4ED8' },
  { type: 'team' as const, user: 'embera', pass: 'embera2026', key: 'embera', label: 'embera (embera2026)', isSpecial: false, color: '#7E22CE' },
  { type: 'team' as const, user: 'arhuaco', pass: 'arhuaco2026', key: 'arhuaco', label: 'arhuaco (arhuaco2026)', isSpecial: false, color: '#B45309' },
  { type: 'team' as const, user: 'nukak', pass: 'nukak2026', key: 'nukak', label: 'nukak (nukak2026)', isSpecial: false, color: '#0F766E' },
];

@Component({
  selector: 'app-login-quick-access-chips',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1 pt-0.5">
      <div class="relative my-1.5 pt-1">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-stone-200/80"></div>
        </div>
        <div class="relative flex justify-center text-[10px] uppercase tracking-wider text-stone-400 font-bold bg-white px-2">
          Credenciales Predefinidas
        </div>
      </div>

      <div class="flex items-center gap-1.5 text-stone-500 text-[10px] sm:text-[11px] font-semibold">
        <app-icon name="key-round" className="w-3 h-3 text-[#E67324]" />
        <span>Haz clic en una credencial para autocompletar:</span>
      </div>

      <div class="flex flex-wrap gap-1 pt-0.5">
        @for (chip of chips; track chip.key) {
          <button
            type="button"
            (click)="fillCredentials.emit({ type: chip.type, user: chip.user, pass: chip.pass, chipKey: chip.key })"
            [class]="'px-2 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold transition-fluid cursor-pointer flex items-center gap-1 border active:scale-95 ' + (isSelected(chip.key) ? 'bg-stone-900 text-white border-stone-900 shadow-xs' : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border-stone-200')"
            [style.backgroundColor]="getBgColor(chip)"
            [style.color]="getTextColor(chip)"
            [style.borderColor]="getBorderColor(chip)"
          >
            @if (chip.isSpecial) {
              <app-icon name="shield-check" className="w-3 h-3 text-amber-400" />
            }
            <span>{{ chip.label }}</span>
            @if (isSelected(chip.key)) {
              <app-icon name="check" className="w-3 h-3 ml-0.5" />
            }
          </button>
        }
      </div>
    </div>
  `,
})
export class LoginQuickAccessChipsComponent {
  @Input() selectedQuickChip = '';
  @Output() fillCredentials = new EventEmitter<QuickCredentialPayload>();

  readonly chips = PREDEFINED_CHIPS;

  isSelected(key: string): boolean {
    return this.selectedQuickChip === key || this.selectedQuickChip === `team-${key}`;
  }

  getBgColor(chip: typeof PREDEFINED_CHIPS[0]): string | null {
    if (!chip.color) return null;
    return this.isSelected(chip.key) ? chip.color : `${chip.color}15`;
  }

  getTextColor(chip: typeof PREDEFINED_CHIPS[0]): string | null {
    if (!chip.color || this.isSelected(chip.key)) return null;
    return chip.color;
  }

  getBorderColor(chip: typeof PREDEFINED_CHIPS[0]): string | null {
    if (!chip.color) return null;
    return this.isSelected(chip.key) ? chip.color : `${chip.color}30`;
  }
}

