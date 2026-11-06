import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES, type PermissionDef, type RolePermissionsMatrix, type SystemRoleId, type PermissionKey } from '../../domain/security.types';

@Component({
  selector: 'app-security-matrix-table',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr class="bg-stone-50 border-b border-stone-200 text-stone-700 text-xs font-['Outfit']">
              <th class="py-3 px-4 font-black uppercase tracking-wider text-[11px] w-1/2">
                Acción / Privilegio del Sistema
              </th>
              @for (role of roles; track role.id) {
                <th class="py-3 px-3 text-center font-black uppercase tracking-wider text-[11px]">
                  <div class="inline-flex flex-col items-center">
                    <span>{{ role.name }}</span>
                    <span [class]="'text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 border ' + role.badgeClass">
                      {{ role.badge }}
                    </span>
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-xs">
            @for (perm of permissions; track perm.key) {
              <tr class="hover:bg-stone-50/70 transition-colors">
                <td class="py-2.5 px-4">
                  <div class="flex items-start gap-2">
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-stone-900 font-['Outfit'] text-xs">{{ perm.label }}</span>
                        <span class="text-[9.5px] px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 font-medium">
                          {{ perm.category }}
                        </span>
                      </div>
                      <p class="text-[10.5px] text-stone-500 leading-tight mt-0.5">{{ perm.description }}</p>
                    </div>
                  </div>
                </td>
                @for (role of roles; track role.id) {
                  @let isGranted = matrix()[role.id][perm.key];
                  @let isLocked = role.id === 'national_director' && (perm.key === 'security.roles.manage' || perm.key === 'audit.history.view');
                  <td class="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      [disabled]="isLocked"
                      (click)="toggle.emit({ role: role.id, perm: perm.key })"
                      [class]="'w-8 h-8 rounded-xl inline-flex items-center justify-center transition shadow-2xs ' +
                        (isGranted
                          ? (isLocked ? 'bg-stone-800 text-white cursor-not-allowed opacity-90' : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95')
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-400 hover:text-stone-600 border border-stone-200 cursor-pointer active:scale-95')
                      "
                      [title]="(isGranted ? 'Permitido' : 'Denegado') + ' para ' + role.name + (isLocked ? ' (Protegido)' : '')"
                    >
                      <app-icon [name]="isGranted ? 'check' : 'x'" className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class SecurityMatrixTableComponent {
  readonly matrix = input.required<RolePermissionsMatrix>();
  readonly roles = SYSTEM_ROLES;
  readonly permissions = SYSTEM_PERMISSIONS;
  readonly toggle = output<{ role: SystemRoleId; perm: PermissionKey }>();
}

