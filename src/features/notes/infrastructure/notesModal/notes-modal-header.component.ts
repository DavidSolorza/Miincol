import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';

@Component({
  selector: 'app-notes-modal-header',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-white relative">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#8B251E]/10 flex items-center justify-center text-[#8B251E] shrink-0">
          <app-icon name="notebook-pen" className="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base sm:text-lg font-extrabold text-stone-900 font-['Outfit']">
              Notas &amp; Agenda Territorial
            </h2>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
              {{ totalNotes() }} {{ totalNotes() === 1 ? 'nota' : 'notas' }}
            </span>
          </div>
          <p class="text-xs text-stone-500 font-medium">
            Ideas de actividades, motivos de oración y apuntes para <strong class="text-stone-800">{{ activeTeam().name }}</strong>
          </p>
        </div>
      </div>

      <button
        type="button"
        (click)="closed.emit()"
        class="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
        title="Cerrar modal"
      >
        <app-icon name="x" className="w-5 h-5" />
      </button>
    </div>
  `,
})
export class NotesModalHeaderComponent {
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly totalNotes = input.required<number>();
  readonly closed = output<void>();
}

