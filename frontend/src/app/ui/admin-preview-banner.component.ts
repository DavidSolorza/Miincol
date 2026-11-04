import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../shared/components/icon/app-icon.component';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';

// Cinta superior de aviso cuando el Coordinador inspecciona el PDM de un equipo misionero
@Component({
  selector: 'app-admin-preview-banner',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="no-print bg-amber-50/95 border-b border-amber-200 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
      <div class="flex items-center gap-2 font-medium">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        <span><strong>Modo Vista Previa</strong></span>
        <span class="text-amber-700 hidden md:inline">
          • Supervisando: <strong>{{ activeTeam().name }}</strong> ({{ activeTeam().ethnicity }})
        </span>
      </div>

      <div class="flex items-center gap-2">
        @if (whatsappUrl()) {
          <a
            [href]="whatsappUrl()!"
            target="_blank"
            rel="noreferrer"
            class="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold transition text-[11px]"
          >
            <app-icon name="message-circle" className="w-3 h-3 text-emerald-700" />
            <span>WhatsApp</span>
          </a>
        }
        <button
          type="button"
          (click)="backToAdmin.emit()"
          class="px-2.5 py-0.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold transition flex items-center gap-1 cursor-pointer text-xs"
        >
          <app-icon name="arrow-left" className="w-3 h-3" />
          <span>Volver a Supervisión</span>
        </button>
      </div>
    </div>
  `,
})
export class AdminPreviewBannerComponent {
  // Datos del equipo supervisado, enlace WhatsApp y evento para regresar al panel general
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly whatsappUrl = input<string | null>(null);
  readonly backToAdmin = output<void>();
}

