import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { CreateUserModalComponent } from './create-user-modal.component';
import { SecurityUsersTableRowComponent } from './security-users-table-row.component';
import { USER_ROLE_OPTIONS, type SystemUser, type CreateSystemUserDto } from '../../domain/security-users.types';
import type { SystemRoleId } from '../../domain/security.types';
import type { TeamSupervisionSummary } from '../../../admin/domain/admin.types';

const ROLE_ORDER: Record<SystemRoleId, number> = { national_director: 1, team_leader: 2, team_member: 3 };

@Component({
  selector: 'app-security-users-table',
  standalone: true,
  imports: [AppIconComponent, CreateUserModalComponent, SecurityUsersTableRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none space-y-3 p-3.5 sm:p-4">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <app-icon name="users" className="w-4 h-4 text-[#E67324]" />
          <h3 class="text-xs sm:text-sm font-black text-stone-900 font-['Outfit']">
            Asignación de Roles por Colaborador ({{ filteredUsers().length }} Personas)
          </h3>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="openCreate()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-2xs transition cursor-pointer font-['Outfit'] active:scale-95"
            title="Registrar nueva persona en el sistema"
          >
            <app-icon name="plus" className="w-3.5 h-3.5 text-[#E67324]" />
            <span>Nueva Persona</span>
          </button>

          <div class="inline-flex items-center p-0.5 rounded-xl bg-stone-100 border border-stone-200 gap-0.5">
            <button
              type="button"
              (click)="selectedRole.set('all')"
              class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer font-['Outfit']"
              [class]="selectedRole() === 'all' ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'"
            >Todos ({{ users().length }})</button>
            @for (opt of roleOptions; track opt.id) {
              <button
                type="button"
                (click)="selectedRole.set(opt.id)"
                class="px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer font-['Outfit']"
                [class]="selectedRole() === opt.id ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'"
              >{{ opt.label }} ({{ countRole(opt.id) }})</button>
            }
          </div>

          <div class="relative min-w-[170px] sm:min-w-[200px]">
            <input
              type="text"
              [value]="searchTerm()"
              (input)="searchTerm.set($any($event.target).value)"
              placeholder="Buscar persona o misión..."
              class="w-full text-xs py-1.5 pl-8 pr-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-['Outfit']"
            />
            <app-icon name="search" className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto overflow-y-auto max-h-[480px] sidebar-scroll-smooth border border-stone-200/80 rounded-xl">
        <table class="w-full text-left border-collapse min-w-[760px]">
          <thead class="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-xs text-stone-600 text-[10.5px] uppercase font-['Outfit'] tracking-wider border-b border-stone-200 shadow-2xs">
            <tr>
              <th class="py-2.5 px-3 font-bold">Colaborador</th>
              <th class="py-2.5 px-3 font-bold">Territorio / Misión</th>
              <th class="py-2.5 px-3 font-bold">Rol Actual</th>
              <th class="py-2.5 px-3 font-bold text-center">Reasignar Rol</th>
              <th class="py-2.5 px-3 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-xs font-['Outfit']">
            @for (user of filteredUsers(); track user.id) {
              <tr
                app-security-users-table-row
                [user]="user"
                [roleOptions]="roleOptions"
                (roleChanged)="roleChanged.emit($event)"
                (editClicked)="openEdit($event)"
                (deleteClicked)="confirmDelete($event)"
              ></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <app-create-user-modal
      [isOpen]="isCreateModalOpen()"
      [userToEdit]="userToEdit()"
      [teams]="teams()"
      (closed)="closeModal()"
      (saved)="userSaved.emit($event)"
    />
  `,
})
export class SecurityUsersTableComponent {
  private readonly toastSvc = inject(ToastService);
  readonly users = input.required<SystemUser[]>();
  readonly teams = input<TeamSupervisionSummary[]>([]);
  readonly roleChanged = output<{ userId: string; newRole: SystemRoleId }>();
  readonly userSaved = output<{ id?: string; data: CreateSystemUserDto }>();
  readonly userDeleted = output<string>();

  readonly searchTerm = signal('');
  readonly selectedRole = signal<SystemRoleId | 'all'>('all');
  readonly isCreateModalOpen = signal(false);
  readonly userToEdit = signal<SystemUser | null>(null);

  readonly roleOptions = [
    USER_ROLE_OPTIONS.find((r) => r.id === 'national_director')!,
    USER_ROLE_OPTIONS.find((r) => r.id === 'team_leader')!,
    USER_ROLE_OPTIONS.find((r) => r.id === 'team_member')!,
  ];

  readonly filteredUsers = computed(() => {
    const q = this.searchTerm().trim().toLowerCase(), r = this.selectedRole();
    let list = this.users();
    if (r !== 'all') list = list.filter((u) => u.role === r);
    if (q) list = list.filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.teamName.toLowerCase().includes(q) || (u.territory && u.territory.toLowerCase().includes(q)));
    return [...list].sort((a, b) => (ROLE_ORDER[a.role] - ROLE_ORDER[b.role]) || a.fullName.localeCompare(b.fullName));
  });

  openCreate(): void { this.userToEdit.set(null); this.isCreateModalOpen.set(true); }
  openEdit(u: SystemUser): void { this.userToEdit.set(u); this.isCreateModalOpen.set(true); }
  closeModal(): void { this.userToEdit.set(null); this.isCreateModalOpen.set(false); }

  confirmDelete(u: SystemUser): void {
    this.toastSvc.confirmAction({
      title: 'Eliminar Colaborador',
      message: `¿Deseas eliminar a "${u.fullName}" (${u.email}) del sistema?`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      variant: 'danger',
      onConfirm: () => this.userDeleted.emit(u.id),
    });
  }

  countRole(roleId: SystemRoleId): number { return this.users().filter((u) => u.role === roleId).length; }
}
