// Insignia flotante superior en el mapa que muestra el departamento activo y la misión asociada
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-colombia-dept-badge',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="absolute top-3 left-3 z-10 flex items-center gap-2.5 px-3 py-1.5 rounded-2xl shadow-2xs border border-[#EBDDCF]/80 backdrop-blur-md overflow-hidden transition-all duration-300"
      style="background: linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 248, 243, 0.96) 65%, rgba(230, 115, 36, 0.08) 90%, rgba(139, 37, 30, 0.10) 100%)"
    >
      <div
        class="absolute inset-0 pointer-events-none opacity-10"
        style="background-image: repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(139, 37, 30, 0.25) 5px, rgba(139, 37, 30, 0.25) 6.5px)"
      ></div>

      <div class="w-1 h-6 rounded-full bg-gradient-to-b from-[#8B251E] via-[#B83A2D] to-[#E67324] shrink-0"></div>

      <div class="flex flex-col min-w-0 z-10">
        <span class="text-[9px] font-black uppercase tracking-widest text-[#8B251E]/90 leading-none">
          {{ deptName ? 'Departamento' : 'Territorio Nacional' }}
        </span>
        <div class="flex items-center gap-1.5 mt-0.5">
          <app-icon name="map-pin" className="w-3 h-3 text-[#E67324] shrink-0" />
          <span class="text-xs font-black text-stone-900 truncate font-['Outfit'] tracking-wide">
            {{ deptName || 'Colombia • 32 Departamentos' }}
          </span>
          @if (activeTeamName) {
            <span
              class="text-[10px] font-bold px-1.5 py-0.2 rounded-md text-white shrink-0 shadow-2xs"
              [style.backgroundColor]="themeColor || '#8B251E'"
            >
              {{ activeTeamName }}
            </span>
          }
        </div>
      </div>
    </div>
  `,
})
export class ColombiaDeptBadgeComponent {
  @Input() deptName: string | null = null; // Nombre del departamento seleccionado o en hover
  @Input() activeTeamName: string | null = null; // Nombre de la misión activa en ese departamento
  @Input() themeColor: string | null = null; // Color identitario de la misión activa
}

