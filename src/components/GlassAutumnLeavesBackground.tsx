import React from 'react';

const GlassAutumnLeavesBackground = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden select-none"
      style={{
        transform: 'translate3d(0,0,0)',
        willChange: 'transform',
        contain: 'strict',
      }}
    >
      {/* Hidden SVG for definitions */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          {/* Maple Leaf Clip Path */}
          <clipPath id="maple-leaf-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.02 L 0.57,0.18 L 0.68,0.10 L 0.64,0.26 L 0.82,0.23 L 0.72,0.37 L 0.95,0.43 L 0.78,0.54 L 0.88,0.68 L 0.68,0.67 L 0.70,0.82 L 0.56,0.73 L 0.53,0.98 L 0.47,0.98 L 0.44,0.73 L 0.30,0.82 L 0.32,0.67 L 0.12,0.68 L 0.22,0.54 L 0.05,0.43 L 0.28,0.37 L 0.18,0.23 L 0.36,0.26 L 0.32,0.10 L 0.43,0.18 Z" />
          </clipPath>

          {/* Oak Leaf Clip Path */}
          <clipPath id="oak-leaf-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.05 C 0.58,0.1 0.68,0.12 0.64,0.22 C 0.76,0.25 0.78,0.38 0.7,0.47 C 0.8,0.53 0.76,0.68 0.64,0.72 C 0.68,0.82 0.58,0.86 0.53,0.96 L 0.47,0.96 C 0.42,0.86 0.32,0.82 0.36,0.72 C 0.24,0.68 0.2,0.53 0.3,0.47 C 0.22,0.38 0.24,0.25 0.36,0.22 C 0.32,0.12 0.42,0.1 0.5,0.05 Z" />
          </clipPath>

          {/* Autumn Glass Gradient */}
          <linearGradient id="autumn-glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.35)" />
            <stop offset="45%" stopColor="rgba(234, 88, 12, 0.18)" />
            <stop offset="100%" stopColor="rgba(180, 83, 9, 0.28)" />
          </linearGradient>

          <linearGradient id="autumn-glass-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.25)" />
            <stop offset="50%" stopColor="rgba(217, 119, 6, 0.12)" />
            <stop offset="100%" stopColor="rgba(146, 64, 14, 0.22)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Autumn Glass Leaf 1 - Large Maple Leaf (Top Right) */}
      <div 
        className="absolute animate-float-chaotic-2"
        style={{
          top: '8%',
          left: '70%',
          width: '60vw',
          height: '60vw',
          maxWidth: '240px',
          maxHeight: '240px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_15px_30px_rgba(180,83,9,0.15)]">
          <div 
            className="absolute inset-0 bg-amber-500/15 dark:bg-amber-600/10" 
            style={{ 
              clipPath: 'url(#maple-leaf-clip)',
              backdropFilter: 'blur(12px) saturate(150%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50,2 L 57,18 L 68,10 L 64,26 L 82,23 L 72,37 L 95,43 L 78,54 L 88,68 L 68,67 L 70,82 L 56,73 L 53,98 L 47,98 L 44,73 L 30,82 L 32,67 L 12,68 L 22,54 L 5,43 L 28,37 L 18,23 L 36,26 L 32,10 L 43,18 Z" 
              fill="url(#autumn-glass-gradient)"
              stroke="rgba(253, 230, 138, 0.45)"
              strokeWidth="1.2"
            />
            {/* Leaf Veins */}
            <path d="M 50,95 L 50,20 M 50,60 L 75,40 M 50,60 L 25,40 M 50,75 L 65,65 M 50,75 L 35,65" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>

      {/* Floating Autumn Glass Leaf 2 - Medium Oak Leaf (Bottom Left) */}
      <div 
        className="absolute animate-float-chaotic-5"
        style={{
          top: '62%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          maxWidth: '200px',
          maxHeight: '200px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_12px_24px_rgba(217,119,6,0.15)]">
          <div 
            className="absolute inset-0 bg-amber-400/15 dark:bg-amber-500/10" 
            style={{ 
              clipPath: 'url(#oak-leaf-clip)',
              backdropFilter: 'blur(10px) saturate(140%)',
              WebkitBackdropFilter: 'blur(10px) saturate(140%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50,5 C 58,10 68,12 64,22 C 76,25 78,38 70,47 C 80,53 76,68 64,72 C 68,82 58,86 53,96 L 47,96 C 42,86 32,82 36,72 C 24,68 20,53 30,47 C 22,38 24,25 36,22 C 32,12 42,10 50,5 Z" 
              fill="url(#autumn-glass-gradient)"
              stroke="rgba(254, 215, 170, 0.4)"
              strokeWidth="1.2"
            />
            {/* Oak Leaf Veins */}
            <path d="M 50,92 L 50,15 M 50,40 L 65,30 M 50,40 L 35,30 M 50,60 L 66,52 M 50,60 L 34,52" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>

      {/* Floating Autumn Glass Leaf 3 - Small Maple Leaf (Mid Left) */}
      <div 
        className="absolute animate-float-chaotic-1"
        style={{
          top: '32%',
          left: '12%',
          width: '35vw',
          height: '35vw',
          maxWidth: '130px',
          maxHeight: '130px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_8px_18px_rgba(180,83,9,0.12)]">
          <div 
            className="absolute inset-0 bg-amber-500/15 dark:bg-amber-600/10" 
            style={{ 
              clipPath: 'url(#maple-leaf-clip)',
              backdropFilter: 'blur(8px) saturate(130%)',
              WebkitBackdropFilter: 'blur(8px) saturate(130%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50,2 L 57,18 L 68,10 L 64,26 L 82,23 L 72,37 L 95,43 L 78,54 L 88,68 L 68,67 L 70,82 L 56,73 L 53,98 L 47,98 L 44,73 L 30,82 L 32,67 L 12,68 L 22,54 L 5,43 L 28,37 L 18,23 L 36,26 L 32,10 L 43,18 Z" 
              fill="url(#autumn-glass-gradient)"
              stroke="rgba(253, 230, 138, 0.4)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* Floating Autumn Glass Leaf 4 - Micro Oak Leaf (Lower Right) */}
      <div 
        className="absolute animate-float-chaotic-4"
        style={{
          top: '80%',
          left: '65%',
          width: '25vw',
          height: '25vw',
          maxWidth: '100px',
          maxHeight: '100px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_6px_14px_rgba(217,119,6,0.1)]">
          <div 
            className="absolute inset-0 bg-orange-400/15 dark:bg-orange-500/10" 
            style={{ 
              clipPath: 'url(#oak-leaf-clip)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50,5 C 58,10 68,12 64,22 C 76,25 78,38 70,47 C 80,53 76,68 64,72 C 68,82 58,86 53,96 L 47,96 C 42,86 32,82 36,72 C 24,68 20,53 30,47 C 22,38 24,25 36,22 C 32,12 42,10 50,5 Z" 
              fill="url(#autumn-glass-gradient)"
              stroke="rgba(254, 215, 170, 0.35)"
              strokeWidth="1.8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GlassAutumnLeavesBackground;
