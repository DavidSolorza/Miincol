// Formulario de inicio de sesión dark minimalista con botón pill de alto contraste
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
    <form (submit)="onSubmit($event)" class="space-y-4 font-['Outfit']">
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1.5">
          Correo Electrónico (Institucional o de Campo)
        </label>
        <div class="relative">
          <input
            type="text"
            list="login-emails-list"
            [value]="identifier"
            (input)="identifierChange.emit($any($event.target).value)"
            placeholder="ej. hudisapastos@misincol.org o tu.correo@misincol.org"
            class="h-12 w-full pl-4 pr-11 rounded-xl text-sm border border-slate-800 bg-slate-900/80 hover:border-slate-700 focus:bg-slate-900 focus:outline-hidden focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 text-white font-medium placeholder-slate-500 transition"
            required
          />
          <datalist id="login-emails-list">
            <option value="hudisapastos@misincol.org">👑 Pr. Hugo Solorza (Coordinación Nacional)</option>
            @for (t of allTeams; track t.id) {
              @if (t.leaderEmail) {
                <option [value]="t.leaderEmail">{{ t.name }} — Líder: {{ t.leader }}</option>
              }
            }
          </datalist>
          <app-icon name="mail" className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
        class="h-12 w-full py-3 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-white/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98] mt-4"
      >
        @if (loading) {
          <div class="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
          <span>Verificando...</span>
        } @else {
          <span>Ingresar a la Plataforma</span>
          <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
        }
      </button>
    </form>
  `,
})
export class LoginFormFieldsComponent {
  @Input({ required: true }) activeTab!: 'admin' | 'team';
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
