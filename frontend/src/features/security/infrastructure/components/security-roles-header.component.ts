import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { SYSTEM_ROLES } from '../../domain/security.types';

@Component({
  selector: 'app-security-roles-header',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3.5">
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white/95 p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-stone-900 text-[#E67324] flex items-center justify-center shadow-2xs">
            <app-icon name="shield" className="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-stone-900 font-['Outfit'] leading-tight">
              Gestor de Roles y Seguridad Territorial
            </h2>
            <p class="text-[11px] text-stone-500">
              Control de acceso basado en roles (RBAC) y asignación directa a personas
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 gap-1">
            <button
              type="button"
              (click)="tabChanged.emit('matrix')"
              [class]="'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-[\'Outfit\'] ' +
                (activeTab() === 'matrix' ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60')
              "
            >
              <app-icon name="layers" className="w-3.5 h-3.5 text-[#E67324]" />
              <span>Matriz de Permisos</span>
            </button>
            <button
              type="button"
              (click)="tabChanged.emit('users')"
              [class]="'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-[\'Outfit\'] ' +
                (activeTab() === 'users' ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60')
              "
            >
              <app-icon name="users" className="w-3.5 h-3.5 text-[#E67324]" />
              <span>Roles de Personas</span>
            </button>
          </div>

          @if (activeTab() === 'matrix') {
            <button
              type="button"
              (click)="resetDefaults.emit()"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition cursor-pointer shadow-2xs font-['Outfit'] active:scale-95"
              title="Restablecer matriz por defecto"
            >
              <app-icon name="rotate-ccw" className="w-3.5 h-3.5 text-stone-500" />
              <span class="hidden sm:inline">Restablecer</span>
            </button>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        @for (role of roles; track role.id) {
          <div class="p-3 rounded-2xl bg-white/95 border border-stone-200/80 shadow-2xs space-y-1.5">
            <div class="flex items-center justify-between gap-1">
              <span class="text-xs font-black text-stone-900 font-['Outfit']">{{ role.name }}</span>
              <span
                class="text-[9.5px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider font-['Outfit']"
                [class]="role.badgeClass"
              >
                {{ role.badge }}
              </span>
            </div>
            <p class="text-[11px] text-stone-500 leading-snug">{{ role.description }}</p>
            <div class="pt-0.5 flex items-center gap-1 text-[10px] text-stone-400">
              <app-icon name="user" className="w-3 h-3 text-stone-400" />
              <span>Perfil: <strong class="text-stone-700 font-semibold">{{ role.targetUser }}</strong></span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class SecurityRolesHeaderComponent {
  readonly roles = SYSTEM_ROLES;
  readonly activeTab = input<'matrix' | 'users'>('matrix');
  readonly tabChanged = output<'matrix' | 'users'>();
  readonly resetDefaults = output<void>();
}
