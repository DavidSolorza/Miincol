import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
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
    AppIconComponent, SidebarBrandComponent, SidebarSegmentedControlComponent,
    SidebarPhasesListComponent, SidebarMetricsCardComponent, SidebarFooterActionsComponent,
    SidebarRemindersCardComponent, SidebarUserProfileCardComponent,
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
      style="background: linear-gradient(180deg, #FBF9F6 0%, #F8F5EE 100%)"
    >
      <app-sidebar-brand
        [isCollapsed]="isCollapsed()"
        (toggleCollapse)="toggleCollapse.emit()"
        (closeMobile)="closeMobile.emit()"
      />

        @if (isAdminPreview()) {
          <div class="px-2.5 pt-0.5 pb-1 select-none">
            <button
              type="button"
              (click)="backToAdmin.emit()"
              class="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300/80 text-[10.5px] font-bold font-['Outfit'] transition shadow-2xs cursor-pointer active:scale-95"
              title="Regresar al Tablero de Supervisión Nacional"
            >
              <app-icon name="arrow-left" className="w-3.5 h-3.5 text-amber-900 shrink-0" />
              @if (!isCollapsed()) { <span class="truncate">Volver a Supervisión</span> }
            </button>
          </div>
        }

      <div class="space-y-1">
        <app-sidebar-segmented-control
          [isCollapsed]="isCollapsed()"
          (viewChanged)="changeView.emit($event)"
        />

        @if (userRole() === 'admin') {
          <div [class]="isCollapsed() ? 'px-2 flex justify-center' : 'px-2.5'">
            <button
              type="button"
              (click)="changeView.emit('audit')"
              class="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-xl border border-stone-200/80 text-stone-700 hover:bg-stone-100 shadow-2xs transition cursor-pointer font-['Outfit'] text-[10.5px] font-bold uppercase tracking-wider"
              [class.bg-stone-900]="activeView() === 'audit'"
              [class.text-white]="activeView() === 'audit'"
              [class.border-stone-800]="activeView() === 'audit'"
              title="Historial de Ingresos y Auditoría de Cambios"
            >
              <app-icon name="clock" className="w-3.5 h-3.5 text-[#E67324] shrink-0" />
              @if (!isCollapsed()) {
                <span class="truncate">Historial</span>
              }
            </button>
          </div>
        }
      </div>

      <div class="flex-1 overflow-y-auto px-2.5 py-1.5 space-y-2 sidebar-scroll-smooth">
        @if (activeView() !== 'superadmin' && activeView() !== 'audit') {
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

        @if (!isCollapsed() && activeView() !== 'superadmin' && activeView() !== 'audit') {
          <app-sidebar-metrics-card [metrics]="metrics()" />
        }

        <app-sidebar-footer-actions
          [activeView]="activeView()"
          [isTeamRestricted]="userRole() === 'team' || userRole() === 'member'"
          [isCollapsed]="isCollapsed()"
          [isOpenMobile]="isOpenMobile()"
          [whatsappUrl]="whatsappUrl()"
          (closeMobile)="closeMobile.emit()"
          (openReportModal)="openReportModal.emit()"
          (openNotesModal)="openNotesModal.emit()"
        />

        @if (activeView() !== 'superadmin' && activeView() !== 'audit') {
          <app-sidebar-reminders-card
            [isCollapsed]="isCollapsed()"
            (openNotesModal)="openNotesModal.emit()"
          />
        }
      </div>

      <app-sidebar-user-profile-card
        [activeTeam]="activeTeam()"
        [isCollapsed]="isCollapsed()"
        [isAdminPreview]="isAdminPreview()"
        (loggedOut)="logout.emit()"
      />
    </aside>
  `,
})
export class PlanSidebarComponent {
  readonly allPlans = input.required<Record<string, PhasePlan>>();
  readonly activePhaseId = input.required<PhaseType>();
  readonly metrics = input.required<PlanMetrics>();
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly activeView = input.required<'plans' | 'general' | 'superadmin' | 'security' | 'audit'>();
  readonly isCollapsed = input.required<boolean>();
  readonly isOpenMobile = input.required<boolean>();
  readonly userRole = input<UserRole>('admin');
  readonly isAdminPreview = input<boolean>(false);
  readonly whatsappUrl = input<string | null | undefined>(null);

  readonly selectPhase = output<PhaseType>();
  readonly openReportModal = output<void>();
  readonly openNotesModal = output<void>();
  readonly changeView = output<'plans' | 'general' | 'superadmin' | 'security' | 'audit'>();
  readonly toggleCollapse = output<void>();
  readonly closeMobile = output<void>();
  readonly logout = output<void>();
  readonly backToAdmin = output<void>();
}
