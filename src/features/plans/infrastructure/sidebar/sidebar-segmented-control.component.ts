import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-sidebar-segmented-control',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isCollapsed()) {
      <div class="px-2 py-1 flex justify-center">
        <button
          type="button"
          (click)="viewChanged.emit('general')"
          title="Informacion General"
          class="w-8 h-5 rounded-full bg-black/15 hover:bg-black/25 p-0.5 flex items-center transition cursor-pointer"
        >
          <span class="w-4 h-4 rounded-full bg-white shadow-xs"></span>
        </button>
      </div>
    } @else {
      <div class="px-2.5 py-1">
        <button
          type="button"
          (click)="viewChanged.emit('general')"
          class="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 ease-out cursor-pointer select-none overflow-hidden"
          style="background: linear-gradient(90deg, #FDF0E8 0%, #F18A38 60%, #B83A05 100%)"
          title="Informacion General de la Mision"
        >
          <app-icon name="file-text" className="w-3.5 h-3.5 shrink-0 text-stone-900" />
          <span class="font-bold text-[10px] uppercase tracking-wider text-stone-950 font-['Outfit'] truncate">
            INFORMACION GENERAL
          </span>
        </button>
      </div>
    }
  `,
})
// Boton en la barra lateral para acceder a la vista de Informacion General Macro
export class SidebarSegmentedControlComponent {
  readonly isCollapsed = input.required<boolean>();
  readonly viewChanged = output<'plans' | 'general' | 'superadmin'>();
}
