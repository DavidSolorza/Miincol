// Fila atómica para configurar los datos y cuenta de acceso de un integrante de equipo
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { TeamMemberAccount } from '../../domain/admin.types';

@Component({
  selector: 'app-team-member-input-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2.5 text-xs">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="font-bold text-stone-700">Integrante #{{ index + 1 }}</span>
          @if (isExistingUser()) {
            <span class="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
              ✓ Usuario Registrado
            </span>
          } @else if (member.email) {
            <span class="text-[10px] text-blue-700 bg-blue-50 border border-blue-200/60 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
              ✉ Nuevo (Se enviará bienvenida)
            </span>
          }
        </div>
        <button
          type="button"
          (click)="remove.emit(index)"
          class="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded-lg font-semibold transition cursor-pointer"
        >
          Quitar
        </button>
      </div>

      <div>
        <label class="block font-semibold text-stone-600 mb-1">Elegir Usuario Registrado o Crear Nuevo</label>
        <select
          [value]="selectedUserValue()"
          (change)="onDropdownSelect($any($event.target).value)"
          class="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:border-stone-500 text-stone-800 font-medium"
        >
          <option value="">-- Seleccionar usuario registrado del sistema --</option>
          @for (u of availableUsers; track (u.email + '-' + $index)) {
            <option [value]="u.email">{{ u.fullName }} — {{ u.email }}</option>
          }
          <option value="__NEW__">➕ Registrar nuevo usuario / colaborador</option>
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label class="block font-medium text-stone-600 mb-0.5">Nombre Completo *</label>
          <input
            type="text"
            [value]="member.fullName"
            (input)="onFieldChange('fullName', $any($event.target).value)"
            placeholder="ej. Marta Pérez"
            class="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 text-stone-800"
            required
          />
        </div>
        <div>
          <label class="block font-medium text-stone-600 mb-0.5">Correo Electrónico (Login) *</label>
          <input
            type="email"
            [value]="member.email"
            (input)="onEmailChange($any($event.target).value)"
            placeholder="marta@misincol.org"
            class="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 text-stone-800"
            required
          />
        </div>
      </div>

      <div>
        <label class="block font-medium text-stone-600 mb-0.5">Rol en la Misión</label>
        <input
          type="text"
          [value]="member.roleInTeam || ''"
          (input)="onFieldChange('roleInTeam', $any($event.target).value)"
          placeholder="ej. Misionero de Campo / Promotora de Salud"
          class="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 text-stone-800"
        />
      </div>
    </div>
  `,
})
export class TeamMemberInputRowComponent {
  @Input({ required: true }) member!: TeamMemberAccount;
  @Input({ required: true }) index!: number;
  @Input() availableUsers: { email: string; fullName: string }[] = [];
  @Output() update = new EventEmitter<{ index: number; data: Partial<TeamMemberAccount> }>();
  @Output() remove = new EventEmitter<number>();

  selectedUserValue(): string {
    if (!this.member.email) return '';
    const clean = this.member.email.trim().toLowerCase();
    const exists = this.availableUsers.some((u) => u.email.toLowerCase() === clean);
    return exists ? clean : '__NEW__';
  }

  onDropdownSelect(val: string): void {
    if (val === '__NEW__') {
      if (this.isExistingUser()) {
        this.update.emit({ index: this.index, data: { fullName: '', email: '' } });
      }
      return;
    }
    const found = this.availableUsers.find((u) => u.email.toLowerCase() === val.toLowerCase());
    if (found) {
      this.update.emit({ index: this.index, data: { email: found.email, fullName: found.fullName } });
    }
  }

  onFieldChange(field: keyof TeamMemberAccount, value: string): void {
    this.update.emit({ index: this.index, data: { [field]: value } });
  }

  onEmailChange(email: string): void {
    const match = this.availableUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (match) {
      this.update.emit({
        index: this.index,
        data: { email, fullName: this.member.fullName ? this.member.fullName : match.fullName },
      });
    } else {
      this.onFieldChange('email', email);
    }
  }

  isExistingUser(): boolean {
    if (!this.member.email) return false;
    const clean = this.member.email.trim().toLowerCase();
    return this.availableUsers.some((u) => u.email.toLowerCase() === clean);
  }
}
