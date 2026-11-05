// Campos de liderazgo pastoral, teléfono WhatsApp y lista de obreros en el formulario de misión
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { CreateTeamDto } from '../../domain/admin.types';

@Component({
  selector: 'app-team-leader-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3 pt-2 border-t border-stone-100">
      <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider">Liderazgo y Obreros</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Pastor / Líder Ministerial *</label>
          <input
            type="text"
            [value]="formData.leader"
            (input)="updateChange.emit({ leader: $any($event.target).value })"
            placeholder="ej. Pr. David Morales"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Teléfono Móvil (WhatsApp) *</label>
          <input
            type="text"
            [value]="formData.leaderPhone"
            (input)="updateChange.emit({ leaderPhone: $any($event.target).value })"
            placeholder="+57 312 458 9201"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
            required
          />
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold text-stone-600 mb-1">
          Obreros y Miembros del Equipo <span class="text-stone-400 font-normal">(separados por comas)</span>
        </label>
        <input
          type="text"
          [value]="membersInput"
          (input)="onMembersChange($any($event.target).value)"
          placeholder="David Morales, Carlos Pushaina, Ruth Mendoza"
          class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
        />
      </div>
    </div>
  `,
})
export class TeamLeaderFieldsComponent {
  @Input({ required: true }) formData!: CreateTeamDto; // Datos actuales del formulario de misión
  @Input() membersInput = ''; // Texto plano de miembros separados por comas
  @Output() membersInputChange = new EventEmitter<string>(); // Emite el texto crudo de miembros al escribir
  @Output() updateChange = new EventEmitter<Partial<CreateTeamDto>>(); // Emite el arreglo de miembros procesado

  // Convierte la cadena separada por comas en un arreglo limpio de nombres de obreros
  onMembersChange(val: string) {
    this.membersInputChange.emit(val);
    const list = val.split(',').map((s) => s.trim()).filter(Boolean);
    this.updateChange.emit({ members: list });
  }
}

