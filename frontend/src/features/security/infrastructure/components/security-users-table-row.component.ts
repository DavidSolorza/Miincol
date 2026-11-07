import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { SystemUser, RoleOption } from '../../domain/security-users.types';
import type { SystemRoleId } from '../../domain/security.types';

@Component({
  selector: '[app-security-users-table-row]',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td class="py-2.5 px-3">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs border border-stone-200">
          {{ user().fullName.slice(0, 2).toUpperCase() }}
        </div>
        <div>
          <div class="font-bold text-stone-900 leading-tight">{{ user().fullName }}</div>
          <div class="text-[10.5px] text-stone-400">{{ user().email }}</div>
        </div>
      </div>
    </td>
    <td class="py-2.5 px-3">
      <div class="text-stone-800 font-medium">{{ user().teamName }}</div>
      <div class="text-[10.5px] text-stone-500">{{ user().territory }}</div>
    </td>
    <td class="py-2.5 px-3">
      <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider font-['Outfit']" [class]="getRoleBadge()">
        {{ getRoleLabel() }}
      </span>
    </td>
    <td class="py-2.5 px-3 text-center">
      <div class="inline-flex items-center p-0.5 rounded-xl bg-stone-100 border border-stone-200 gap-0.5">
        @for (opt of roleOptions(); track opt.id) {
          <button
            type="button"
            (click)="roleChanged.emit({ userId: user().id, newRole: opt.id })"
            class="px-2 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer font-['Outfit']"
            [class]="user().role === opt.id ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'"
            [title]="'Asignar rol: ' + opt.label"
          >{{ opt.label }}</button>
        }
      </div>
    </td>
    <td class="py-2.5 px-3 text-center">
      <div class="inline-flex items-center gap-1">
        <button
          type="button"
          (click)="editClicked.emit(user())"
          class="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
          title="Editar datos de la persona"
        >
          <app-icon name="edit-3" className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          (click)="deleteClicked.emit(user())"
          class="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
          title="Eliminar colaborador del sistema"
        >
          <app-icon name="trash-2" className="w-3.5 h-3.5" />
        </button>
      </div>
    </td>
  `,
  host: {
    'class': 'hover:bg-stone-50/60 transition-colors',
  },
})
export class SecurityUsersTableRowComponent {
  readonly user = input.required<SystemUser>();
  readonly roleOptions = input.required<RoleOption[]>();
  readonly roleChanged = output<{ userId: string; newRole: SystemRoleId }>();
  readonly editClicked = output<SystemUser>();
  readonly deleteClicked = output<SystemUser>();

  getRoleLabel(): string {
    return this.roleOptions().find((r) => r.id === this.user().role)?.label || this.user().role;
  }

  getRoleBadge(): string {
    return this.roleOptions().find((r) => r.id === this.user().role)?.badgeClass || '';
  }
}
