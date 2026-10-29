import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-activity-schedule-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">Responsable</label>
        <input
          type="text"
          [value]="responsible()"
          (input)="onResponsibleInput($event)"
          placeholder="Ej. Pr. David Morales"
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs"
          required
        />
      </div>

      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">Frecuencia de la Actividad</label>
        <select
          [value]="frequency()"
          (change)="onFrequencyChange($event)"
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs font-medium text-stone-800"
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
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs font-bold text-stone-800"
          required
        />
      </div>
    </div>
  `,
})
// Subcomponente de campos de responsable, frecuencia y repeticiones anuales de una actividad
export class ActivityScheduleFieldsComponent {
  readonly responsible = input.required<string>(); // Nombre del responsable asignado a la actividad
  readonly frequency = input.required<string>(); // Periodicidad seleccionada (Semanal, Mensual, etc.)
  readonly timesPerYear = input.required<number>(); // Cantidad de repeticiones al año

  readonly responsibleChanged = output<string>(); // Emite cambios en el nombre del responsable
  readonly frequencyChanged = output<string>(); // Emite cambios en la frecuencia seleccionada
  readonly timesPerYearChanged = output<number>(); // Emite cambios en el número de repeticiones anuales

  // Emite el texto ingresado en el campo de responsable
  onResponsibleInput(event: Event): void {
    this.responsibleChanged.emit((event.target as HTMLInputElement).value);
  }

  // Emite la nueva frecuencia seleccionada en el desplegable
  onFrequencyChange(event: Event): void {
    this.frequencyChanged.emit((event.target as HTMLSelectElement).value);
  }

  // Emite la cantidad numérica de repeticiones por año
  onTimesInput(event: Event): void {
    this.timesPerYearChanged.emit(Number((event.target as HTMLInputElement).value));
  }
}

