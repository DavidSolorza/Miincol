import { Component, ChangeDetectionStrategy, input, output, inject, computed, signal } from '@angular/core';
import { GeneralInfoService } from '../../../general-info/application/general-info.service';

@Component({
  selector: 'app-activity-schedule-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="font-bold text-stone-700 text-[11px]">Responsable</label>
          <span class="text-[9.5px] text-stone-400 font-medium">Asignar de Equipo</span>
        </div>
        <div class="relative">
          <select
            (change)="onMemberSelect($event)"
            class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 focus:outline-hidden transition-all text-xs text-stone-800 font-medium cursor-pointer"
          >
            <option value="" [selected]="!responsible()">-- Seleccionar integrante --</option>
            @if (leader(); as l) {
              <option [value]="l" [selected]="responsible() === l">{{ l }} (Líder Pastoral)</option>
            }
            @for (m of members(); track m.id) {
              <option [value]="m.name" [selected]="responsible() === m.name">{{ m.name }} ({{ m.role }})</option>
            }
            <option value="__custom__" [selected]="isCustom() || (!isKnownMember(responsible()) && !!responsible())">
              Otro / Escribir manualmente...
            </option>
          </select>
        </div>

        @if (isCustom() || (!isKnownMember(responsible()) && !!responsible())) {
          <input
            type="text"
            [value]="responsible()"
            (input)="onResponsibleInput($event)"
            placeholder="Nombre del responsable..."
            class="w-full mt-1.5 p-2 rounded-xl border border-stone-200 bg-white text-xs focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 focus:outline-hidden"
            required
          />
        }
      </div>

      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">Frecuencia de la Actividad</label>
        <select
          [value]="frequency()"
          (change)="onFrequencyChange($event)"
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 focus:outline-hidden transition-all text-xs font-medium text-stone-800 cursor-pointer"
        >
          <option value="Semanal">Semanal</option>
          <option value="Quincenal">Quincenal</option>
          <option value="Mensual">Mensual</option>
          <option value="Bimensual">Bimensual</option>
          <option value="Trimestral">Trimestral</option>
          <option value="Semestral">Semestral</option>
          <option value="Anual">Anual</option>
          <option value="Única vez">Única vez</option>
        </select>
      </div>

      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">Repeticiones / Año</label>
        <input
          type="number"
          [value]="timesPerYear()"
          (input)="onTimesInput($event)"
          min="1"
          max="365"
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 focus:outline-hidden transition-all text-xs font-bold text-stone-800"
          required
        />
      </div>
    </div>
  `,
})
export class ActivityScheduleFieldsComponent {
  private readonly generalInfoService = inject(GeneralInfoService);

  readonly responsible = input.required<string>();
  readonly frequency = input.required<string>();
  readonly timesPerYear = input.required<number>();

  readonly responsibleChanged = output<string>();
  readonly frequencyChanged = output<string>();
  readonly timesPerYearChanged = output<number>();

  readonly isCustom = signal(false);
  readonly members = computed(() => this.generalInfoService.currentInfo().teamData.members);
  readonly leader = computed(() => this.generalInfoService.currentInfo().teamData.teamLeader);

  isKnownMember(name: string): boolean {
    if (!name) return false;
    if (name === this.leader()) return true;
    return this.members().some((m) => m.name === name);
  }

  onMemberSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    if (val === '__custom__') {
      this.isCustom.set(true);
    } else {
      this.isCustom.set(false);
      this.responsibleChanged.emit(val);
    }
  }

  onResponsibleInput(event: Event): void {
    this.responsibleChanged.emit((event.target as HTMLInputElement).value);
  }

  onFrequencyChange(event: Event): void {
    this.frequencyChanged.emit((event.target as HTMLSelectElement).value);
  }

  onTimesInput(event: Event): void {
    this.timesPerYearChanged.emit(Number((event.target as HTMLInputElement).value));
  }
}

