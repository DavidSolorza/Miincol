import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { type NoteCategory, NOTE_CATEGORIES } from '../../domain/notes.types';

export interface NoteDraftPayload {
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
}

@Component({
  selector: 'app-note-editor-form',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="handleSubmit($event)" class="p-3.5 sm:p-4 rounded-xl bg-stone-50/80 border border-stone-200/90 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-stone-800">Nueva Nota / Idea de Campo</span>
        <label class="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
          <input
            type="checkbox"
            [checked]="isPinned()"
            (change)="onPinChange($event)"
            class="w-3.5 h-3.5 rounded text-[#8B251E] focus:ring-[#8B251E]"
          />
          <span class="text-[11px] font-semibold">Fijar al inicio</span>
        </label>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Título o asunto de la idea..."
          [value]="title()"
          (input)="onTitleInput($event)"
          required
          class="sm:col-span-2 px-3 py-1.5 rounded-lg text-xs border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
        />

        <select
          [value]="category()"
          (change)="onCategoryChange($event)"
          class="px-2.5 py-1.5 rounded-lg text-xs border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 font-medium cursor-pointer"
        >
          @for (cat of categoryKeys; track cat) {
            <option [value]="cat">{{ categories[cat].label }}</option>
          }
        </select>
      </div>

      <textarea
        placeholder="Escribe aquí los detalles de la idea, apunte de reunión o motivo de oración..."
        [value]="content()"
        (input)="onContentInput($event)"
        rows="2"
        required
        class="w-full px-3 py-2 rounded-lg text-xs border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-300 resize-none"
      ></textarea>

      <div class="flex justify-end">
        <button
          type="submit"
          class="px-3.5 py-1.5 rounded-lg bg-[#8B251E] hover:bg-[#731E18] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
        >
          <app-icon name="plus-circle" className="w-3.5 h-3.5" />
          <span>Guardar Nota</span>
        </button>
      </div>
    </form>
  `,
})
export class NoteEditorFormComponent {
  readonly noteAdded = output<NoteDraftPayload>();

  readonly categories = NOTE_CATEGORIES;
  readonly categoryKeys = Object.keys(NOTE_CATEGORIES) as NoteCategory[];

  readonly title = signal('');
  readonly content = signal('');
  readonly category = signal<NoteCategory>('idea');
  readonly isPinned = signal(false);

  onTitleInput(event: Event): void {
    this.title.set((event.target as HTMLInputElement).value);
  }

  onContentInput(event: Event): void {
    this.content.set((event.target as HTMLTextAreaElement).value);
  }

  onCategoryChange(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value as NoteCategory);
  }

  onPinChange(event: Event): void {
    this.isPinned.set((event.target as HTMLInputElement).checked);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.title().trim() || !this.content().trim()) return;
    this.noteAdded.emit({
      title: this.title(),
      content: this.content(),
      category: this.category(),
      isPinned: this.isPinned(),
    });
    this.title.set('');
    this.content.set('');
    this.isPinned.set(false);
  }
}

