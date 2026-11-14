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
      <label class="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña de Acceso</label>
      <div class="relative">
        <input
          [type]="showPassword ? 'text' : 'password'"
          [value]="password"
          (input)="passwordChange.emit($any($event.target).value)"
          placeholder="••••••••••••"
          class="h-12 w-full px-4 pr-11 rounded-xl text-sm border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-hidden focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 text-slate-900 font-mono transition"
          required
        />
        <button
          type="button"
          (click)="showPasswordChange.emit(!showPassword)"
          class="p-2 text-slate-400 hover:text-slate-700 transition absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg hover:bg-slate-100"
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
