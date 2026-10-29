import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-misincol-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'inline-flex items-center select-none ' + className">
      <img
        src="/img/misincol.png"
        alt="MISINCOL - Misiones Indígenas en Colombia"
        [class]="sizeClass + ' w-auto object-contain drop-shadow-xs'"
        loading="eager"
      />
    </div>
  `,
})
export class MisincolLogoComponent {
  @Input() className = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showSubtitle = false;

  get sizeClass(): string {
    const map = {
      sm: 'h-10 sm:h-12',
      md: 'h-14 sm:h-16',
      lg: 'h-20 sm:h-24',
      xl: 'h-28 sm:h-32',
    };
    return map[this.size] || map.md;
  }
}

