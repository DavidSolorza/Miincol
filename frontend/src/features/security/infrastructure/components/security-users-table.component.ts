import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { USER_ROLE_OPTIONS, type SystemUser } from '../../domain/security-users.types';
import type { SystemRoleId } from '../../domain/security.types';

@Component({
  selector: 'app-security-users-table',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none space-y-3 p-3.5 sm:p-4">
      <div class="flex flex-wrap items-center justify-between gap-2.5 border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <app-icon name="users" className="w-4 h-4 text-[#E67324]" />
          <h3 class="text-xs sm:text-sm font-black text-stone-900 font-['Outfit']">
            Asignación de Roles por Colaborador ({{ filteredUsers().length }} Personas)
          </h3>
        </div>
        <div class="relative min-w-[200px] sm:min-w-[260px]">
          <input
            type="text"
            [value]="searchTerm()"
            (input)="searchTerm.set($any($event.target).value)"
            placeholder="Buscar por nombre, territorio o misión..."
            class="w-full text-xs py-1.5 pl-8 pr-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-['Outfit']"
          />
          <app-icon name="search" className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr class="bg-stone-50/80 text-stone-600 text-[10.5px] uppercase font-['Outfit'] tracking-wider border-b border-stone-200">
              <th class="py-2.5 px-3 font-bold">Colaborador</th>
              <th class="py-2.5 px-3 font-bold">Territorio / Misión</th>
              <th class="py-2.5 px-3 font-bold">Rol Actual</th>
              <th class="py-2.5 px-3 font-bold text-center">Reasignar Rol</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-xs font-['Outfit']">
            @for (user of filteredUsers(); track user.id) {
              <tr class="hover:bg-stone-50/60 transition-colors">
                <td class="py-2.5 px-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs border border-stone-200">
                      {{ user.fullName.slice(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-bold text-stone-900 leading-tight">{{ user.fullName }}</div>
                      <div class="text-[10.5px] text-stone-400">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-2.5 px-3">
                  <div class="text-stone-800 font-medium">{{ user.teamName }}</div>
                  <div class="text-[10.5px] text-stone-500">{{ user.territory }}</div>
                </td>
                <td class="py-2.5 px-3">
                  <span
                    class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider font-['Outfit']"
                    [class]="getRoleBadge(user.role)"
                  >
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="py-2.5 px-3 text-center">
                  <div class="inline-flex items-center p-0.5 rounded-xl bg-stone-100 border border-stone-200 gap-0.5">
                    @for (opt of roleOptions; track opt.id) {
                      <button
                        type="button"
                        (click)="roleChanged.emit({ userId: user.id, newRole: opt.id })"
                        [class]="'px-2 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer font-[\'Outfit\'] ' +
                          (user.role === opt.id
                            ? 'bg-stone-900 text-white shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60')
                        "
                        [title]="'Asignar rol: ' + opt.label"
                      >
                        {{ opt.label.replace(' ', '\n') }}
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class SecurityUsersTableComponent {
  readonly users = input.required<SystemUser[]>();
  readonly roleChanged = output<{ userId: string; newRole: SystemRoleId }>();
  readonly searchTerm = signal('');
  readonly roleOptions = USER_ROLE_OPTIONS;

  readonly filteredUsers = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    const list = this.users();
    if (!q) return list;
    return list.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.teamName.toLowerCase().includes(q) ||
        (u.territory && u.territory.toLowerCase().includes(q))
    );
  });

  getRoleLabel(roleId: SystemRoleId): string {
    return this.roleOptions.find((r) => r.id === roleId)?.label || roleId;
  }

  getRoleBadge(roleId: SystemRoleId): string {
    return this.roleOptions.find((r) => r.id === roleId)?.badgeClass || '';
  }
}
