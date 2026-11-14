// Formulario de inicio de sesión unificado con botón institucional estándar
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { TeamSupervisionSummary } from '../../../admin/domain/admin.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { PasswordInputFieldComponent } from './password-input-field.component';

@Component({
  selector: 'app-login-form-fields',
  standalone: true,
  imports: [AppIconComponent, PasswordInputFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="onSubmit($event)" class="space-y-4 sm:space-y-4.5 font-['Outfit']">
      <div>
        <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
          Correo Electrónico (Institucional o de Campo)
        </label>
        <div class="relative">
          <input
            type="text"
            
            [value]="identifier"
            (input)="identifierChange.emit($any($event.target).value)"
            placeholder="Correo Electronico"
            class="h-12 sm:h-13 w-full pl-4 pr-11 rounded-xl text-sm sm:text-base border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-hidden focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 text-slate-900 font-medium placeholder-slate-400 transition"
            required
          />
          <app-icon name="mail" className="w-4.5 h-4.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <app-password-input-field
        [password]="password"
        (passwordChange)="passwordChange.emit($event)"
        [showPassword]="showPassword"
        (showPasswordChange)="showPasswordChange.emit($event)"
      />

      <button
        type="submit"
        [disabled]="loading"
        class="h-12 sm:h-13 w-full py-3 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-4 font-['Outfit']"
      >
        @if (loading) {
          <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Verificando credenciales...</span>
        } @else {
          <span>Ingresar a la Plataforma</span>
          <app-icon name="arrow-right" className="w-4 h-4" />
        }
      </button>
    </form>
  `,
})
export class LoginFormFieldsComponent {
  @Input() activeTab?: 'admin' | 'team';
  @Input({ required: true }) identifier!: string;
  @Input({ required: true }) password!: string;
  @Input() showPassword = false;
  @Input() loading = false;
  @Input() allTeams: TeamSupervisionSummary[] = [];

  @Output() identifierChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() showPasswordChange = new EventEmitter<boolean>();
  @Output() teamSelect = new EventEmitter<string>();
  @Output() submitForm = new EventEmitter<Event>();

  onSubmit(e: Event) {
    e.preventDefault();
    this.submitForm.emit(e);
  }
}
