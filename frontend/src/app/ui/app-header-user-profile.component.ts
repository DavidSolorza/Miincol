import { Component, ChangeDetectionStrategy, input, output, computed, inject } from '@angular/core';
import { AppIconComponent } from '../../shared/components/icon/app-icon.component';
import { ToastService } from '../../shared/components/toast/toast.service';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';
import type { AuthSession } from '../auth/appSession.types';

// Bloque de perfil de usuario en la cabecera: muestra avatar, rol/nombre y botón de cierre de sesión
@Component({
  selector: 'app-header-user-profile',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-4 border-l border-stone-200/90">
      <div class="flex items-center gap-2.5">
        <div class="relative">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-stone-200/80 shrink-0 bg-gradient-to-br from-[#8B251E] to-[#E67324]">
            <app-icon [name]="isSuperAdmin() ? 'shield' : 'user'" className="w-4 h-4 text-white" />
          </div>
          <span
            class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"
            title="Sesión activa"
          ></span>
        </div>

        <span class="hidden sm:inline font-bold text-stone-900 leading-tight text-xs sm:text-sm font-['Outfit'] tracking-tight">
          {{ displayName() }}
        </span>
      </div>

      <button
        type="button"
        (click)="handleLogoutClick()"
        class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200/80 hover:border-rose-200 shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
        title="Cerrar sesión del sistema"
        aria-label="Cerrar sesión"
      >
        <app-icon name="log-out" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </button>
    </div>
  `,
})
export class AppHeaderUserProfileComponent {
  private readonly toastService = inject(ToastService);

  // Entradas de sesión activa y equipo misionero
  readonly session = input.required<AuthSession>();
  readonly isSuperAdmin = input.required<boolean>();
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly loggedOut = output<void>();

  // Nombre visible según si es Coordinador de Equipos o misión territorial
  readonly displayName = computed(() =>
    this.isSuperAdmin() ? 'Coordinador de Equipos' : this.activeTeam().name || this.session().userName
  );

  // Solicita confirmación antes de cerrar la sesión activa
  handleLogoutClick(): void {
    this.toastService.confirmAction({
      title: '¿Cerrar Sesión del Sistema?',
      message: '¿Estás seguro de que deseas salir de tu sesión actual en MISINCOL?',
      confirmLabel: 'Sí, Salir',
      cancelLabel: 'Cancelar',
      type: 'warning',
      onConfirm: () => this.loggedOut.emit(),
    });
  }
}

