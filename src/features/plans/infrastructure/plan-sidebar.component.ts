import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import type { PhasePlan, PhaseType, PlanMetrics } from '../domain/plan.types';
import type { MissionaryTeam, UserRole } from '../../auth/domain/auth.types';
import { SidebarBrandComponent } from './sidebar/sidebar-brand.component';
import { SidebarSegmentedControlComponent } from './sidebar/sidebar-segmented-control.component';
import { SidebarPhasesListComponent } from './sidebar/sidebar-phases-list.component';
import { SidebarMetricsCardComponent } from './sidebar/sidebar-metrics-card.component';
import { SidebarFooterActionsComponent } from './sidebar/sidebar-footer-actions.component';
import { SidebarRemindersCardComponent } from './sidebar/sidebar-reminders-card.component';
import { SidebarUserProfileCardComponent } from './sidebar/sidebar-user-profile-card.component';

@Component({
  selector: 'app-plan-sidebar',
  standalone: true,
  imports: [
    SidebarBrandComponent,
    SidebarSegmentedControlComponent,
    SidebarPhasesListComponent,
    SidebarMetricsCardComponent,
    SidebarFooterActionsComponent,
    SidebarRemindersCardComponent,
    SidebarUserProfileCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpenMobile()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden" (click)="closeMobile.emit()"></div>
    }

    <aside
      [class]="
        'fixed lg:sticky top-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between select-none lg:my-2 lg:ml-2 lg:h-[calc(100vh-16px)] rounded-[22px] overflow-hidden border border-stone-200/80 shadow-[0_8px_24px_-6px_rgba(40,20,15,0.06)] ' +
        (isCollapsed() ? 'lg:w-15 ' : 'lg:w-56 xl:w-60 ') +
        (isOpenMobile() ? 'translate-x-0 w-60 h-full rounded-r-[22px]' : '-translate-x-full lg:translate-x-0')
      "
      style="background: linear-gradient(185deg, #FAF7F2 0%, #FAF5EE 50%, #F5ECE0 100%)"
    >
      <app-sidebar-brand
        [isCollapsed]="isCollapsed()"
        (toggleCollapse)="toggleCollapse.emit()"
        (closeMobile)="closeMobile.emit()"
      />

      <app-sidebar-segmented-control
        [isCollapsed]="isCollapsed()"
        (viewChanged)="changeView.emit($event)"
      />

      <div class="flex-1 overflow-y-auto px-2.5 py-1.5 space-y-2 sidebar-scroll-smooth">
        @if (activeView() === 'plans') {
          <app-sidebar-phases-list
            [allPlans]="allPlans()"
            [activePhaseId]="activePhaseId()"
            [activeView]="activeView()"
            [isCollapsed]="isCollapsed()"
            [activeTeam]="activeTeam()"
            (phaseSelected)="selectPhase.emit($event)"
            (viewChanged)="changeView.emit($event)"
          />
        }

        @if (!isCollapsed() && activeView() === 'plans') {
          <app-sidebar-metrics-card [metrics]="metrics()" />
        }

        <app-sidebar-footer-actions
          [activeView]="activeView()"
          [isTeamRestricted]="userRole() === 'team'"
          [isCollapsed]="isCollapsed()"
          [isOpenMobile]="isOpenMobile()"
          [whatsappUrl]="whatsappUrl()"
          (closeMobile)="closeMobile.emit()"
          (openReportModal)="openReportModal.emit()"
          (openNotesModal)="openNotesModal.emit()"
        />

        @if (activeView() === 'plans') {
          <app-sidebar-reminders-card
            [isCollapsed]="isCollapsed()"
            (openNotesModal)="openNotesModal.emit()"
          />
        }
      </div>

      <app-sidebar-user-profile-card
        [activeTeam]="activeTeam()"
        [isCollapsed]="isCollapsed()"
        (loggedOut)="logout.emit()"
      />
    </aside>
  `,
})
// Barra lateral principal de navegación entre fases del PDM, métricas rápidas y acciones del equipo
export class PlanSidebarComponent {
  readonly allPlans = input.required<Record<string, PhasePlan>>(); // Todos los planes por fase del equipo
  readonly activePhaseId = input.required<PhaseType>(); // Identificador de la fase actualmente activa
  readonly metrics = input.required<PlanMetrics>(); // Métricas consolidadas de la fase activa
  readonly activeTeam = input.required<MissionaryTeam>(); // Datos del equipo misionero activo
  readonly activeView = input.required<'plans' | 'superadmin'>(); // Vista activa de la aplicación
  readonly isCollapsed = input.required<boolean>(); // Indica si el panel lateral está contraído en escritorio
  readonly isOpenMobile = input.required<boolean>(); // Indica si el cajón lateral está abierto en móvil
  readonly userRole = input<UserRole>('admin'); // Rol del usuario autenticado
  readonly whatsappUrl = input<string | null | undefined>(null); // Enlace directo de contacto por WhatsApp

  readonly selectPhase = output<PhaseType>(); // Emite la fase seleccionada por el usuario
  readonly openReportModal = output<void>(); // Solicita abrir el modal de informe ejecutivo PDM
  readonly openNotesModal = output<void>(); // Solicita abrir el modal de notas y agenda territorial
  readonly changeView = output<'plans' | 'superadmin'>(); // Solicita cambiar entre la vista de planes y supervisión
  readonly toggleCollapse = output<void>(); // Alterna el estado contraído o expandido de la barra lateral
  readonly closeMobile = output<void>(); // Cierra la barra lateral en dispositivos móviles
  readonly logout = output<void>(); // Emite el evento de cierre de sesión
}

