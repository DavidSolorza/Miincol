import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import type { GeneralTeamData, TeamMemberContact } from '../../domain/general-info.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-general-team-footer',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-4 font-['Outfit'] select-none text-left">
      <!-- Encabezado de sección -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-stone-900 text-[#E67324] flex items-center justify-center font-bold">
            <app-icon name="users" className="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-black text-stone-900">Información de Campo &amp; Equipo Misionero</h3>
            <p class="text-[11px] text-stone-500">Datos territoriales de la misión, liderazgo y obreros asignados</p>
          </div>
        </div>

        @if (canEdit()) {
          <button
            type="button"
            (click)="isEditingField.set(!isEditingField())"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs self-end sm:self-center"
            [class]="isEditingField() ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'"
          >
            <app-icon [name]="isEditingField() ? 'check' : 'pencil'" className="w-3.5 h-3.5" />
            <span>{{ isEditingField() ? 'Guardar Datos' : 'Editar Datos de Campo' }}</span>
          </button>
        }
      </div>

      <!-- Cuadrícula de Datos de Campo -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div class="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Territorio / Lugar</span>
          @if (isEditingField()) {
            <input type="text" [value]="teamData().territory" (change)="onFieldChange('territory', $event)" class="w-full bg-white font-bold p-1 rounded-lg border border-stone-200 mt-1" />
          } @else {
            <span class="font-extrabold text-stone-800 text-xs sm:text-sm block mt-0.5 truncate">{{ teamData().territory }}</span>
          }
        </div>

        <div class="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Población Étnica</span>
          @if (isEditingField()) {
            <input type="text" [value]="teamData().population" (change)="onFieldChange('population', $event)" class="w-full bg-white font-bold p-1 rounded-lg border border-stone-200 mt-1" />
          } @else {
            <span class="font-extrabold text-stone-800 text-xs sm:text-sm block mt-0.5 truncate">{{ teamData().population }}</span>
          }
        </div>

        <div class="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Pastor Líder</span>
          @if (isEditingField()) {
            <input type="text" [value]="teamData().teamLeader" (change)="onFieldChange('teamLeader', $event)" class="w-full bg-white font-bold p-1 rounded-lg border border-stone-200 mt-1" />
          } @else {
            <span class="font-extrabold text-stone-800 text-xs sm:text-sm block mt-0.5 truncate">{{ teamData().teamLeader }}</span>
          }
        </div>

        <div class="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Contacto WhatsApp</span>
          @if (isEditingField()) {
            <input type="text" [value]="teamData().leaderPhone || '+57 312 450 1234'" (change)="onFieldChange('leaderPhone', $event)" class="w-full bg-white font-bold p-1 rounded-lg border border-stone-200 mt-1" />
          } @else {
            <span class="font-extrabold text-emerald-800 text-xs sm:text-sm block mt-0.5 truncate font-mono">{{ teamData().leaderPhone || '+57 312 450 1234' }}</span>
          }
        </div>
      </div>

      <!-- Lista de Integrantes del Equipo -->
      <div class="space-y-2 pt-2">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-black text-stone-800 uppercase tracking-wide">
            Integrantes de la Misión ({{ teamData().members.length }})
          </h4>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          @for (member of teamData().members; track member.id) {
            <div class="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2 shadow-2xs">
              <div class="min-w-0">
                <div class="font-bold text-stone-900 text-xs truncate">{{ member.name }}</div>
                <div class="text-[10.5px] text-stone-500 truncate">{{ member.role }}</div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button type="button" (click)="assignTask.emit(member.name)" class="p-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-[#E67324] text-[10.5px] font-bold transition cursor-pointer" title="Asignar tarea en PDM">
                  <app-icon name="plus-circle" className="w-3.5 h-3.5 text-[#E67324]" />
                </button>
                @if (canEdit()) {
                  <button type="button" (click)="removeMember.emit(member.id)" class="p-1 rounded-lg text-stone-400 hover:text-rose-600 transition cursor-pointer" title="Remover integrante">
                    <app-icon name="trash-2" className="w-3 h-3" />
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class GeneralTeamFooterComponent {
  readonly teamData = input.required<GeneralTeamData>();
  readonly canEdit = input<boolean>(false);

  readonly updateTeamData = output<Partial<GeneralTeamData>>();
  readonly removeMember = output<string>();
  readonly assignTask = output<string>();

  readonly isEditingField = signal(false);

  onFieldChange(field: keyof GeneralTeamData, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.updateTeamData.emit({ [field]: val });
  }
}

