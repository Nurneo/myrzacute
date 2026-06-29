import React from 'react';

const GlassHeartsBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none">
      {/* Hidden SVG for definitions */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5, 0.885 C 0.483, 0.885, 0.02, 0.546, 0.02, 0.345 C 0.02, 0.182, 0.148, 0.05, 0.305, 0.05 C 0.396, 0.05, 0.462, 0.103, 0.5, 0.148 C 0.538, 0.103, 0.604, 0.05, 0.695, 0.05 C 0.852, 0.05, 0.98, 0.182, 0.98, 0.345 C 0.98, 0.546, 0.517, 0.885, 0.5, 0.885 Z" />
          </clipPath>
          <linearGradient id="heart-glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.22)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.03)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Hearts */}
      {/* Heart 1 - Huge Heart (70vw on mobile, max 280px on desktop) */}
      <div 
        className="absolute animate-float-chaotic-1"
        style={{
          top: '15%',
          left: '-20%',
          width: '70vw',
          height: '70vw',
          maxWidth: '280px',
          maxHeight: '280px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)]">
          <div 
            className="absolute inset-0 bg-white/10 dark:bg-white/5" 
            style={{ 
              clipPath: 'url(#heart-clip)',
              backdropFilter: 'blur(12px) saturate(140%)',
              WebkitBackdropFilter: 'blur(12px) saturate(140%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50, 88.5 C 48.3, 88.5, 2, 54.6, 2, 34.5 C 2, 18.2, 14.8, 5, 30.5, 5 C 39.6, 5, 46.2, 10.3, 50, 14.8 C 53.8, 10.3, 60.4, 5, 69.5, 5 C 85.2, 5, 98, 18.2, 98, 34.5 C 98, 54.6, 51.7, 88.5, 50, 88.5 Z" 
              fill="url(#heart-glass-gradient)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
            <path 
              d="M 16, 32 C 14, 22, 22, 12, 34, 12" 
              stroke="rgba(255, 255, 255, 0.45)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>
      </div>

      {/* Heart 2 - Medium (50vw on mobile, max 200px) */}
      <div 
        className="absolute animate-float-chaotic-2"
        style={{
          top: '55%',
          left: '80%',
          width: '50vw',
          height: '50vw',
          maxWidth: '200px',
          maxHeight: '200px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
          <div 
            className="absolute inset-0 bg-white/10 dark:bg-white/5" 
            style={{ 
              clipPath: 'url(#heart-clip)',
              backdropFilter: 'blur(10px) saturate(140%)',
              WebkitBackdropFilter: 'blur(10px) saturate(140%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50, 88.5 C 48.3, 88.5, 2, 54.6, 2, 34.5 C 2, 18.2, 14.8, 5, 30.5, 5 C 39.6, 5, 46.2, 10.3, 50, 14.8 C 53.8, 10.3, 60.4, 5, 69.5, 5 C 85.2, 5, 98, 18.2, 98, 34.5 C 98, 54.6, 51.7, 88.5, 50, 88.5 Z" 
              fill="url(#heart-glass-gradient)"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.2"
            />
            <path 
              d="M 16, 32 C 14, 22, 22, 12, 34, 12" 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>
      </div>

      {/* Heart 3 - Medium-Small (38vw on mobile, max 150px) */}
      <div 
        className="absolute animate-float-chaotic-3"
        style={{
          top: '75%',
          left: '15%',
          width: '38vw',
          height: '38vw',
          maxWidth: '150px',
          maxHeight: '150px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
          <div 
            className="absolute inset-0 bg-white/10 dark:bg-white/5" 
            style={{ 
              clipPath: 'url(#heart-clip)',
              backdropFilter: 'blur(8px) saturate(130%)',
              WebkitBackdropFilter: 'blur(8px) saturate(130%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50, 88.5 C 48.3, 88.5, 2, 54.6, 2, 34.5 C 2, 18.2, 14.8, 5, 30.5, 5 C 39.6, 5, 46.2, 10.3, 50, 14.8 C 53.8, 10.3, 60.4, 5, 69.5, 5 C 85.2, 5, 98, 18.2, 98, 34.5 C 98, 54.6, 51.7, 88.5, 50, 88.5 Z" 
              fill="url(#heart-glass-gradient)"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.5"
            />
            <path 
              d="M 16, 32 C 14, 22, 22, 12, 34, 12" 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>
      </div>

      {/* Heart 4 - Small (28vw on mobile, max 110px) */}
      <div 
        className="absolute animate-float-chaotic-4"
        style={{
          top: '30%',
          left: '45%',
          width: '28vw',
          height: '28vw',
          maxWidth: '110px',
          maxHeight: '110px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.05)]">
          <div 
            className="absolute inset-0 bg-white/10 dark:bg-white/5" 
            style={{ 
              clipPath: 'url(#heart-clip)',
              backdropFilter: 'blur(6px) saturate(120%)',
              WebkitBackdropFilter: 'blur(6px) saturate(120%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50, 88.5 C 48.3, 88.5, 2, 54.6, 2, 34.5 C 2, 18.2, 14.8, 5, 30.5, 5 C 39.6, 5, 46.2, 10.3, 50, 14.8 C 53.8, 10.3, 60.4, 5, 69.5, 5 C 85.2, 5, 98, 18.2, 98, 34.5 C 98, 54.6, 51.7, 88.5, 50, 88.5 Z" 
              fill="url(#heart-glass-gradient)"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
            />
            <path 
              d="M 16, 32 C 14, 22, 22, 12, 34, 12" 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>
      </div>

      {/* Heart 5 - Tiny (20vw on mobile, max 80px) */}
      <div 
        className="absolute animate-float-chaotic-5"
        style={{
          top: '68%',
          left: '-5%',
          width: '20vw',
          height: '20vw',
          maxWidth: '80px',
          maxHeight: '80px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.04)]">
          <div 
            className="absolute inset-0 bg-white/10 dark:bg-white/5" 
            style={{ 
              clipPath: 'url(#heart-clip)',
              backdropFilter: 'blur(5px) saturate(120%)',
              WebkitBackdropFilter: 'blur(5px) saturate(120%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50, 88.5 C 48.3, 88.5, 2, 54.6, 2, 34.5 C 2, 18.2, 14.8, 5, 30.5, 5 C 39.6, 5, 46.2, 10.3, 50, 14.8 C 53.8, 10.3, 60.4, 5, 69.5, 5 C 85.2, 5, 98, 18.2, 98, 34.5 C 98, 54.6, 51.7, 88.5, 50, 88.5 Z" 
              fill="url(#heart-glass-gradient)"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.8"
            />
            <path 
              d="M 16, 32 C 14, 22, 22, 12, 34, 12" 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>
      </div>

      {/* Heart 6 - Micro (15vw on mobile, max 60px) */}
      <div 
        className="absolute animate-float-chaotic-6"
        style={{
          top: '5%',
          left: '75%',
          width: '15vw',
          height: '15vw',
          maxWidth: '60px',
          maxHeight: '60px',
        }}
      >
        <div className="w-full h-full relative filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.04)]">
          <div 
            className="absolute inset-0 bg-white/10 dark:bg-white/5" 
            style={{ 
              clipPath: 'url(#heart-clip)',
              backdropFilter: 'blur(4px) saturate(110%)',
              WebkitBackdropFilter: 'blur(4px) saturate(110%)',
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path 
              d="M 50, 88.5 C 48.3, 88.5, 2, 54.6, 2, 34.5 C 2, 18.2, 14.8, 5, 30.5, 5 C 39.6, 5, 46.2, 10.3, 50, 14.8 C 53.8, 10.3, 60.4, 5, 69.5, 5 C 85.2, 5, 98, 18.2, 98, 34.5 C 98, 54.6, 51.7, 88.5, 50, 88.5 Z" 
              fill="url(#heart-glass-gradient)"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="2"
            />
            <path 
              d="M 16, 32 C 14, 22, 22, 12, 34, 12" 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GlassHeartsBackground;
