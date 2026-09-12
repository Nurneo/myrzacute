import React, { useEffect, useState } from 'react';

interface AutumnLeafItem {
  id: number;
  char: string;
  left: number;
  size: number;
  duration: number;
  rotation: number;
  sway: number;
  delay: number;
  opacity: number;
}

const AUTUMN_ITEMS = ['🍁', '🍂', '🍁', '🌾', '🌰', '🍂', '🍁'];

const FallingAutumnLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<AutumnLeafItem[]>([]);

  useEffect(() => {
    // Generate a one-time burst of 32 leaves when the app opens
    const initialList: AutumnLeafItem[] = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const char = AUTUMN_ITEMS[Math.floor(Math.random() * AUTUMN_ITEMS.length)];
      const size = 1.2 + Math.random() * 1.8; // 1.2rem to 3.0rem
      const left = Math.random() * 95; // 0% to 95% left offset
      const duration = 4.5 + Math.random() * 4.5; // 4.5s to 9s duration
      const rotation = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540);
      const sway = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 45);
      const delay = Math.random() * 4.5; // Staggered delays up to 4.5s
      const opacity = 0.7 + Math.random() * 0.3;

      initialList.push({
        id: i,
        char,
        left,
        size,
        duration,
        rotation,
        sway,
        delay,
        opacity,
      });
    }
    setLeaves(initialList);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden select-none">
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="absolute text-center select-none filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
          style={{
            top: '-60px',
            left: `${leaf.left}%`,
            fontSize: `${leaf.size}rem`,
            opacity: leaf.opacity,
            animationName: 'fall-and-sway',
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationFillMode: 'forwards',
            animationIterationCount: 1,
            // CSS Custom properties for sway and rotation
            ['--spin-rotation' as any]: `${leaf.rotation}deg`,
            ['--sway-amount' as any]: `${leaf.sway}px`,
          }}
        >
          {leaf.char}
        </div>
      ))}
    </div>
  );
};

export default FallingAutumnLeaves;
