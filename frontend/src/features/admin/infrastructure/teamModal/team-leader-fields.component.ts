// Campos de liderazgo pastoral, credenciales y gestión de integrantes con cuenta en la misión
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import type { CreateTeamDto, TeamMemberAccount } from '../../domain/admin.types';
import { SecurityUsersService } from '../../../security/application/security-users.service';
import { TeamMemberInputRowComponent } from './team-member-input-row.component';

@Component({
  selector: 'app-team-leader-fields',
  standalone: true,
  imports: [TeamMemberInputRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3 pt-2 border-t border-stone-100 font-['Outfit']">
      <h4 class="text-xs font-bold text-stone-700 uppercase tracking-wider">Liderazgo y Acceso Pastoral</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Pastor / Líder Ministerial *</label>
          <input
            type="text"
            [value]="formData.leader"
            (input)="updateChange.emit({ leader: $any($event.target).value })"
            placeholder="ej. Pr. David Morales"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-stone-400 text-stone-800"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">Correo de Acceso del Líder *</label>
          <input
            type="email"
            list="leader-users-datalist"
            [value]="formData.leaderEmail || ''"
            (input)="onLeaderEmailChange($any($event.target).value)"
            placeholder="pastor@misincol.org"
            class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-stone-400 text-stone-800"
            required
          />
          <datalist id="leader-users-datalist">
            @for (u of availableUsers(); track (u.email + '-' + $index)) {
              <option [value]="u.email">{{ u.fullName }}</option>
            }
          </datalist>
        </div>
      </div>

      <div class="text-[11px] text-stone-500 bg-stone-100/60 p-2.5 rounded-xl border border-stone-200/60">
        <span>El pastor líder y los integrantes ingresan a la plataforma utilizando su correo institucional y la clave compartida de su equipo.</span>
      </div>

      <div class="pt-2 border-t border-stone-100 space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Integrantes del Equipo (Cuentas con Correo y Rol)
          </label>
          <button
            type="button"
            (click)="addMemberAccount()"
            class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-900 text-white transition cursor-pointer"
          >
            + Agregar Integrante
          </button>
        </div>

        @if ((formData.membersWithAccounts || []).length === 0) {
          <p class="text-xs text-stone-400 italic py-1">
            No hay integrantes específicos configurados. Los usuarios pueden agregarse con su correo institucional.
          </p>
        }

        <div class="space-y-2">
          @for (member of formData.membersWithAccounts || []; track $index) {
            <app-team-member-input-row
              [member]="member"
              [index]="$index"
              [availableUsers]="availableUsers()"
              (update)="updateMemberAccount($event.index, $event.data)"
              (remove)="removeMemberAccount($event)"
            />
          }
        </div>
      </div>
    </div>
  `,
})
export class TeamLeaderFieldsComponent {
  private readonly securityUsersSvc = inject(SecurityUsersService);
  readonly availableUsers = computed(() => {
    const map = new Map<string, { email: string; fullName: string }>();
    this.securityUsersSvc.users().forEach((u) => {
      const e = u.email.trim().toLowerCase();
      if (e && !map.has(e)) map.set(e, { email: e, fullName: u.fullName });
    });
    return Array.from(map.values());
  });

  @Input({ required: true }) formData!: CreateTeamDto;
  @Input() membersInput = '';
  @Output() membersInputChange = new EventEmitter<string>();
  @Output() updateChange = new EventEmitter<Partial<CreateTeamDto>>();

  onLeaderEmailChange(email: string): void {
    const match = this.availableUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    const patch: Partial<CreateTeamDto> = { leaderEmail: email };
    if (match && !this.formData.leader) patch.leader = match.fullName;
    this.updateChange.emit(patch);
  }

  addMemberAccount(): void {
    const current = [...(this.formData.membersWithAccounts || [])];
    current.push({ fullName: '', email: '', roleInTeam: 'Misionero de Campo' });
    this.syncMembers(current);
  }

  updateMemberAccount(index: number, patch: Partial<TeamMemberAccount>): void {
    const current = [...(this.formData.membersWithAccounts || [])];
    current[index] = { ...current[index], ...patch };
    this.syncMembers(current);
  }

  removeMemberAccount(index: number): void {
    const current = [...(this.formData.membersWithAccounts || [])];
    current.splice(index, 1);
    this.syncMembers(current);
  }

  private syncMembers(list: TeamMemberAccount[]): void {
    const names = list.map((m) => m.fullName.trim()).filter(Boolean);
    this.updateChange.emit({
      membersWithAccounts: list,
      members: names.length > 0 ? names : this.formData.members,
    });
  }
}
