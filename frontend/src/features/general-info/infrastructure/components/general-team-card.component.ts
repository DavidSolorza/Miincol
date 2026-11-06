import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { GeneralTeamData } from '../../domain/general-info.types';

@Component({
  selector: 'app-general-team-card',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200/80 text-stone-900 flex items-center justify-center">
            <app-icon name="users" className="w-4 h-4 text-[#E67324]" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-stone-900 font-['Outfit']">Datos de Conformación de Equipo</h3>
            <p class="text-[11px] text-stone-500">Información macro del territorio y liderazgo</p>
          </div>
        </div>
        <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">Año {{ teamData().year }}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <div class="p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/60">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Líder de Equipo</span>
          <span class="font-bold text-stone-800 text-sm mt-0.5 block truncate">{{ teamData().teamLeader }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/60">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Población / Territorio</span>
          <span class="font-bold text-stone-800 text-sm mt-0.5 block truncate">{{ teamData().population }} • {{ teamData().territory }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/60">
          <span class="text-[10px] uppercase font-bold text-stone-400 block">Presencia Evangélica</span>
          <span class="font-bold text-stone-800 text-sm mt-0.5 block truncate">{{ teamData().evangelicalCongregationsCount }} Congregaciones • {{ teamData().evangelicalBelieversCount }} Creyentes</span>
        </div>
      </div>

      <div class="space-y-3 pt-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-stone-700 uppercase tracking-wider font-['Outfit']">
            Integrantes del Equipo ({{ teamData().members.length }})
          </span>
          @if (isAdmin()) {
            <button
              type="button"
              (click)="isAdding.set(!isAdding())"
              class="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-2xs font-['Outfit']"
            >
              <app-icon [name]="isAdding() ? 'x' : 'plus'" className="w-3.5 h-3.5 text-[#E67324]" />
              <span>{{ isAdding() ? 'Cancelar' : 'Agregar Integrante' }}</span>
            </button>
          }
        </div>

        @if (isAdmin() && isAdding()) {
          <div class="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs animate-fadeIn">
            <span class="font-bold text-stone-800 block text-[11px]">Nuevo Integrante de Equipo (Acción de Administrador)</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Nombre completo *"
                [value]="newName()"
                (input)="newName.set($any($event.target).value)"
                class="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
              />
              <input
                type="text"
                placeholder="Rol (ej. Obrero, Evangelista)"
                [value]="newRole()"
                (input)="newRole.set($any($event.target).value)"
                class="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
              />
              <input
                type="text"
                placeholder="Teléfono móvil (WhatsApp)"
                [value]="newPhone()"
                (input)="newPhone.set($any($event.target).value)"
                class="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
              />
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                (click)="handleAddMember()"
                [disabled]="!newName().trim()"
                class="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer"
              >
                Guardar Integrante
              </button>
            </div>
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          @for (m of teamData().members; track m.id) {
            <div class="p-2.5 rounded-xl border border-stone-200/80 bg-white flex items-center justify-between gap-2 shadow-2xs">
              <div class="min-w-0">
                <span class="text-xs font-bold text-stone-900 block truncate">{{ m.name }}</span>
                <span class="text-[10px] text-stone-500 block truncate">{{ m.role }} • {{ m.phone }}</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  (click)="assignTask.emit(m.name)"
                  class="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[10.5px] flex items-center gap-1 transition cursor-pointer border border-stone-200/80 active:scale-95"
                  title="Asignar tarea a este integrante en el plan"
                >
                  <app-icon name="plus-circle" className="w-3 h-3 text-[#E67324]" />
                  <span>Asignar Tarea</span>
                </button>
                @if (isAdmin()) {
                  <button type="button" (click)="removeMember.emit(m.id)" class="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer" title="Remover integrante">
                    <app-icon name="trash-2" className="w-3.5 h-3.5" />
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
export class GeneralTeamCardComponent {
  readonly teamData = input.required<GeneralTeamData>();
  readonly isAdmin = input<boolean>(false);
  readonly removeMember = output<string>();
  readonly addMember = output<{ name: string; role: string; phone: string }>();
  readonly assignTask = output<string>();

  readonly newName = signal('');
  readonly newRole = signal('');
  readonly newPhone = signal('');
  readonly isAdding = signal(false);

  handleAddMember(): void {
    if (!this.newName().trim()) return;
    this.addMember.emit({
      name: this.newName().trim(),
      role: this.newRole().trim() || 'Obrero de Campo',
      phone: this.newPhone().trim() || '+57 300 000 0000',
    });
    this.newName.set(''); this.newRole.set(''); this.newPhone.set(''); this.isAdding.set(false);
  }
}
