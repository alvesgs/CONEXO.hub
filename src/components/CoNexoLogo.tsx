import React from 'react';

interface CoNexoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  withTagline?: boolean;
}

export const CoNexoLogo: React.FC<CoNexoLogoProps> = ({ 
  size = 'md', 
  variant = 'light',
  withTagline = false 
}) => {
  const sizeClasses = {
    sm: {
      title: 'text-lg',
      sub: 'text-[9px]',
      dot: 'w-1.5 h-1.5',
      gap: 'gap-1.5'
    },
    md: {
      title: 'text-2xl',
      sub: 'text-[11px]',
      dot: 'w-2 h-2',
      gap: 'gap-2'
    },
    lg: {
      title: 'text-3xl',
      sub: 'text-xs',
      dot: 'w-2.5 h-2.5',
      gap: 'gap-2.5'
    },
    xl: {
      title: 'text-4xl',
      sub: 'text-sm',
      dot: 'w-3 h-3',
      gap: 'gap-3'
    }
  };

  const selectedSize = sizeClasses[size];

  // Colors strictly conforming to guidelines
  // co. = #A1D900
  // nexo = #004B8D (or #FFFFFF when on dark background)
  // senac = #1A1A1A (or #FFFFFF when on dark background)
  const nexoColor = variant === 'dark' ? 'text-white' : 'text-[#004B8D]';
  const senacColor = variant === 'dark' ? 'text-slate-200' : 'text-[#1A1A1A]';

  return (
    <div className="flex flex-col select-none">
      <div className={`flex items-baseline font-extrabold tracking-tight font-['Montserrat'] ${selectedSize.title}`}>
        {/* "co." in neon lime green */}
        <span className="text-[#A1D900]">co.</span>
        {/* "nexo" in institutional dark blue */}
        <span className={nexoColor}>nexo</span>
      </div>
      
      {/* "Senac" brand lockup below */}
      <div className="flex items-center gap-1.5 -mt-1">
        <span className={`font-bold uppercase tracking-wider font-['Montserrat'] ${selectedSize.sub} ${senacColor}`}>
          Senac
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#A1D900]" />
        {withTagline && (
          <span className={`font-medium ${selectedSize.sub} text-slate-400`}>
            Empreendedorismo
          </span>
        )}
      </div>
    </div>
  );
};
