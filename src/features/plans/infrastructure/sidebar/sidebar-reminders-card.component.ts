import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-sidebar-reminders-card',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isCollapsed()) {
      <div class="pt-1 flex flex-col items-center">
        <button
          type="button"
          (click)="openNotesModal.emit()"
          class="w-9 h-9 rounded-xl bg-white border border-orange-200/90 text-[#8B251E] hover:bg-orange-50 flex items-center justify-center shadow-2xs transition-colors duration-200 cursor-pointer relative"
          title="Avisos y Agenda Ministerial"
        >
          <app-icon name="bell-ring" className="w-4 h-4 text-[#E67324]" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B251E] ring-2 ring-white"></span>
        </button>
      </div>
    } @else {
      <div class="rounded-xl p-2.5 bg-white/90 border border-stone-200/80 shadow-2xs backdrop-blur-xs space-y-1.5 select-none">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <app-icon name="bell-ring" className="w-3 h-3 text-[#E67324] shrink-0" />
            <span class="font-['Outfit'] font-bold text-[11px] text-stone-800 tracking-tight">
              Avisos y Agenda
            </span>
          </div>
          <span class="text-[8.5px] font-bold uppercase text-[#8B251E] bg-[#8B251E]/10 px-1.5 py-0.5 rounded-md font-['Outfit']">
            Supervisión
          </span>
        </div>

        <div class="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#EBDDCF]/70 space-y-0.5">
          <div class="flex items-center gap-1">
            <app-icon name="calendar" className="w-2.5 h-2.5 text-[#8B251E] shrink-0" />
            <span class="text-[9.5px] font-bold text-[#8B251E] uppercase font-['Outfit']">
              Jueves • 7:00 PM
            </span>
          </div>
          <p class="text-[10.5px] font-semibold text-stone-800 leading-tight font-['Outfit']">
            Reunión de Enlace Territorial
          </p>
        </div>

        <div class="p-1.5 rounded-lg bg-amber-50/40 border border-amber-200/50 space-y-0.5">
          <div class="flex items-center gap-1">
            <app-icon name="shield-check" className="w-2.5 h-2.5 text-[#E67324] shrink-0" />
            <span class="text-[9px] font-bold text-stone-600 font-['Outfit']">
              Coordinación de Equipos
            </span>
          </div>
          <p class="text-[10px] text-stone-600 leading-snug">
            Completar evidencias del pilar antes del cierre mensual.
          </p>
        </div>

        <button
          type="button"
          (click)="openNotesModal.emit()"
          class="w-full pt-0.5 flex items-center justify-center gap-1 text-[10px] font-bold text-[#8B251E] hover:text-[#E67324] transition-colors duration-200 cursor-pointer font-['Outfit']"
        >
          <span>Abrir notas y agenda</span>
          <app-icon name="arrow-right" className="w-2.5 h-2.5" />
        </button>
      </div>
    }
  `,
})
// Tarjeta de avisos y recordatorios ministeriales ubicada en la barra lateral
export class SidebarRemindersCardComponent {
  readonly isCollapsed = input.required<boolean>(); // Indica si la barra lateral está en modo compacto
  readonly openNotesModal = output<void>(); // Emite para abrir el modal de notas y agenda territorial
}

