import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import type { ActiveConfirmToast } from './toast.types';
import { AppIconComponent } from '../icon/app-icon.component';

// Tarjeta interactiva de confirmación flotante con barra de progreso regresiva
@Component({
  selector: 'app-toast-confirm-item',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-auto bg-[#FFFDF9]/98 backdrop-blur-md rounded-2xl border border-[#EBDDCF] shadow-[0_20px_50px_rgba(139,37,30,0.12),0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden p-3.5 sm:p-4 w-full max-w-[420px] animate-fadeIn">
      <div class="flex items-start gap-3">
        <div [class]="'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ' + (isDanger ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-200')">
          <app-icon [name]="isDanger ? 'alert-circle' : 'alert-triangle'" className="w-4 h-4" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <h4 class="text-xs sm:text-sm font-black text-stone-900 font-['Outfit'] leading-tight">
              {{ confirmItem.title }}
            </h4>
            <button
              type="button"
              (click)="handleCancel()"
              title="Cerrar aviso"
              class="text-stone-400 hover:text-stone-600 p-0.5 rounded-lg transition cursor-pointer"
            >
              <app-icon name="x" className="w-3.5 h-3.5" />
            </button>
          </div>
          <p class="text-[11.5px] text-stone-600 font-['Outfit'] mt-1 leading-snug">
            {{ confirmItem.message }}
          </p>

          <div class="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-stone-100">
            <button
              type="button"
              (click)="handleCancel()"
              class="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer active:scale-95 font-['Outfit']"
            >
              {{ confirmItem.cancelLabel || 'Cancelar' }}
            </button>
            <button
              type="button"
              (click)="handleConfirm()"
              [class]="'px-3 py-1 rounded-xl text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95 font-[Outfit] ' + (isDanger ? 'bg-[#8B251E] hover:bg-[#6E1A14]' : 'bg-gradient-to-r from-[#E67324] to-[#8B251E] hover:opacity-95')"
            >
              {{ confirmItem.confirmLabel || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>

      @if ((confirmItem.duration || 10000) > 0) {
        <div class="h-0.5 w-full bg-stone-100 mt-2.5 rounded-full overflow-hidden">
          <div
            [class]="'h-full transition-all duration-75 ease-linear ' + (isDanger ? 'bg-rose-500' : 'bg-[#E67324]')"
            [style.width.%]="progress()"
          ></div>
        </div>
      }
    </div>
  `,
})
export class ToastConfirmItemComponent implements OnInit, OnDestroy {
  // Configuración de la confirmación activa y evento para descartar la tarjeta
  @Input({ required: true }) confirmItem!: ActiveConfirmToast;
  @Output() dismiss = new EventEmitter<void>();

  // Porcentaje restante de la barra de progreso antes del cierre automático
  readonly progress = signal(100);
  private timer: any;

  // Determina si la acción es destructiva (danger) para aplicar esquema de color rojo
  get isDanger(): boolean {
    return this.confirmItem.type === 'danger';
  }

  // Inicia el temporizador de cuenta regresiva al montar el componente
  ngOnInit() {
    const duration = this.confirmItem.duration ?? 10000;
    if (duration <= 0) return;
    const interval = 50;
    const step = (interval / duration) * 100;
    this.timer = setInterval(() => {
      const next = this.progress() - step;
      if (next <= 0) {
        clearInterval(this.timer);
        this.confirmItem.onCancel?.();
        this.dismiss.emit();
      } else {
        this.progress.set(next);
      }
    }, interval);
  }

  // Limpia el temporizador al destruir la tarjeta
  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  // Ejecuta el callback de confirmación y cierra el aviso
  handleConfirm() {
    this.confirmItem.onConfirm();
    this.dismiss.emit();
  }

  // Ejecuta el callback de cancelación (si existe) y cierra el aviso
  handleCancel() {
    this.confirmItem.onCancel?.();
    this.dismiss.emit();
  }
}

