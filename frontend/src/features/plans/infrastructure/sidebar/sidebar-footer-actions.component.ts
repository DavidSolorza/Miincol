import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-sidebar-footer-actions',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (activeView() !== 'superadmin') {
      @if (isCollapsed()) {
        <div class="space-y-1.5 pt-1 flex flex-col items-center">
          <button
            type="button"
            (click)="handleOpenNotes()"
            class="w-9 h-9 rounded-xl bg-white border border-orange-200 text-[#8B251E] hover:bg-orange-50 flex items-center justify-center shadow-xs transition cursor-pointer"
            title="Notas y Agenda"
          >
            <app-icon name="notebook-pen" className="w-5 h-5 text-[#8B251E]" />
          </button>
          <button
            type="button"
            (click)="handleOpenReport()"
            class="w-9 h-9 rounded-xl bg-white border border-orange-200 text-[#8B251E] hover:bg-orange-50 flex items-center justify-center shadow-xs transition cursor-pointer"
            title="Informe PDM"
          >
            <app-icon name="file-bar-chart" className="w-5 h-5 text-[#8B251E]" />
          </button>
        </div>
      } @else {
        <div class="space-y-1.5 pt-0.5 select-none">
          <button
            type="button"
            (click)="handleOpenNotes()"
            class="w-full py-1.5 px-3 rounded-xl bg-white/90 hover:bg-stone-50 border border-stone-200/80 hover:border-stone-300 text-stone-700 hover:text-stone-900 shadow-2xs transition-all duration-200 ease-out flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] group"
            title="Notas y Agenda Territorial"
          >
            <app-icon name="notebook-pen" className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-800 transition-colors shrink-0" />
            <span class="font-semibold text-xs text-stone-700 group-hover:text-stone-900 transition-colors">
              Notas y Agenda
            </span>
          </button>

          <button
            type="button"
            (click)="handleOpenReport()"
            class="w-full py-1.5 px-3 rounded-xl bg-white/90 hover:bg-stone-50 border border-stone-200/80 hover:border-stone-300 text-stone-700 hover:text-stone-900 shadow-2xs transition-all duration-200 ease-out flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] group"
            title="Generar Informe Ejecutivo PDM"
          >
            <app-icon name="file-bar-chart" className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-800 transition-colors shrink-0" />
            <span class="font-semibold text-xs text-stone-700 group-hover:text-stone-900 transition-colors">
              Informe PDM
            </span>
          </button>
        </div>
      }
    }
  `,
})
// Botones de acción en la barra lateral para abrir notas e informe ejecutivo
export class SidebarFooterActionsComponent {
  readonly activeView = input.required<'plans' | 'general' | 'superadmin'>();
  readonly isTeamRestricted = input.required<boolean>();
  readonly isCollapsed = input.required<boolean>();
  readonly isOpenMobile = input.required<boolean>();
  readonly whatsappUrl = input<string | null | undefined>(null);

  readonly closeMobile = output<void>();
  readonly openReportModal = output<void>();
  readonly openNotesModal = output<void>();

  handleOpenNotes(): void {
    this.openNotesModal.emit();
    if (this.isOpenMobile()) this.closeMobile.emit();
  }

  handleOpenReport(): void {
    this.openReportModal.emit();
    if (this.isOpenMobile()) this.closeMobile.emit();
  }
}
