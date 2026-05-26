import { useState, useEffect } from 'react';
import { backgroundOptions } from '../utils/storage';

interface NaturalBackgroundProps {
  backgroundId: string;
  autoRotate?: boolean;
}

export default function NaturalBackground({ backgroundId, autoRotate = true }: NaturalBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % backgroundOptions.length);
          setIsTransitioning(false);
        }, 500);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRotate]);

  const getCurrentImage = () => {
    const selectedBg = backgroundOptions.find(bg => bg.id === backgroundId);
    if (selectedBg && !autoRotate) {
      return selectedBg;
    }
    return backgroundOptions[currentIndex];
  };

  const currentImage = getCurrentImage();

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/50" />
      
      <div
        key={currentImage.id}
        className={`absolute inset-0 transition-all duration-500 ${
          isTransitioning ? 'scale-105 opacity-80' : 'scale-100 opacity-100'
        }`}
        style={{
          backgroundImage: `url(${currentImage.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
    </div>
  );
}
