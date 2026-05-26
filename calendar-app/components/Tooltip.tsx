import { useState } from 'react';
import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPositionClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-white/20',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-white/20',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-white/20',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-white/20',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <>
          <div
            className={`absolute ${positionClasses[position]} z-50 glass-effect-strong px-3 py-1.5 rounded-lg text-sm text-white/90 whitespace-nowrap animate-scale-in`}
          >
            {content}
          </div>
          <div
            className={`absolute ${arrowPositionClasses[position]} z-50 w-0 h-0 border-4 border-transparent`}
          />
        </>
      )}
    </div>
  );
}
