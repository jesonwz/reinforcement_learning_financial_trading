import { useState, useEffect } from 'react';

const mountainImages = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
];

export default function NaturalBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mountainImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/50" />
      
      {mountainImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          } ${isTransitioning ? 'scale-105' : 'scale-100'} transition-transform duration-700`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
    </div>
  );
}
