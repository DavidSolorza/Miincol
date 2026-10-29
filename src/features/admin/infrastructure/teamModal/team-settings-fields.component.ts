import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { CreateTeamDto } from '../../domain/admin.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

const COLOR_PRESETS = [
  '#8B251E', '#E67324', '#10B981', '#2563EB', '#8B5CF6', '#D97706', '#0D9488', '#E11D48',
];

@Component({
  selector: 'app-team-settings-fields',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3 pt-2 border-t border-stone-100">
      <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider">Parámetros Operativos</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Fase PDM Actual</label>
          <select
            [value]="formData.currentPhaseId"
            (change)="updateChange.emit({ currentPhaseId: $any($event.target).value })"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-stone-800 font-medium"
          >
            <option value="investigacion" [selected]="formData.currentPhaseId === 'investigacion'">1. Investigación</option>
            <option value="encarnacion" [selected]="formData.currentPhaseId === 'encarnacion'">2. Encarnación</option>
            <option value="evangelizacion" [selected]="formData.currentPhaseId === 'evangelizacion'">3. Evangelización</option>
            <option value="entrenamiento" [selected]="formData.currentPhaseId === 'entrenamiento'">4. Entrenamiento</option>
            <option value="autocuidado" [selected]="formData.currentPhaseId === 'autocuidado'">5. Autocuidado</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Presupuesto Anual (COP)</label>
          <input
            type="number"
            [value]="formData.totalBudget"
            (input)="updateChange.emit({ totalBudget: +$any($event.target).value || 0 })"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-stone-800"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-0.5 flex items-center gap-1">
            <app-icon name="palette" className="w-3.5 h-3.5 text-[#E67324]" />
            <span>Color de Tarjeta y Marcador (Supervisión)</span>
          </label>
          <p class="text-[10px] text-stone-400 mb-1.5 leading-tight">
            Exclusivo para la tarjeta y mapa del supervisor. No altera los colores base del equipo.
          </p>
          <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
            @for (color of presets; track color) {
              <button
                type="button"
                (click)="updateChange.emit({ themeColor: color })"
                class="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-2xs"
                [style.backgroundColor]="color"
              >
                @if (formData.themeColor === color) {
                  <app-icon name="check" className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                }
              </button>
            }
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1 flex items-center gap-1">
            <app-icon name="key" className="w-3.5 h-3.5 text-amber-500" />
            <span>PIN de Acceso</span>
          </label>
          <div class="relative">
            <input
              [type]="showPassword ? 'text' : 'password'"
              [value]="formData.accessPin || ''"
              (input)="updateChange.emit({ accessPin: $any($event.target).value })"
              placeholder="ej. wayuu2026 (por defecto: [etnia]2026)"
              class="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-stone-200 bg-stone-50 font-mono text-stone-800"
            />
            <button
              type="button"
              (click)="showPasswordChange.emit(!showPassword)"
              class="p-1 text-stone-400 hover:text-stone-700 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <app-icon [name]="showPassword ? 'eye-off' : 'eye'" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TeamSettingsFieldsComponent {
  @Input({ required: true }) formData!: CreateTeamDto;
  @Input() showPassword = false;
  @Output() showPasswordChange = new EventEmitter<boolean>();
  @Output() updateChange = new EventEmitter<Partial<CreateTeamDto>>();

  readonly presets = COLOR_PRESETS;
}

