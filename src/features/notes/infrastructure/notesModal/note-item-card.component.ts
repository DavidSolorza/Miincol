import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { type TeamNote, NOTE_CATEGORIES } from '../../domain/notes.types';

@Component({
  selector: 'app-note-item-card',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="
        'p-3.5 sm:p-4 rounded-xl border transition-all duration-200 bg-white relative flex flex-col justify-between space-y-2.5 ' +
        (note().isPinned
          ? 'border-amber-300 shadow-sm ring-1 ring-amber-300/40'
          : 'border-stone-200/80 hover:border-stone-300 shadow-2xs')
      "
    >
      <div class="space-y-1.5">
        <div class="flex items-center justify-between gap-2">
          <span [class]="'px-2 py-0.5 rounded-md text-[10px] font-bold border ' + cat().bgClass + ' ' + cat().textClass + ' ' + cat().borderClass">
            {{ cat().label }}
          </span>

          <div class="flex items-center gap-1">
            <button
              type="button"
              (click)="togglePin.emit(note().id)"
              [class]="
                'p-1.5 rounded-lg transition cursor-pointer ' +
                (note().isPinned
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-stone-300 hover:text-stone-600 hover:bg-stone-100')
              "
              [title]="note().isPinned ? 'Desfijar nota' : 'Fijar nota arriba'"
            >
              <app-icon name="pin" [className]="'w-3.5 h-3.5 ' + (note().isPinned ? 'fill-amber-600' : '')" />
            </button>

            <button
              type="button"
              (click)="deleted.emit(note().id)"
              class="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Eliminar nota"
            >
              <app-icon name="trash-2" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h4 class="text-sm font-bold text-stone-900 leading-snug">{{ note().title }}</h4>
        <p class="text-xs text-stone-600 leading-relaxed whitespace-pre-wrap">{{ note().content }}</p>
      </div>

      <div class="flex items-center justify-between text-[10px] text-stone-400 pt-2 border-t border-stone-100 font-medium">
        <span class="flex items-center gap-1">
          <app-icon name="user" className="w-3 h-3 text-stone-400" />
          <span>{{ note().author }}</span>
        </span>
        <span class="flex items-center gap-1">
          <app-icon name="clock" className="w-3 h-3 text-stone-400" />
          <span>{{ formattedDate() }}</span>
        </span>
      </div>
    </div>
  `,
})
export class NoteItemCardComponent {
  readonly note = input.required<TeamNote>();
  readonly togglePin = output<string>();
  readonly deleted = output<string>();

  readonly cat = computed(() => NOTE_CATEGORIES[this.note().category] || NOTE_CATEGORIES.general);
  readonly formattedDate = computed(() =>
    new Date(this.note().createdAt).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  );
}

