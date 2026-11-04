import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, HostListener, OnChanges, OnDestroy } from '@angular/core';
import { AppIconComponent } from './icon/app-icon.component';

// Componente base de ventana modal con fondo desenfocado, cierre con tecla Escape y bloqueo de scroll
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
        <div class="fixed inset-0" (click)="close.emit()"></div>

        <div
          [class]="'relative w-full ' + maxWidthClass + ' bg-white rounded-3xl shadow-[0_24px_50px_-12px_rgba(28,25,23,0.2)] border border-stone-200/90 overflow-hidden z-10 flex flex-col max-h-[92vh]'"
          (click)="$event.stopPropagation()"
        >
          <div class="h-1 w-full bg-gradient-to-r from-[#8B251E] via-[#E67324] to-[#8B251E]"></div>

          <div class="flex items-start justify-between px-6 sm:px-7 py-4.5 sm:py-5 border-b border-stone-100 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2]/60 to-white gap-3">
            <div>
              <h3 class="text-lg sm:text-xl font-black text-stone-900 font-['Outfit'] tracking-tight">{{ title }}</h3>
              @if (subtitle) {
                <p class="text-xs text-stone-500 mt-1 leading-relaxed max-w-xl">{{ subtitle }}</p>
              }
            </div>
            <button
              type="button"
              (click)="close.emit()"
              class="w-8 h-8 rounded-xl bg-stone-100/80 hover:bg-stone-200/80 text-stone-400 hover:text-stone-700 flex items-center justify-center transition cursor-pointer shrink-0 mt-0.5"
              aria-label="Cerrar modal"
            >
              <app-icon name="x" className="w-4 h-4" />
            </button>
          </div>

          <div class="p-5 sm:p-7 overflow-y-auto space-y-4 custom-scrollbar">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent implements OnChanges, OnDestroy {
  // Propiedades de visibilidad, textos de encabezado, ancho máximo y evento de cierre
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' = '2xl';
  @Output() close = new EventEmitter<void>();

  // Traduce el tamaño configurado a la clase max-w-* de Tailwind
  get maxWidthClass(): string {
    const map = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '4xl': 'max-w-4xl',
    };
    return map[this.maxWidth] || 'max-w-2xl';
  }

  // Permite cerrar el modal presionando la tecla Escape
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) this.close.emit();
  }

  // Bloquea o restaura el scroll del body cuando el modal se abre o cierra
  ngOnChanges() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isOpen ? 'hidden' : 'unset';
    }
  }

  // Asegura restaurar el scroll al destruir el componente
  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  }
}

