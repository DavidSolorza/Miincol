import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-login-support-footer',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-['Outfit']">
      <span>¿Dificultades de acceso?</span>
      <a
        [href]="supportMailUrl"
        class="text-slate-900 hover:text-black font-bold flex items-center gap-1.5 transition"
      >
        <app-icon name="mail" className="w-4.5 h-4.5 text-slate-600" />
        <span>soporte@misincol.org</span>
      </a>
    </div>
  `,
})
export class LoginSupportFooterComponent {
  readonly supportMailUrl = 'mailto:soporte@misincol.org?subject=Asistencia%20de%20Acceso%20-%20Plan%20Ministerial';
}
