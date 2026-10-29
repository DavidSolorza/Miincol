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
    <form (submit)="onSubmit($event)" class="space-y-2.5 sm:space-y-3">
      @if (activeTab === 'team') {
        <div>
          <label class="block text-xs font-semibold text-stone-500 mb-1">Misión o Pueblo Indígena</label>
          <div class="relative">
            <select
              [value]="identifier"
              (change)="teamSelect.emit($any($event.target).value)"
              class="w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50/50 hover:border-stone-300 focus:bg-white focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 text-stone-900 font-medium transition cursor-pointer appearance-none"
            >
              @for (t of allTeams; track t.id) {
                <option [value]="t.slug || t.id" [selected]="(t.slug || t.id) === identifier">
                  {{ t.name }} — {{ t.ethnicity }}
                </option>
              }
            </select>
            <app-icon name="compass" className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      } @else {
        <div>
          <label class="block text-xs font-semibold text-stone-500 mb-1">Usuario Administrador</label>
          <div class="relative">
            <input
              type="text"
              [value]="identifier"
              (input)="identifierChange.emit($any($event.target).value)"
              placeholder="admin"
              class="w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50/50 hover:border-stone-300 focus:bg-white focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 text-stone-900 transition font-medium"
              required
            />
            <app-icon name="user" className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      }

      <app-password-input-field
        [password]="password"
        (passwordChange)="passwordChange.emit($event)"
        [showPassword]="showPassword"
        (showPasswordChange)="showPasswordChange.emit($event)"
      />

      <button
        type="submit"
        [disabled]="loading"
        class="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#18181b] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-1"
      >
        @if (loading) {
          <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Verificando credenciales...</span>
        } @else {
          <span>Ingresar al Sistema</span>
          <app-icon name="arrow-right" className="w-4 h-4" />
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

