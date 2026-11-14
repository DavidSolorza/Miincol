import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

// Campo de entrada de contraseña con botón para alternar visibilidad en tema dark
@Component({
  selector: 'app-password-input-field',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <label class="block text-xs font-semibold text-slate-300 mb-1.5">Contraseña de Acceso</label>
      <div class="relative">
        <input
          [type]="showPassword ? 'text' : 'password'"
          [value]="password"
          (input)="passwordChange.emit($any($event.target).value)"
          placeholder="••••••••••••"
          class="h-12 w-full px-4 pr-11 rounded-xl text-sm border border-slate-800 bg-slate-900/80 hover:border-slate-700 focus:bg-slate-900 focus:outline-hidden focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 text-white font-mono placeholder-slate-500 transition"
          required
        />
        <button
          type="button"
          (click)="showPasswordChange.emit(!showPassword)"
          class="p-2 text-slate-500 hover:text-slate-300 transition absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg hover:bg-slate-800/60"
          [title]="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
        >
          <app-icon [name]="showPassword ? 'eye-off' : 'eye'" className="w-4 h-4" />
        </button>
      </div>
    </div>
  `,
})
export class PasswordInputFieldComponent {
  @Input() password = '';
  @Input() showPassword = false;
  @Output() passwordChange = new EventEmitter<string>();
  @Output() showPasswordChange = new EventEmitter<boolean>();
}
