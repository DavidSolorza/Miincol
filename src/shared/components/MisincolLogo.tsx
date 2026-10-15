import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const MisincolLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-32',
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/img/misincol.png"
        alt="MISINCOL - Misiones Indígenas en Colombia"
        className={`${sizeClasses[size]} w-auto object-contain drop-shadow-xs`}
        loading="eager"
      />
    </div>
  );
};
