import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../shared/components/icon/app-icon.component';
import { MisincolLogoComponent } from '../../shared/components/misincol-logo.component';
import { NetworkStatusBadgeComponent } from '../../shared/components/network-status-badge.component';
import { TeamSelectDropdownComponent } from '../../features/auth/infrastructure/team-select-dropdown.component';
import { AppHeaderUserProfileComponent } from './app-header-user-profile.component';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';
import type { AuthSession } from '../auth/appSession.types';

// Barra superior principal: muestra logo/selector de misión, acciones rápidas de Super Admin, red y perfil
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AppIconComponent,
    MisincolLogoComponent,
    NetworkStatusBadgeComponent,
    TeamSelectDropdownComponent,
    AppHeaderUserProfileComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="no-print w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] sticky top-0 z-30 select-none">
      <div class="h-[2.5px] w-full bg-gradient-to-r from-[#8B251E] via-[#E67324] to-[#8B251E]"></div>

      <div class="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 sm:h-20 flex items-center justify-between relative">
        <div class="flex items-center gap-3">
          @if (shouldShowSidebar()) {
            <button
              type="button"
              (click)="openMobileSidebar.emit()"
              class="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              aria-label="Abrir menú"
            >
              <app-icon name="menu" className="w-4 h-4" />
            </button>

            <div class="flex items-center gap-2 text-xs text-stone-500">
              <span class="font-black text-[#8B251E] tracking-wider font-['Outfit']">MISINCOL</span>
              <span>•</span>
              @if (isSuperAdmin() && activeView() === 'plans') {
                <app-team-select-dropdown
                  [teams]="mappedTeams()"
                  [activeTeamId]="activeTeamId()"
                  (selectTeam)="selectTeam.emit($event)"
                />
              } @else {
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full ring-2 ring-stone-200 bg-[#8B251E]"></span>
                  <span class="text-stone-800 font-bold truncate max-w-[180px] sm:max-w-none font-['Outfit']">
                    {{ activeTeam().name }}
                  </span>
                </div>
              }
            </div>
          } @else {
            <div class="flex items-center gap-2.5 py-1">
              <app-misincol-logo size="sm" [showSubtitle]="false" className="h-9 sm:h-10 w-auto" />
            </div>
          }
        </div>

        @if (activeView() === 'superadmin' && isSuperAdmin()) {
          <div class="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              (click)="openReportModal.emit()"
              class="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer font-['Outfit']"
              title="Descargar informe consolidado nacional"
            >
              <app-icon name="file-down" className="w-3.5 h-3.5 text-[#E67324]" />
              <span class="hidden sm:inline">Informe Consolidado</span>
            </button>

            <button
              type="button"
              (click)="dispatchOpenCreateTeam()"
              class="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#8B251E] to-[#A82E26] hover:from-[#781F19] hover:to-[#8B251E] text-white text-xs font-bold transition shadow-xs hover:shadow-sm active:scale-95 cursor-pointer font-['Outfit']"
              title="Registrar nuevo equipo misionero"
            >
              <app-icon name="plus" className="w-3.5 h-3.5" />
              <span>Nueva Misión</span>
            </button>
          </div>
        }

        <div class="flex items-center gap-2.5 sm:gap-3">
          <app-network-status-badge />
          @if (isSuperAdmin() && activeView() !== 'superadmin') {
            <button
              type="button"
              (click)="goToSuperAdmin.emit()"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#8B251E] text-white text-xs font-bold transition shadow-2xs cursor-pointer font-['Outfit']"
              title="Volver al panel general de supervisión"
            >
              <app-icon name="shield-check" className="w-3.5 h-3.5 text-[#E67324]" />
              <span class="hidden sm:inline">Super Admin</span>
            </button>
          }

          <app-header-user-profile
            [session]="session()"
            [isSuperAdmin]="isSuperAdmin()"
            [activeTeam]="activeTeam()"
            (loggedOut)="logout.emit()"
          />
        </div>
      </div>
    </header>
  `,
})
export class AppHeaderComponent {
  // Entradas reactivas del estado de navegación y equipo seleccionado
  readonly shouldShowSidebar = input.required<boolean>();
  readonly isSuperAdmin = input.required<boolean>();
  readonly activeView = input.required<'plans' | 'superadmin'>();
  readonly mappedTeams = input.required<MissionaryTeam[]>();
  readonly activeTeamId = input.required<string>();
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly session = input.required<AuthSession>();

  // Eventos emitidos hacia el workspace contenedor
  readonly openMobileSidebar = output<void>();
  readonly selectTeam = output<string>();
  readonly goToSuperAdmin = output<void>();
  readonly logout = output<void>();
  readonly openReportModal = output<void>();

  // Dispara el evento global para abrir el modal de creación de nueva misión
  dispatchOpenCreateTeam(): void {
    window.dispatchEvent(new CustomEvent('misincol:open-create-team'));
  }
}

