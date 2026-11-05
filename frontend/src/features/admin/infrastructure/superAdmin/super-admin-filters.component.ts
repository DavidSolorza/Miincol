// Barra de búsqueda rápida por texto (etnia, misión, líder o departamento) en Supervisión Nacional
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-super-admin-filters',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full">
      <app-icon name="search" className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        [value]="searchTerm"
        (input)="searchTermChange.emit($any($event.target).value)"
        placeholder="Search por etnia, misión o departamento..."
        class="w-full pl-11 pr-10 py-2.5 text-xs sm:text-[13px] rounded-2xl bg-white border border-stone-200/90 shadow-2xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-[#8B251E] focus:ring-2 focus:ring-[#8B251E]/10 transition"
      />
      @if (searchTerm) {
        <button
          type="button"
          (click)="searchTermChange.emit('')"
          class="p-1 rounded-full text-stone-400 hover:text-stone-700 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition"
          title="Limpiar búsqueda"
        >
          <app-icon name="x" className="w-3.5 h-3.5" />
        </button>
      }
    </div>
  `,
})
export class SuperAdminFiltersComponent {
  @Input() searchTerm = ''; // Término actual de búsqueda
  @Output() searchTermChange = new EventEmitter<string>(); // Emite el texto de búsqueda actualizado o vacío al limpiar
}

