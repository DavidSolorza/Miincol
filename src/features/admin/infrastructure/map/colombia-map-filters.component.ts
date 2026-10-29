// Barra de 4 filtros rápidos del mapa cartográfico (Fase PDM, Departamento, Etnia y Estado)
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-colombia-map-filters',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-white border-b border-stone-100">
      <div class="relative">
        <select
          [value]="selectedPhase"
          (change)="selectPhase.emit($any($event.target).value)"
          [class]="selectBaseClass(selectedPhase !== 'ALL')"
        >
          <option value="ALL" [selected]="selectedPhase === 'ALL'">Fase PDM</option>
          <option value="investigacion" [selected]="selectedPhase === 'investigacion'">1. Investigación</option>
          <option value="encarnacion" [selected]="selectedPhase === 'encarnacion'">2. Encarnación</option>
          <option value="evangelizacion" [selected]="selectedPhase === 'evangelizacion'">3. Evangelización</option>
          <option value="entrenamiento" [selected]="selectedPhase === 'entrenamiento'">4. Entrenamiento</option>
          <option value="autocuidado" [selected]="selectedPhase === 'autocuidado'">5. Autocuidado</option>
        </select>
        <app-icon name="chevron-down" className="w-3 h-3 text-[#E67324] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div class="relative">
        <select
          [value]="selectedDept"
          (change)="selectDept.emit($any($event.target).value)"
          [class]="selectBaseClass(selectedDept !== 'ALL')"
        >
          <option value="ALL" [selected]="selectedDept === 'ALL'">Departamento</option>
          @for (d of departments; track d) {
            <option [value]="d" [selected]="selectedDept === d">{{ d }}</option>
          }
        </select>
        <app-icon name="chevron-down" className="w-3 h-3 text-[#E67324] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div class="relative">
        <select
          [value]="selectedEthnicity"
          (change)="selectEthnicity.emit($any($event.target).value)"
          [class]="selectBaseClass(selectedEthnicity !== 'ALL')"
        >
          <option value="ALL" [selected]="selectedEthnicity === 'ALL'">Etnia / Pueblo</option>
          <option value="Wayuu" [selected]="selectedEthnicity === 'Wayuu'">Wayuu</option>
          <option value="Nasa" [selected]="selectedEthnicity === 'Nasa'">Nasa</option>
          <option value="Emberá" [selected]="selectedEthnicity === 'Emberá'">Emberá</option>
          <option value="Nukak" [selected]="selectedEthnicity === 'Nukak'">Nukak</option>
          <option value="Pastos" [selected]="selectedEthnicity === 'Pastos'">Pastos</option>
          <option value="Arhuaco" [selected]="selectedEthnicity === 'Arhuaco'">Arhuaco</option>
        </select>
        <app-icon name="chevron-down" className="w-3 h-3 text-[#E67324] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div class="relative">
        <select
          [value]="selectedStatus"
          (change)="selectStatus.emit($any($event.target).value)"
          [class]="selectBaseClass(selectedStatus !== 'ALL')"
        >
          <option value="ALL" [selected]="selectedStatus === 'ALL'">Estado</option>
          <option value="Optimo" [selected]="selectedStatus === 'Optimo'">Operación Estable</option>
          <option value="Atención" [selected]="selectedStatus === 'Atención'">Requiere Atención</option>
          <option value="Crítico" [selected]="selectedStatus === 'Crítico'">Alerta Crítica</option>
        </select>
        <app-icon name="chevron-down" className="w-3 h-3 text-[#E67324] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  `,
})
export class ColombiaMapFiltersComponent {
  @Input() selectedDept = 'ALL'; // Departamento seleccionado
  @Input() selectedStatus = 'ALL'; // Estado de salud seleccionado
  @Input() selectedPhase = 'ALL'; // Fase del PDM seleccionada
  @Input() selectedEthnicity = 'ALL'; // Etnia seleccionada
  @Input() departments: string[] = []; // Opciones de departamentos disponibles

  @Output() selectDept = new EventEmitter<string>(); // Emite cambio de departamento
  @Output() selectStatus = new EventEmitter<string>(); // Emite cambio de estado de salud
  @Output() selectPhase = new EventEmitter<string>(); // Emite cambio de fase del PDM
  @Output() selectEthnicity = new EventEmitter<string>(); // Emite cambio de etnia

  // Calcula las clases Tailwind del selector resaltando en terracota cuando hay un filtro activo
  selectBaseClass(isActive: boolean): string {
    return `w-full text-[11px] font-bold px-2.5 py-1.5 pr-6 rounded-xl border transition-all duration-150 appearance-none cursor-pointer truncate shadow-2xs ${
      isActive
        ? 'bg-[#8B251E]/10 border-[#8B251E]/40 text-[#8B251E]'
        : 'bg-[#FAF7F2] hover:bg-[#F3EBDD]/70 border-[#E7DFD5] text-stone-700 hover:text-stone-900'
    }`;
  }
}

