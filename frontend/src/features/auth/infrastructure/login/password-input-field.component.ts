import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

// Campo de entrada de contraseña con botón para alternar visibilidad del texto
@Component({
  selector: 'app-password-input-field',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <label class="block text-xs font-semibold text-stone-500 mb-1.5">Contraseña de Acceso</label>
      <div class="relative">
        <input
          [type]="showPassword ? 'text' : 'password'"
          [value]="password"
          (input)="passwordChange.emit($any($event.target).value)"
          placeholder="••••••••••••"
          class="w-full px-4 py-3 pr-11 rounded-xl text-sm border border-stone-200 bg-stone-50/50 hover:border-stone-300 focus:bg-white focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 text-stone-900 font-mono transition"
          required
        />
        <button
          type="button"
          (click)="showPasswordChange.emit(!showPassword)"
          class="p-1 text-stone-400 hover:text-stone-700 transition absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          [title]="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
        >
          <app-icon [name]="showPassword ? 'eye-off' : 'eye'" className="w-4 h-4" />
        </button>
      </div>
    </div>
  `,
})
export class PasswordInputFieldComponent {
  // Valor de la contraseña, estado de visibilidad y eventos de actualización
  @Input() password = '';
  @Input() showPassword = false;
  @Output() passwordChange = new EventEmitter<string>();
  @Output() showPasswordChange = new EventEmitter<boolean>();
}

