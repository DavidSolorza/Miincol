// Fila atómica para configurar los datos y cuenta de acceso de un integrante de equipo
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { TeamMemberAccount } from '../../domain/admin.types';

@Component({
  selector: 'app-team-member-input-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="font-bold text-stone-700">Integrante #{{ index + 1 }}</span>
          @if (isExistingUser()) {
            <span class="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 font-semibold px-1.5 py-0.5 rounded">
              Usuario en Base de Datos
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
            [attr.list]="'users-datalist-' + index"
            [value]="member.email"
            (input)="onEmailChange($any($event.target).value)"
            placeholder="marta@misincol.org"
            class="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 text-stone-800"
            required
          />
          <datalist [id]="'users-datalist-' + index">
            @for (u of availableUsers; track (u.email + '-' + $index)) {
              <option [value]="u.email">{{ u.fullName }}</option>
            }
          </datalist>
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
