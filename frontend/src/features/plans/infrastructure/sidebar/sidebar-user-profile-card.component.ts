import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';

@Component({
  selector: 'app-sidebar-user-profile-card',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isCollapsed()) {
      <div class="p-2 flex justify-center">
        <button
          type="button"
          (click)="handleLogoutClick()"
          [title]="activeTeam().leader + ' • Click para cerrar sesión'"
          class="w-9 h-9 rounded-full bg-gradient-to-r from-[#D95B14] to-[#C0420E] hover:opacity-90 text-white font-black text-xs flex items-center justify-center transition-opacity shadow-xs cursor-pointer"
        >
          <app-icon name="users" className="w-5 h-5 text-white" />
        </button>
      </div>
    } @else {
      <div class="p-2 pt-1 select-none">
        <div
          class="rounded-2xl py-1.5 px-2.5 flex items-center justify-between text-stone-900 shadow-2xs transition-all duration-200 ease-out group overflow-hidden"
          style="background: linear-gradient(90deg, #FDF0E8 0%, #F18A38 60%, #B83A05 100%)"
        >
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <div class="w-7 h-7 rounded-full bg-white text-stone-900 border border-stone-200/80 flex items-center justify-center shrink-0 shadow-2xs">
              <app-icon name="users" className="w-3.5 h-3.5 text-stone-900" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[11px] font-bold truncate leading-tight font-['Outfit'] text-stone-950">
                {{ activeTeam().leader }}
              </p>
              <p class="text-[9.5px] text-stone-800 font-semibold truncate leading-tight font-['Outfit']">
                {{ activeTeam().ethnicity || activeTeam().name }}
              </p>
            </div>
          </div>

          <button
            type="button"
            (click)="handleLogoutClick()"
            title="Cerrar sesión"
            class="text-white hover:text-amber-200 p-1 rounded-lg transition-colors duration-200 cursor-pointer shrink-0"
          >
            <app-icon name="log-out" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    }
  `,
})
// Tarjeta inferior de perfil del equipo activo con opción de confirmación para cerrar sesión
export class SidebarUserProfileCardComponent {
  private readonly toastService = inject(ToastService); // Servicio de notificaciones y diálogos de confirmación

  readonly activeTeam = input.required<MissionaryTeam>(); // Información del equipo misionero en sesión
  readonly isCollapsed = input.required<boolean>(); // Indica si la barra lateral está contraída
  readonly loggedOut = output<void>(); // Emite el evento de salida cuando el usuario confirma cerrar sesión

  // Solicita confirmación al usuario antes de emitir el cierre de sesión
  handleLogoutClick(): void {
    this.toastService.confirmAction({
      title: '¿Cerrar Sesión Territorial?',
      message: `¿Estás seguro de que deseas salir de la sesión de ${this.activeTeam().leader}?`,
      confirmLabel: 'Sí, Salir',
      cancelLabel: 'Cancelar',
      type: 'warning',
      onConfirm: () => this.loggedOut.emit(),
    });
  }
}

