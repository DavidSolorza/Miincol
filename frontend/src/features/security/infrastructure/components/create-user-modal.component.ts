import { Component, ChangeDetectionStrategy, input, output, signal, inject, effect } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import type { SystemRoleId } from '../../domain/security.types';
import type { SystemUser, CreateSystemUserDto } from '../../domain/security-users.types';
import type { TeamSupervisionSummary } from '../../../admin/domain/admin.types';

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-fadeIn" (click)="close()">
        <div class="bg-white rounded-2xl shadow-xl border border-stone-200/90 w-full max-w-md overflow-hidden" (click)="$event.stopPropagation()">
          <div class="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF7F2]">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-stone-900 text-[#E67324] flex items-center justify-center">
                <app-icon [name]="userToEdit() ? 'edit-3' : 'user-plus'" className="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-sm font-black text-stone-900 font-['Outfit']">{{ userToEdit() ? 'Editar Colaborador' : 'Registrar Nueva Persona' }}</h3>
                <p class="text-[11px] text-stone-500">{{ userToEdit() ? 'Actualizar datos de identidad, rol y territorio' : 'Asignar identidad, rol y misión territorial' }}</p>
              </div>
            </div>
            <button type="button" (click)="close()" class="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer">
              <app-icon name="x" className="w-4 h-4" />
            </button>
          </div>

          <div class="p-5 space-y-3.5 text-xs font-['Outfit']">
            <div>
              <label class="block font-bold text-stone-700 mb-1">Nombre Completo *</label>
              <input type="text" [value]="fullName()" (input)="fullName.set($any($event.target).value)" placeholder="Ej. Pr. Samuel Mendoza" class="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400" />
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Correo Electrónico *</label>
              <input type="email" [value]="email()" (input)="email.set($any($event.target).value)" placeholder="ejemplo@misincol.org" class="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-stone-700 mb-1">Rol en el Sistema *</label>
                <select [value]="role()" (change)="role.set($any($event.target).value)" class="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium">
                  <option value="team_member">Usuario equipo</option>
                  <option value="team_leader">Líder equipo</option>
                  <option value="national_director">Director nacional</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-stone-700 mb-1">Equipo / Territorio *</label>
                <select [value]="selectedTeamId()" (change)="selectedTeamId.set($any($event.target).value)" class="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium">
                  <option value="national">Coordinación Nacional</option>
                  @for (t of teams(); track t.id) { <option [value]="t.id">{{ t.name }}</option> }
                </select>
              </div>
            </div>
          </div>

          <div class="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
            <button type="button" (click)="close()" class="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 transition cursor-pointer text-xs">Cancelar</button>
            <button type="button" (click)="handleSubmit()" class="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition cursor-pointer text-xs shadow-2xs font-['Outfit'] active:scale-95">
              {{ userToEdit() ? 'Guardar Cambios' : 'Crear Persona' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CreateUserModalComponent {
  private readonly toastSvc = inject(ToastService);
  readonly isOpen = input.required<boolean>();
  readonly userToEdit = input<SystemUser | null>(null);
  readonly teams = input<TeamSupervisionSummary[]>([]);
  readonly closed = output<void>();
  readonly saved = output<{ id?: string; data: CreateSystemUserDto }>();

  readonly fullName = signal('');
  readonly email = signal('');
  readonly role = signal<SystemRoleId>('team_member');
  readonly selectedTeamId = signal('national');

  constructor() {
    effect(() => {
      const u = this.userToEdit();
      if (u) {
        this.fullName.set(u.fullName);
        this.email.set(u.email);
        this.role.set(u.role);
        this.selectedTeamId.set(u.teamId || 'national');
      } else {
        this.fullName.set('');
        this.email.set('');
        this.role.set('team_member');
        this.selectedTeamId.set('national');
      }
    }, { allowSignalWrites: true });
  }

  close(): void {
    this.fullName.set('');
    this.email.set('');
    this.role.set('team_member');
    this.selectedTeamId.set('national');
    this.closed.emit();
  }

  handleSubmit(): void {
    const name = this.fullName().trim();
    const mail = this.email().trim();
    if (!name || !mail) {
      this.toastSvc.toast.error('Debes completar el nombre y el correo electrónico', 'Campos Incompletos');
      return;
    }

    const tid = this.selectedTeamId();
    const teamObj = this.teams().find((t) => t.id === tid);
    const teamName = tid === 'national' ? 'Coordinación Nacional' : teamObj?.name || 'Misión Territorial';
    const territory = tid === 'national' ? 'Sede Central Bogotá' : (teamObj?.department ? `${teamObj.department} • ${teamObj.region}` : teamObj?.region || '');

    this.saved.emit({
      id: this.userToEdit()?.id,
      data: { fullName: name, email: mail, role: this.role(), teamId: tid === 'national' ? undefined : tid, teamName, territory },
    });
    this.close();
  }
}
