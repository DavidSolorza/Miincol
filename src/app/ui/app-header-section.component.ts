import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../shared/components/icon/app-icon.component';
import { AdminPreviewBannerComponent } from './admin-preview-banner.component';
import { AppHeaderComponent } from './app-header.component';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';
import type { AuthSession } from '../auth/appSession.types';

// Sección superior del workspace: agrupa el banner de vista previa, botón móvil y cabecera
@Component({
  selector: 'app-header-section',
  standalone: true,
  imports: [AppIconComponent, AdminPreviewBannerComponent, AppHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sticky top-0 z-30">
      @if (isAdminPreview()) {
        <app-admin-preview-banner
          [activeTeam]="activeTeam()"
          [whatsappUrl]="whatsappUrl()"
          (backToAdmin)="backToAdmin.emit()"
        />
      }

      @if (shouldShowSidebar()) {
        <button
          type="button"
          (click)="openMobileSidebar.emit()"
          class="lg:hidden fixed top-3.5 left-3.5 z-40 p-2 rounded-xl bg-white/90 backdrop-blur-md border border-stone-200/80 text-stone-700 shadow-sm hover:bg-white transition cursor-pointer"
          aria-label="Abrir menú"
        >
          <app-icon name="menu" className="w-4 h-4 text-[#8B251E]" />
        </button>
      }

      @if (!shouldShowSidebar()) {
        <app-header
          [shouldShowSidebar]="shouldShowSidebar()"
          [isSuperAdmin]="isSuperAdmin()"
          [activeView]="activeView()"
          [mappedTeams]="mappedTeams()"
          [activeTeamId]="activeTeamId()"
          [activeTeam]="activeTeam()"
          [session]="session()"
          (openMobileSidebar)="openMobileSidebar.emit()"
          (selectTeam)="selectTeam.emit($event)"
          (goToSuperAdmin)="goToSuperAdmin.emit()"
          (logout)="logout.emit()"
          (openReportModal)="openReportModal.emit()"
        />
      }
    </div>
  `,
})
export class AppHeaderSectionComponent {
  // Entradas de estado visual, equipo activo y sesión
  readonly isAdminPreview = input.required<boolean>();
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly whatsappUrl = input<string | null>(null);
  readonly shouldShowSidebar = input.required<boolean>();
  readonly isSuperAdmin = input.required<boolean>();
  readonly activeView = input.required<'plans' | 'superadmin'>();
  readonly mappedTeams = input.required<MissionaryTeam[]>();
  readonly activeTeamId = input.required<string>();
  readonly session = input.required<AuthSession>();

  // Eventos de navegación y acciones del encabezado
  readonly backToAdmin = output<void>();
  readonly openMobileSidebar = output<void>();
  readonly selectTeam = output<string>();
  readonly goToSuperAdmin = output<void>();
  readonly logout = output<void>();
  readonly openReportModal = output<void>();
}

