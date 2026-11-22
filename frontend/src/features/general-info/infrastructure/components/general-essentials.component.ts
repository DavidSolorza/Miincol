import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

const CATALOG_STAGES = [
  'Contacto',
  'Comunicar / Evangelismo',
  'Respuesta',
  'Congregarse / Reunirse',
  'Consolidar / Discipulado',
  'Liderazgo',
  'Desarrollo Eclesial',
];

@Component({
  selector: 'app-general-essentials',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-3 font-['Outfit'] text-left select-none">
      <div class="flex items-center justify-between border-b border-stone-100 pb-2.5">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold">
            <app-icon name="target" className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 class="text-xs sm:text-sm font-black text-stone-900 tracking-tight">Etapas a Desarrollar</h3>
            <p class="text-[10.5px] text-stone-500">Etapas estratégicas clave priorizadas para esta misión</p>
          </div>
        </div>

        @if (canEdit()) {
          <button
            type="button"
            (click)="isEditing.set(!isEditing())"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
            [class]="isEditing() ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'"
          >
            <app-icon [name]="isEditing() ? 'check' : 'pencil'" className="w-3.5 h-3.5" />
            <span>{{ isEditing() ? 'Listo' : 'Editar' }}</span>
          </button>
        }
      </div>

      <!-- Lista activa de etapas -->
      <div class="flex flex-wrap gap-2 pt-1">
        @for (item of essentials(); track item; let idx = $index) {
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-xs shadow-2xs">
            <span class="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] flex items-center justify-center font-black">{{ idx + 1 }}</span>
            <span>{{ item }}</span>
            @if (isEditing()) {
              <button type="button" (click)="removeItem(item)" class="text-amber-800 hover:text-rose-600 cursor-pointer ml-0.5">
                <app-icon name="x" className="w-3 h-3" />
              </button>
            }
          </div>
        }
        @if (essentials().length === 0) {
          <span class="text-xs text-stone-400 italic">No se han definido etapas aún.</span>
        }
      </div>

      <!-- Catálogo de selección rápida cuando está en modo edición -->
      @if (isEditing()) {
        <div class="mt-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5 animate-fadeIn">
          <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Agregar etapa del catálogo:</span>
          <div class="flex flex-wrap gap-1.5">
            @for (cat of catalog; track cat) {
              <button
                type="button"
                [disabled]="essentials().includes(cat)"
                (click)="addItem(cat)"
                class="px-2 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer"
                [class]="essentials().includes(cat) ? 'bg-stone-200 text-stone-400 border-stone-200 cursor-not-allowed' : 'bg-white text-stone-800 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50'"
              >
                + {{ cat }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class GeneralEssentialsComponent {
  readonly essentials = input.required<string[]>();
  readonly canEdit = input<boolean>(false);
  readonly essentialsChanged = output<string[]>();

  readonly isEditing = signal(false);
  readonly catalog = CATALOG_STAGES;

  addItem(item: string): void {
    if (this.essentials().includes(item)) return;
    this.essentialsChanged.emit([...this.essentials(), item]);
  }

  removeItem(item: string): void {
    this.essentialsChanged.emit(this.essentials().filter((e) => e !== item));
  }
}

