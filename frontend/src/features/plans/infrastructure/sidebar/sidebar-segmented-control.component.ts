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
          title="Información General"
          class="w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#E67324] flex items-center justify-center transition cursor-pointer shadow-2xs"
        >
          <app-icon name="file-text" className="w-4 h-4" />
        </button>
      </div>
    } @else {
      <div class="px-2.5 py-1">
        <button
          type="button"
          (click)="viewChanged.emit('general')"
          class="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 shadow-2xs hover:shadow-xs transition-all duration-200 ease-out cursor-pointer select-none border border-stone-800/80"
          title="Información General de la Misión"
        >
          <app-icon name="file-text" className="w-3.5 h-3.5 shrink-0 text-[#E67324]" />
          <span class="font-bold text-[10.5px] uppercase tracking-wider text-stone-100 font-['Outfit'] truncate">
            Información General
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

