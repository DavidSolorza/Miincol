import { Component, ChangeDetectionStrategy, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { IconName } from './icon.types';
import { ICON_PATHS_A } from './icon-paths-a';
import { ICON_PATHS_B } from './icon-paths-b';

const ALL_ICONS: Partial<Record<IconName, string>> = {
  ...ICON_PATHS_A,
  ...ICON_PATHS_B,
};

// Motor centralizado de íconos vectoriales SVG (<app-icon name="...">)
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.class]="className"
      [innerHTML]="safeSvg"
    ></svg>
  `,
  styles: [`:host { display: inline-flex; align-items: center; justify-content: center; }`],
})
export class AppIconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  // Nombre del ícono en el catálogo, clases CSS de tamaño/color y grosor del trazo
  @Input({ required: true }) name!: IconName;
  @Input() className = 'w-4 h-4';
  @Input() strokeWidth = 2;

  // Obtiene y sanitiza el trazado SVG interno asociado al nombre del ícono
  get safeSvg(): SafeHtml {
    const raw = ALL_ICONS[this.name] || ALL_ICONS['info'] || '';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  }
}

