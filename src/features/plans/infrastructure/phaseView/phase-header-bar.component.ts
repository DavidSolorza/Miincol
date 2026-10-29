import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-phase-header-bar',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-2.5">
        <button
          type="button"
          (click)="toggleMobileMenu.emit()"
          class="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
          title="Abrir menú lateral"
        >
          <app-icon name="menu" className="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[11px] font-black uppercase tracking-wider text-[#8B251E] bg-gradient-to-r from-[#8B251E]/10 to-[#E67324]/10 px-3 py-1.5 rounded-xl border border-[#8B251E]/15 font-['Outfit'] shadow-2xs">
            {{ phaseName() }}
          </span>
          <span class="text-xs font-semibold text-stone-400 hidden sm:inline">
            • {{ objectivesCount() }} Objetivos Estratégicos
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 ml-auto">
        <button
          type="button"
          (click)="handleReset()"
          class="w-8 h-8 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 border border-transparent hover:border-stone-200 flex items-center justify-center transition cursor-pointer"
          title="Restablecer datos originales"
        >
          <app-icon name="rotate-ccw" className="w-4.5 h-4.5" />
        </button>

        @if (!hasMaxObjectives()) {
          <button
            type="button"
            (click)="openCreateObjective.emit()"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#8B251E] bg-[#8B251E]/10 hover:bg-[#8B251E]/15 border border-[#8B251E]/20 transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Crear nuevo objetivo (Máx 4)"
          >
            <app-icon name="plus" className="w-4.5 h-4.5" />
            <span>Nuevo Objetivo</span>
          </button>
        }
      </div>
    </div>
  `,
})
// Barra superior de la fase con título, contador de objetivos y acciones de creación o restablecimiento
export class PhaseHeaderBarComponent {
  private readonly toastService = inject(ToastService); // Servicio para mostrar confirmaciones y alertas toast

  readonly phaseName = input.required<string>(); // Nombre descriptivo de la fase ministerial actual
  readonly objectivesCount = input.required<number>(); // Cantidad de objetivos registrados en la fase
  readonly hasMaxObjectives = input.required<boolean>(); // Indica si ya se alcanzó el máximo de 4 objetivos

  readonly toggleMobileMenu = output<void>(); // Emite para abrir el menú lateral en pantallas móviles
  readonly resetToDefaults = output<void>(); // Emite para restaurar las actividades predeterminadas de la fase
  readonly openCreateObjective = output<void>(); // Emite para abrir el modal de creación de objetivo

  // Pide confirmación al usuario antes de restablecer los datos originales de prueba
  handleReset(): void {
    this.toastService.confirmAction({
      title: '¿Restablecer Actividades de Prueba?',
      message: '¿Deseas restablecer las actividades de esta fase a sus valores originales de prueba?',
      confirmLabel: 'Restablecer',
      cancelLabel: 'Cancelar',
      type: 'warning',
      onConfirm: () => {
        this.resetToDefaults.emit();
        this.toastService.toast.info('Actividades restablecidas a valores originales', 'Datos Iniciales');
      },
    });
  }
}

