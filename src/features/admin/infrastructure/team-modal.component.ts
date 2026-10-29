import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, inject, signal } from '@angular/core';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { TeamGeneralFieldsComponent } from './teamModal/team-general-fields.component';
import { TeamLeaderFieldsComponent } from './teamModal/team-leader-fields.component';
import { TeamSettingsFieldsComponent } from './teamModal/team-settings-fields.component';

const DEFAULT_FORM: CreateTeamDto = {
  name: '', ethnicity: '', region: '', department: '', leader: '', leaderPhone: '+57 ',
  members: [], currentPhaseId: 'investigacion', totalBudget: 15000000, themeColor: '#8B251E',
  healthStatus: 'Optimo', slug: '', accessPin: '', criticalAlertMessage: '', criticalAlertType: 'Logística',
};

@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [
    ModalComponent,
    TeamGeneralFieldsComponent,
    TeamLeaderFieldsComponent,
    TeamSettingsFieldsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="isOpen"
      (close)="close.emit()"
      [title]="initialData ? 'Editar Misión: ' + initialData.name : 'Registrar Nueva Misión Territorial'"
      [subtitle]="initialData ? 'Actualice la información territorial, liderazgo pastoral y configuración de acceso' : 'Complete el formulario para desplegar una nueva misión indígena en el territorio nacional'"
      maxWidth="2xl"
    >
      <form (submit)="handleSubmit($event)" class="space-y-4 max-h-[80vh] overflow-y-auto px-1 py-1 custom-scrollbar">
        <app-team-general-fields [formData]="formData()" (updateChange)="handleChange($event)" />
        <app-team-leader-fields
          [formData]="formData()"
          [membersInput]="membersInput()"
          (membersInputChange)="membersInput.set($event)"
          (updateChange)="handleChange($event)"
        />
        <app-team-settings-fields
          [formData]="formData()"
          [showPassword]="showPassword()"
          (showPasswordChange)="showPassword.set($event)"
          (updateChange)="handleChange($event)"
        />

        <div class="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            (click)="close.emit()"
            class="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 border border-stone-200/80 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="saving()"
            class="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B251E] to-[#E67324] hover:from-[#751E18] hover:to-[#D05E12] text-white shadow-xs hover:shadow-md hover:shadow-[#8B251E]/20 transition cursor-pointer disabled:opacity-50 font-['Outfit']"
          >
            {{ saving() ? 'Guardando...' : initialData ? 'Guardar Cambios' : 'Crear Misión' }}
          </button>
        </div>
      </form>
    </app-modal>
  `,
})
export class TeamModalComponent implements OnChanges {
  private readonly toastSvc = inject(ToastService);

  @Input() isOpen = false;
  @Input() initialData: TeamSupervisionSummary | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitTeam = new EventEmitter<CreateTeamDto>();

  readonly formData = signal<CreateTeamDto>({ ...DEFAULT_FORM });
  readonly membersInput = signal('');
  readonly showPassword = signal(false);
  readonly saving = signal(false);

  ngOnChanges() {
    if (this.initialData) {
      this.formData.set({
        name: this.initialData.name || '',
        ethnicity: this.initialData.ethnicity || '',
        region: this.initialData.region || '',
        department: this.initialData.department || '',
        leader: this.initialData.leader || '',
        leaderPhone: this.initialData.leaderPhone || '+57 ',
        members: this.initialData.members || [],
        currentPhaseId: this.initialData.currentPhaseId || 'investigacion',
        totalBudget: this.initialData.totalBudget || 15000000,
        themeColor: this.initialData.themeColor || '#8B251E',
        healthStatus: this.initialData.healthStatus || 'Optimo',
        slug: this.initialData.slug || this.initialData.id || '',
        accessPin: this.initialData.accessPin || '',
        criticalAlertMessage: this.initialData.criticalAlert?.message || '',
        criticalAlertType: this.initialData.criticalAlert?.type || 'Logística',
      });
      this.membersInput.set(
        this.initialData.members?.length ? this.initialData.members.join(', ') : `${this.initialData.leader}, 2 obreros locales`
      );
    } else {
      this.formData.set({ ...DEFAULT_FORM });
      this.membersInput.set('');
    }
  }

  handleChange(updates: Partial<CreateTeamDto>) {
    this.formData.update((prev) => ({ ...prev, ...updates }));
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    this.saving.set(true);
    try {
      this.submitTeam.emit(this.formData());
      this.toastSvc.toast.success(this.initialData ? 'Misión actualizada correctamente' : 'Nueva misión registrada exitosamente');
      this.close.emit();
    } finally {
      this.saving.set(false);
    }
  }
}

