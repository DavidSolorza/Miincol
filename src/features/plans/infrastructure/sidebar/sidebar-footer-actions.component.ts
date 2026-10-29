import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-sidebar-footer-actions',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (activeView() === 'plans' || isTeamRestricted()) {
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
          @if (whatsappUrl()) {
            <a
              [href]="whatsappUrl()!"
              target="_blank"
              rel="noreferrer"
              class="w-9 h-9 rounded-xl bg-white border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-xs hover:bg-emerald-50 transition"
              title="Contacto Líder"
            >
              <app-icon name="message-circle" className="w-5 h-5 text-emerald-600" />
            </a>
          }
        </div>
      } @else {
        <div class="space-y-1.5 pt-0.5 select-none">
          <button
            type="button"
            (click)="handleOpenNotes()"
            class="w-full py-1.5 px-3 rounded-xl bg-white/95 hover:bg-orange-50/50 border border-stone-200/90 hover:border-orange-300 text-stone-800 hover:text-[#8B251E] shadow-2xs transition-all duration-200 ease-out flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] group"
            title="Notas y Agenda Territorial"
          >
            <app-icon name="notebook-pen" className="w-3.5 h-3.5 text-[#8B251E] group-hover:text-[#E67324] transition-colors shrink-0" />
            <span class="font-semibold text-xs text-stone-800 group-hover:text-[#8B251E] transition-colors">
              Notas y Agenda
            </span>
          </button>

          <button
            type="button"
            (click)="handleOpenReport()"
            class="w-full py-1.5 px-3 rounded-xl bg-white/95 hover:bg-orange-50/50 border border-stone-200/90 hover:border-orange-300 text-stone-800 hover:text-[#8B251E] shadow-2xs transition-all duration-200 ease-out flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] group"
            title="Generar Informe Ejecutivo PDM"
          >
            <app-icon name="file-bar-chart" className="w-3.5 h-3.5 text-[#8B251E] group-hover:text-[#E67324] transition-colors shrink-0" />
            <span class="font-semibold text-xs text-stone-800 group-hover:text-[#8B251E] transition-colors">
              Informe PDM
            </span>
          </button>

          @if (whatsappUrl()) {
            <a
              [href]="whatsappUrl()!"
              target="_blank"
              rel="noreferrer"
              class="w-full py-1.5 px-3 rounded-xl bg-white/95 border border-emerald-500/80 hover:border-emerald-600 text-emerald-700 hover:bg-emerald-50/50 font-semibold text-xs transition-all duration-200 ease-out flex items-center justify-center gap-1.5 shadow-2xs font-['Outfit']"
              title="Contactar al Líder por WhatsApp"
            >
              <app-icon name="message-circle" className="w-3.5 h-3.5 text-emerald-500" />
              <span>Contacto Líder</span>
            </a>
          } @else {
            <button
              type="button"
              disabled
              class="w-full py-1.5 px-3 rounded-xl bg-white/70 border border-emerald-400/40 text-emerald-600/60 font-semibold text-xs flex items-center justify-center gap-1.5 font-['Outfit'] cursor-not-allowed opacity-75"
              title="Sin teléfono de WhatsApp configurado"
            >
              <app-icon name="message-circle" className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contacto Líder</span>
            </button>
          }
        </div>
      }
    }
  `,
})
// Botones de acción en la barra lateral para abrir notas, informe ejecutivo y contacto por WhatsApp
export class SidebarFooterActionsComponent {
  readonly activeView = input.required<'plans' | 'superadmin'>(); // Vista activa actual
  readonly isTeamRestricted = input.required<boolean>(); // Indica si el usuario tiene rol restringido a su equipo
  readonly isCollapsed = input.required<boolean>(); // Indica si la barra lateral está contraída
  readonly isOpenMobile = input.required<boolean>(); // Indica si el menú móvil está abierto
  readonly whatsappUrl = input<string | null | undefined>(null); // URL de WhatsApp para contactar al líder

  readonly closeMobile = output<void>(); // Cierra el menú lateral móvil tras ejecutar una acción
  readonly openReportModal = output<void>(); // Emite para abrir el modal de informe PDM
  readonly openNotesModal = output<void>(); // Emite para abrir el modal de notas y agenda

  // Abre el modal de notas y cierra el menú móvil si estaba abierto
  handleOpenNotes(): void {
    this.openNotesModal.emit();
    if (this.isOpenMobile()) this.closeMobile.emit();
  }

  // Abre el modal de informe ejecutivo y cierra el menú móvil si estaba abierto
  handleOpenReport(): void {
    this.openReportModal.emit();
    if (this.isOpenMobile()) this.closeMobile.emit();
  }
}

