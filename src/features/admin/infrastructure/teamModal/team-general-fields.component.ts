// Campos de identidad territorial del formulario de misión (nombre, etnia, municipio y departamento)
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { CreateTeamDto } from '../../domain/admin.types';
import { COLOMBIA_DEPARTMENTS, normalizeText } from '../map/colombiaLocations';

@Component({
  selector: 'app-team-general-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3">
      <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider">Identidad Territorial</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Nombre de la Misión *</label>
          <input
            type="text"
            [value]="formData.name"
            (input)="updateChange.emit({ name: $any($event.target).value })"
            placeholder="ej. Misión Pastos - Cumbal"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800 font-medium"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Pueblo Indígena / Etnia *</label>
          <input
            type="text"
            [value]="formData.ethnicity"
            (input)="updateChange.emit({ ethnicity: $any($event.target).value })"
            placeholder="ej. Pastos, Wayuu, Nasa, Emberá"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800 font-medium"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Municipio / Territorio Local *</label>
          <input
            type="text"
            [value]="formData.region"
            (input)="updateChange.emit({ region: $any($event.target).value })"
            placeholder="ej. Cumbal, Uribia, Pueblo Rico, Toribío"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800 font-medium"
            required
          />
          <span class="text-[10px] text-stone-400 block mt-0.5">
            Lugar para georreferenciación exacta en el mapa.
          </span>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Departamento de Colombia *</label>
          <select
            [value]="currentDeptName"
            (change)="updateChange.emit({ department: $any($event.target).value })"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800 font-bold"
            required
          >
            <option value="">Seleccione Departamento</option>
            @for (d of sortedDepartments; track d.id) {
              <option [value]="d.name" [selected]="d.name === currentDeptName">{{ d.name }}</option>
            }
          </select>
          <span class="text-[10px] text-stone-400 block mt-0.5">
            Subrayará y demarcará este departamento en el mapa.
          </span>
        </div>
      </div>
    </div>
  `,
})
export class TeamGeneralFieldsComponent {
  @Input({ required: true }) formData!: CreateTeamDto; // Estado actual del formulario de misión
  @Output() updateChange = new EventEmitter<Partial<CreateTeamDto>>(); // Emite cambios parciales en los campos

  // Lista de departamentos de Colombia ordenada alfabéticamente para el selector
  readonly sortedDepartments = COLOMBIA_DEPARTMENTS.slice().sort((a, b) => a.name.localeCompare(b.name));

  // Normaliza y obtiene el nombre oficial del departamento seleccionado actualmente
  get currentDeptName(): string {
    const found = COLOMBIA_DEPARTMENTS.find(
      (d) =>
        normalizeText(d.name) === normalizeText(this.formData.department) ||
        normalizeText(this.formData.department).includes(normalizeText(d.name))
    );
    return found?.name || this.formData.department || 'Nariño';
  }
}

