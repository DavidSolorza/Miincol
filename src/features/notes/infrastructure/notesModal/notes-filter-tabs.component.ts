import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { type NoteCategory, NOTE_CATEGORIES } from '../../domain/notes.types';

@Component({
  selector: 'app-notes-filter-tabs',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2.5 pb-2">
      <div class="relative">
        <app-icon name="search" className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar notas, ideas o peticiones de oración..."
          [value]="searchTerm()"
          (input)="onSearchInput($event)"
          class="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 transition"
        />
      </div>

      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          (click)="categorySelected.emit('all')"
          [class]="
            'px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer whitespace-nowrap border ' +
            (selectedCategory() === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50')
          "
        >
          Todas
        </button>

        @for (cat of categoryKeys; track cat) {
          <button
            type="button"
            (click)="categorySelected.emit(cat)"
            [class]="
              'px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ' +
              (selectedCategory() === cat
                ? 'bg-[#8B251E] text-white border-[#8B251E] shadow-2xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50')
            "
          >
            <span>{{ categories[cat].label }}</span>
          </button>
        }
      </div>
    </div>
  `,
})
// Barra de búsqueda y pestañas de filtrado por categoría para las notas del equipo
export class NotesFilterTabsComponent {
  // Entradas con categoría activa y búsqueda; salidas para notificar cambios de filtro
  readonly selectedCategory = input.required<NoteCategory | 'all'>();
  readonly searchTerm = input.required<string>();
  readonly categorySelected = output<NoteCategory | 'all'>();
  readonly searchChanged = output<string>();

  readonly categories = NOTE_CATEGORIES;
  readonly categoryKeys = Object.keys(NOTE_CATEGORIES) as NoteCategory[];

  // Emite el nuevo texto de búsqueda al escribir en el campo
  onSearchInput(event: Event): void {
    this.searchChanged.emit((event.target as HTMLInputElement).value);
  }
}

