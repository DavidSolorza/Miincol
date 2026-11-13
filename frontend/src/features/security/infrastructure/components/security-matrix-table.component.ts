import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES, type RolePermissionsMatrix, type SystemRoleId, type PermissionKey } from '../../domain/security.types';
import { getRolePermissionConstraint, type PermissionConstraintResult } from '../../domain/security-constraints.helper';

@Component({
  selector: 'app-security-matrix-table',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none">
      <div class="px-4 py-3 bg-stone-50/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-['Outfit']">
        <span class="font-bold text-stone-700">Gobernanza RBAC: Generalidades vs Restricciones Específicas</span>
        <div class="flex items-center gap-3 text-stone-600">
          <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Concedido</span>
          <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700 inline-block"></span> Protegido</span>
          <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-stone-200 inline-block"></span> Restringido</span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr class="bg-stone-50 border-b border-stone-200 text-stone-700 text-xs font-['Outfit']">
              <th class="py-3 px-4 font-black uppercase tracking-wider text-[11px] w-1/2">Acción / Privilegio del Sistema</th>
              @for (role of roles; track role.id) {
                <th class="py-3 px-3 text-center font-black uppercase tracking-wider text-[11px]">
                  <div class="inline-flex flex-col items-center">
                    <span>{{ role.name }}</span>
                    <span class="text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 border" [class]="role.badgeClass">
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
                  @let c = getConstraint(role.id, perm.key);
                  <td class="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      [disabled]="c.type !== 'configurable'"
                      (click)="c.type === 'configurable' && toggle.emit({ role: role.id, perm: perm.key })"
                      [class]="getCellClass(c)"
                      [title]="getCellTitle(role.name, c)"
                    >
                      <app-icon [name]="c.effectiveValue ? 'check' : 'x'" className="w-4 h-4 stroke-[2.5]" />
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

  getConstraint(roleId: SystemRoleId, permKey: PermissionKey): PermissionConstraintResult {
    const configured = !!this.matrix()?.[roleId]?.[permKey];
    return getRolePermissionConstraint(roleId, permKey, configured);
  }

  getCellClass(c: PermissionConstraintResult): string {
    const base = 'w-8 h-8 rounded-xl inline-flex items-center justify-center transition shadow-2xs ';
    if (c.type === 'protected') {
      return base + 'bg-stone-900 text-[#E67324] border border-stone-800 cursor-not-allowed shadow-inner';
    }
    if (c.type === 'restricted') {
      return base + 'bg-stone-100 text-stone-300 border border-stone-200 cursor-not-allowed opacity-60';
    }
    if (c.effectiveValue) {
      return base + 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95';
    }
    return base + 'bg-stone-100 hover:bg-stone-200 text-stone-400 hover:text-stone-600 border border-stone-200 cursor-pointer active:scale-95';
  }

  getCellTitle(roleName: string, c: PermissionConstraintResult): string {
    if (c.type === 'protected') {
      return `[PROTEGIDO] Obligatorio para ${roleName}: ${c.reason || 'Privilegio raíz del sistema.'}`;
    }
    if (c.type === 'restricted') {
      return `[RESTRINGIDO] No disponible para ${roleName}: ${c.reason || 'Restricción de perfil de seguridad.'}`;
    }
    return `${c.effectiveValue ? 'Permitido' : 'Denegado'} para ${roleName} (Generalidad configurable: clic para alternar)`;
  }
}
