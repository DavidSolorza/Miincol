import { Component, ChangeDetectionStrategy, input, output, inject, computed } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { AppSessionService } from '../../../../app/auth/app-session.service';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';

@Component({
  selector: 'app-sidebar-user-profile-card',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isCollapsed()) {
      <div class="p-2 flex justify-center">
        @if (isAdminPreview()) {
          <div class="w-9 h-9 rounded-xl bg-white text-stone-700 border border-stone-200/80 flex items-center justify-center shadow-2xs select-none" [title]="displayName()">
            <app-icon name="users" className="w-4 h-4 text-stone-700" />
          </div>
        } @else {
          <button
            type="button"
            (click)="handleLogoutClick()"
            [title]="displayName() + ' • Click para cerrar sesión'"
            class="w-9 h-9 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
          >
            <app-icon name="users" className="w-4 h-4 text-stone-700" />
          </button>
        }
      </div>
    } @else {
      <div class="p-2 pt-1 select-none">
        <div
          class="rounded-2xl py-2 px-2.5 flex items-center justify-between bg-white/95 hover:bg-white border border-stone-200/80 text-stone-900 shadow-2xs transition-all duration-200 ease-out group"
        >
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <div class="w-7 h-7 rounded-full bg-stone-100 text-stone-700 border border-stone-200/70 flex items-center justify-center shrink-0">
              <app-icon name="users" className="w-3.5 h-3.5 text-stone-700" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[11px] font-bold truncate leading-tight font-['Outfit'] text-stone-900">
                {{ displayName() }}
              </p>
              <p class="text-[9.5px] text-stone-500 font-medium truncate leading-tight font-['Outfit']">
                {{ subtitle() }}
              </p>
            </div>
          </div>

          @if (!isAdminPreview()) {
            <button
              type="button"
              (click)="handleLogoutClick()"
              title="Cerrar sesión"
              class="text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors duration-200 cursor-pointer shrink-0"
            >
              <app-icon name="log-out" className="w-3.5 h-3.5" />
            </button>
          } @else {
            <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/80 font-['Outfit'] shrink-0 select-none">
              Supervisión
            </span>
          }
        </div>
      </div>
    }
  `,
})
export class SidebarUserProfileCardComponent {
  private readonly toastService = inject(ToastService);
  private readonly sessionSvc = inject(AppSessionService);

  readonly activeTeam = input.required<MissionaryTeam>();
  readonly isCollapsed = input.required<boolean>();
  readonly isAdminPreview = input<boolean>(false);
  readonly loggedOut = output<void>();

  readonly displayName = computed(() => {
    const s = this.sessionSvc.session();
    return s?.role === 'member' ? s.userName : this.activeTeam().leader;
  });

  readonly subtitle = computed(() => {
    const s = this.sessionSvc.session();
    if (s?.role === 'member') {
      return `${this.activeTeam().ethnicity || this.activeTeam().name} • Equipo`;
    }
    return this.activeTeam().ethnicity || this.activeTeam().name;
  });

  handleLogoutClick(): void {
    this.toastService.confirmAction({
      title: '¿Cerrar Sesión Territorial?',
      message: `¿Estás seguro de que deseas salir de la sesión de ${this.displayName()}?`,
      confirmLabel: 'Sí, Salir',
      cancelLabel: 'Cancelar',
      type: 'warning',
      onConfirm: () => this.loggedOut.emit(),
    });
  }
}

