import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect } from '@angular/core';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import type { MissionaryTeam } from '../../auth/domain/auth.types';
import type { TeamNote, NoteCategory } from '../domain/notes.types';
import { getInitialTeamNotes } from '../application/initialTeamNotes';
import { appendAuditLog } from '../../audit/application/auditStorage';
import { serviceBus } from '../../../core/bus';
import { NotesModalHeaderComponent } from './notesModal/notes-modal-header.component';
import { NoteEditorFormComponent, type NoteDraftPayload } from './notesModal/note-editor-form.component';
import { NotesFilterTabsComponent } from './notesModal/notes-filter-tabs.component';
import { NoteItemCardComponent } from './notesModal/note-item-card.component';

@Component({
  selector: 'app-team-notes-modal',
  standalone: true,
  imports: [
    AppIconComponent,
    NotesModalHeaderComponent,
    NoteEditorFormComponent,
    NotesFilterTabsComponent,
    NoteItemCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-2xs animate-fadeIn selection:bg-[#E67324]/20 selection:text-[#8B251E]">
        <div
          class="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
          (click)="$event.stopPropagation()"
        >
          <app-notes-modal-header [activeTeam]="activeTeam()" [totalNotes]="notes().length" (closed)="closed.emit()" />

          <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
            <app-note-editor-form (noteAdded)="addNote($event)" />
            <app-notes-filter-tabs
              [selectedCategory]="selectedCategory()"
              [searchTerm]="searchTerm()"
              (categorySelected)="selectedCategory.set($event)"
              (searchChanged)="searchTerm.set($event)"
            />

            @if (filteredNotes().length === 0) {
              <div class="p-8 text-center rounded-xl bg-stone-50 border border-dashed border-stone-200 space-y-2">
                <app-icon name="notebook-pen" className="w-8 h-8 text-stone-300 mx-auto" />
                <p class="text-xs font-bold text-stone-600">No se encontraron notas con este criterio</p>
                <p class="text-[11px] text-stone-400">Usa el formulario superior para registrar una nueva idea de actividad o motivo de oración.</p>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (note of filteredNotes(); track note.id) {
                  <app-note-item-card [note]="note" (togglePin)="togglePin($event)" (deleted)="deleteNote($event)" />
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
// Modal de agenda territorial para gestionar notas, ideas y motivos de oración por equipo
export class TeamNotesModalComponent {
  // Entradas de visibilidad y equipo activo; salida para cerrar el modal
  readonly isOpen = input.required<boolean>();
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly closed = output<void>();

  // Signals para la lista de notas, categoría seleccionada y término de búsqueda
  readonly notes = signal<TeamNote[]>([]);
  readonly selectedCategory = signal<NoteCategory | 'all'>('all');
  readonly searchTerm = signal('');

  // Signal computado que filtra notas por categoría/texto y prioriza las fijadas (pinned)
  readonly filteredNotes = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchTerm().toLowerCase();
    return this.notes()
      .filter((n) => (cat === 'all' || n.category === cat) && (n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)))
      .sort((a, b) => (a.isPinned !== b.isPinned ? (a.isPinned ? -1 : 1) : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  // Efecto reactivo que carga las notas del equipo activo desde localStorage o usa semillas
  constructor() {
    effect(() => {
      const team = this.activeTeam();
      const key = `misincol_team_notes_${team.id}`;
      try {
        const saved = localStorage.getItem(key);
        this.notes.set(saved ? JSON.parse(saved) : getInitialTeamNotes(team.id, team.name, team.leader));
      } catch {
        this.notes.set(getInitialTeamNotes(team.id, team.name, team.leader));
      }
    });
  }

  // Actualiza el signal de notas y persiste los cambios en localStorage
  private saveNotes(updated: TeamNote[]): void {
    this.notes.set(updated);
    try { localStorage.setItem(`misincol_team_notes_${this.activeTeam().id}`, JSON.stringify(updated)); } catch { /* ignore */ }
  }

  // Crea una nueva nota, la guarda y publica eventos de auditoría y notificación
  addNote(draft: NoteDraftPayload): void {
    const team = this.activeTeam();
    const author = team.leader || 'Misionero';
    const newNote: TeamNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      teamId: team.id, title: draft.title.trim(), content: draft.content.trim(),
      category: draft.category, isPinned: draft.isPinned, author,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    this.saveNotes([newNote, ...this.notes()]);
    const logPayload = {
      teamId: team.id, userName: author, actionType: 'note_add' as const,
      title: 'Nota en agenda territorial', detail: `Agregó: "${draft.title.trim().slice(0, 30)}" (${draft.category})`,
    };
    appendAuditLog(team.id, logPayload, author);
    serviceBus.publish('audit:log', logPayload);
    serviceBus.publish('ui:toast', { message: 'Nota agregada a la agenda territorial', type: 'success' });
  }

  // Alterna el estado de fijación (pin) de una nota específica
  togglePin(id: string): void { this.saveNotes(this.notes().map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))); }
  // Elimina una nota de la agenda y muestra confirmación visual
  deleteNote(id: string): void { this.saveNotes(this.notes().filter((n) => n.id !== id)); serviceBus.publish('ui:toast', { message: 'Nota eliminada', type: 'info' }); }
}
