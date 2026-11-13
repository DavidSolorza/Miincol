import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

export interface QuickCredentialPayload {
  type: 'admin' | 'team';
  user: string;
  pass: string;
  chipKey: string;
}

const PREDEFINED_CHIPS = [
  { type: 'admin' as const, user: 'director@misincol.org', pass: 'director2026', key: 'director', label: '👑 Coordinador de Equipos', roleBadge: 'director2026', isSpecial: true, color: '#8B251E' },
  { type: 'team' as const, user: 'pastos@misincol.org', pass: 'pastos2026', key: 'pastos', label: '🌄 Líder Pastos', roleBadge: 'pastos2026', isSpecial: false, color: '#1D4ED8' },
  { type: 'team' as const, user: 'wayuu@misincol.org', pass: 'wayuu2026', key: 'wayuu', label: '🏜️ Líder Wayúu', roleBadge: 'wayuu2026', isSpecial: false, color: '#B45309' },
  { type: 'team' as const, user: 'marcos.chocue@misincol.org', pass: 'nasa2026', key: 'nasa', label: '🌿 Líder Nasa', roleBadge: 'nasa2026', isSpecial: false, color: '#047857' },
  { type: 'team' as const, user: 'aida.secue@misincol.org', pass: 'nasa2026', key: 'aida', label: '🤝 Misionera Aída', roleBadge: 'nasa2026', isSpecial: false, color: '#059669' },
  { type: 'team' as const, user: 'embera@misincol.org', pass: 'embera2026', key: 'embera', label: '🌴 Líder Émbera', roleBadge: 'embera2026', isSpecial: false, color: '#7E22CE' },
];

@Component({
  selector: 'app-login-quick-access-chips',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1.5 pt-1 font-['Outfit'] select-none">
      <div class="relative my-1">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-stone-200/80"></div>
        </div>
        <div class="relative flex justify-center text-[10px] uppercase tracking-wider text-stone-500 font-bold bg-white px-2">
          Botones de Inicio Rápido (Acceso Rápido)
        </div>
      </div>

      <div class="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
        <app-icon name="key-round" className="w-3.5 h-3.5 text-[#E67324]" />
        <span>Selecciona un perfil para autocompletar credenciales:</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
        @for (chip of chips; track chip.key) {
          <button
            type="button"
            (click)="fillCredentials.emit({ type: chip.type, user: chip.user, pass: chip.pass, chipKey: chip.key })"
            [class]="'p-1.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-0.5 active:scale-95 ' + (isSelected(chip.key) ? 'bg-stone-900 text-white border-stone-900 shadow-xs ring-1 ring-stone-900' : 'bg-stone-50/80 hover:bg-stone-100 border-stone-200 text-stone-800')"
          >
            <div class="flex items-center justify-between text-[11px] font-bold">
              <span>{{ chip.label }}</span>
              @if (isSelected(chip.key)) {
                <app-icon name="check" className="w-3 h-3 text-emerald-400" />
              }
            </div>
            <span class="text-[9.5px] opacity-75 truncate font-mono">{{ chip.user }}</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class LoginQuickAccessChipsComponent {
  @Input() selectedQuickChip = 'wayuu';
  @Output() fillCredentials = new EventEmitter<QuickCredentialPayload>();

  readonly chips = PREDEFINED_CHIPS;

  isSelected(key: string): boolean {
    return this.selectedQuickChip === key;
  }
}
