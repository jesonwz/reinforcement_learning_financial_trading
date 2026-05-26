import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

export default function Tooltip({ content, children, position = 'auto' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayPosition, setDisplayPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (position === 'auto' && tooltipRef.current && parentRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const canShowTop = parentRect.top - tooltipRect.height - 16 > 0;
      const canShowBottom = parentRect.bottom + tooltipRect.height + 16 < windowHeight;
      const canShowLeft = parentRect.left - tooltipRect.width - 16 > 0;
      const canShowRight = parentRect.right + tooltipRect.width + 16 < windowWidth;

      if (canShowTop) {
        setDisplayPosition('top');
      } else if (canShowBottom) {
        setDisplayPosition('bottom');
      } else if (canShowLeft) {
        setDisplayPosition('left');
      } else if (canShowRight) {
        setDisplayPosition('right');
      } else {
        setDisplayPosition('top');
      }
    } else if (position !== 'auto') {
      setDisplayPosition(position);
    }
  }, [isVisible, position]);

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
    <div className="relative inline-block" ref={parentRef}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <>
          <div
            ref={tooltipRef}
            className={`absolute ${positionClasses[displayPosition]} z-50 glass-effect-strong px-3 py-1.5 rounded-lg text-sm text-white/90 whitespace-nowrap animate-scale-in max-w-[200px]`}
          >
            {content}
          </div>
          <div
            className={`absolute ${arrowPositionClasses[displayPosition]} z-50 w-0 h-0 border-4 border-transparent`}
          />
        </>
      )}
    </div>
  );
}
