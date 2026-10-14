import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const MisincolLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  };

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <svg
        viewBox="0 0 520 125"
        className={`${sizeClasses[size]} w-auto drop-shadow-sm`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Degradado bicolor horizontal/vertical auténtico Misincol */}
          <linearGradient id="misincolLetterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C261E" />
            <stop offset="42%" stopColor="#9C2D24" />
            <stop offset="48%" stopColor="#DA6B20" />
            <stop offset="100%" stopColor="#EA7A24" />
          </linearGradient>

          <linearGradient id="ochreWarmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C261E" />
            <stop offset="30%" stopColor="#A83228" />
            <stop offset="50%" stopColor="#E67324" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#8C261E" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Grupo de Letras 'misinco' con estilo orgánico y corte de color característico */}
        <g filter="url(#subtleGlow)">
          {/* 'm' */}
          <path
            d="M 30 105 V 50 C 30 38 42 35 52 35 C 64 35 72 42 76 52 C 81 41 90 35 102 35 C 118 35 125 46 125 62 V 105 C 125 111 118 115 112 115 C 106 115 100 111 100 105 V 66 C 100 58 96 52 87 52 C 78 52 74 58 74 67 V 105 C 74 111 67 115 61 115 C 55 115 49 111 49 105 V 66 C 49 58 45 52 36 52 C 30 52 26 55 24 60 V 105 C 24 111 18 115 12 115 C 6 115 0 111 0 105 V 50 C 0 38 12 35 22 35 C 26 35 30 37 30 40 Z"
            fill="url(#misincolLetterGrad)"
            transform="translate(10, -5)"
          />

          {/* 'i' */}
          <path
            d="M 148 100 V 50 C 148 42 155 35 163 35 C 171 35 178 42 178 50 V 100 C 178 108 171 115 163 115 C 155 115 148 108 148 100 Z"
            fill="url(#misincolLetterGrad)"
            transform="translate(15, -5)"
          />
          <circle cx="178" cy="18" r="14" fill="#8C261E" />

          {/* 's' */}
          <path
            d="M 235 48 C 235 38 223 32 208 32 C 193 32 182 39 182 50 C 182 72 235 63 235 88 C 235 103 222 115 204 115 C 187 115 175 104 175 92 C 175 85 181 80 188 80 C 195 80 199 85 203 89 C 206 93 212 96 218 96 C 223 96 228 92 228 86 C 228 66 175 75 175 50 C 175 35 188 23 208 23 C 224 23 238 31 240 44 C 241 50 236 55 230 55 C 226 55 223 52 221 48 Z"
            fill="url(#misincolLetterGrad)"
            transform="translate(25, -3)"
          />

          {/* 'i' */}
          <path
            d="M 270 100 V 50 C 270 42 277 35 285 35 C 293 35 300 42 300 50 V 100 C 300 108 293 115 285 115 C 277 115 270 108 270 100 Z"
            fill="url(#misincolLetterGrad)"
            transform="translate(20, -5)"
          />
          <circle cx="305" cy="18" r="14" fill="#8C261E" />

          {/* 'n' */}
          <path
            d="M 330 100 V 50 C 330 38 340 33 352 33 C 368 33 376 43 376 58 V 100 C 376 108 370 115 362 115 C 354 115 348 108 348 100 V 62 C 348 54 343 49 334 49 C 326 49 321 54 321 63 V 100 C 321 108 315 115 307 115 C 299 115 293 108 293 100 V 50 C 293 42 299 35 307 35 C 315 35 321 41 321 47 Z"
            fill="url(#misincolLetterGrad)"
            transform="translate(30, -5)"
          />

          {/* 'c' */}
          <path
            d="M 425 52 C 420 42 411 35 398 35 C 378 35 365 51 365 74 C 365 97 378 113 398 113 C 411 113 421 106 426 95 C 428 90 425 84 419 84 C 414 84 410 87 407 92 C 404 96 398 99 393 99 C 382 99 375 88 375 74 C 375 60 382 49 393 49 C 399 49 405 52 408 57 C 411 61 416 63 420 63 C 426 63 429 58 425 52 Z"
            fill="url(#misincolLetterGrad)"
            transform="translate(45, -3)"
          />

          {/* 'o' */}
          <path
            d="M 450 74 C 450 51 465 35 487 35 C 509 35 524 51 524 74 C 524 97 509 113 487 113 C 465 113 450 97 450 74 Z M 487 48 C 476 48 469 59 469 74 C 469 89 476 100 487 100 C 498 100 505 89 505 74 C 505 59 498 48 487 48 Z"
            fill="url(#misincolLetterGrad)"
            transform="translate(25, -3)"
          />

          {/* 'l' especial de MISINCOL: Cápsula / Tótem con Glifo Espiral Indígena */}
          <g transform="translate(560, 5)">
            {/* Cuerpo exterior del tótem 'l' */}
            <rect
              x="0"
              y="10"
              width="24"
              height="95"
              rx="12"
              fill="url(#ochreWarmGrad)"
            />
            {/* Casquete superior Terracota */}
            <path
              d="M 0 22 C 0 15 5 10 12 10 C 19 10 24 15 24 22 V 38 H 0 Z"
              fill="#8C261E"
            />
            {/* Glifo Espiral Precolombino Autóctono en la base */}
            <g transform="translate(4, 78) scale(0.68)" stroke="#8C261E" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 12 12 L 12 10 L 8 10 L 8 16 L 16 16 L 16 6 L 4 6 L 4 20 L 20 20 L 20 2" />
            </g>
          </g>
        </g>
      </svg>

      {/* Subtítulo: misiones indígenas en colombia */}
      {showSubtitle && (
        <span className="font-['Outfit'] font-bold text-[#8C261E] tracking-[0.16em] text-[11px] sm:text-[13px] md:text-[14px] mt-1 pl-1">
          misiones indígenas en Colombia
        </span>
      )}
    </div>
  );
};
