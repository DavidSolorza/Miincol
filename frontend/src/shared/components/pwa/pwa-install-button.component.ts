import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { AppIconComponent } from '../icon/app-icon.component';
import { ToastService } from '../toast/toast.service';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Component({
  selector: 'app-pwa-install-button',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (canInstall()) {
      <button
        type="button"
        (click)="installDesktopApp()"
        class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-stone-200/90 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 text-xs font-bold transition shadow-2xs hover:shadow-xs cursor-pointer font-['Outfit'] active:scale-95"
        title="Instalar MISINCOL PDM como Aplicación de Escritorio nativa"
      >
        <app-icon name="file-down" className="w-3.5 h-3.5 text-emerald-700" />
        <span class="hidden md:inline">Instalar App Escritorio</span>
        <span class="md:hidden">Instalar</span>
      </button>
    }
  `,
})
export class PwaInstallButtonComponent {
  private readonly toastService = inject(ToastService);
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  readonly canInstall = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        this.canInstall.set(true);
      });

      window.addEventListener('appinstalled', () => {
        this.canInstall.set(false);
        this.deferredPrompt = null;
        this.toastService.toast.success(
          '¡MISINCOL PDM instalada exitosamente en tu escritorio!',
          'App Instalada'
        );
      });
    }
  }

  async installDesktopApp(): Promise<void> {
    if (!this.deferredPrompt) {
      this.toastService.toast.info(
        'Puedes instalar la app desde el icono de instalación en la barra de tu navegador.',
        'Instalación'
      );
      return;
    }

    try {
      await this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        this.toastService.toast.success(
          'Iniciando instalación en tu sistema operativo...',
          'Escritorio'
        );
      }
      this.deferredPrompt = null;
      this.canInstall.set(false);
    } catch {
      this.toastService.toast.info('Instalación en curso o gestionada por el navegador.', 'PWA');
    }
  }
}

