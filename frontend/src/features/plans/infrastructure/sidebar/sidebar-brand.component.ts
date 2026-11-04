import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-sidebar-brand',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-2.5 pt-2 pb-0.5 flex flex-col gap-1">
      @if (isCollapsed()) {
        <div class="flex flex-col items-center gap-1.5 py-0.5">
          <button
            type="button"
            (click)="toggleCollapse.emit()"
            class="hidden lg:flex p-1 rounded-lg text-stone-600 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200/60 transition cursor-pointer shadow-2xs"
            title="Expandir panel"
          >
            <app-icon name="chevron-right" className="w-3.5 h-3.5" />
          </button>
          <div class="w-7 h-7 rounded-lg bg-white/90 border border-stone-200/80 shadow-2xs flex items-center justify-center select-none" title="MISINCOL">
            <span class="font-['Outfit'] font-black text-xs text-[#8B251E] leading-none">
              M<span class="text-[#EA7C25]">.</span>
            </span>
          </div>
        </div>
      } @else {
        <div class="flex items-center justify-between lg:justify-center relative px-1.5 py-1">
          <div class="flex items-center justify-center min-w-0">
            <img
              src="/img/misincol.png"
              alt="MISINCOL"
              class="h-7 sm:h-8 w-auto max-w-[140px] object-contain"
            />
          </div>

          <button
            type="button"
            (click)="closeMobile.emit()"
            class="p-1 rounded-lg text-stone-600 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200/60 lg:hidden cursor-pointer shadow-2xs shrink-0"
            aria-label="Cerrar menú móvil"
          >
            <app-icon name="x" className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    </div>
  `,
})
// Cabecera de marca del menú lateral con logotipo y botones de colapso o cierre móvil
export class SidebarBrandComponent {
  readonly isCollapsed = input.required<boolean>(); // Indica si la barra lateral está contraída
  readonly toggleCollapse = output<void>(); // Emite para expandir el panel lateral en escritorio
  readonly closeMobile = output<void>(); // Emite para cerrar el menú lateral en versión móvil
}

