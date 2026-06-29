import React, { useEffect, useState } from 'react';

interface HeartParticle {
  id: number;
  char: string;
  left: number;
  size: number;
  duration: number;
  rotation: number;
  delay: number;
}

interface HeartExplosionProps {
  onComplete: () => void;
  chars?: string[];
}

const HeartExplosion: React.FC<HeartExplosionProps> = ({ onComplete, chars }) => {
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  useEffect(() => {
    const newParticles: HeartParticle[] = [];
    const heartsList = chars || ['❤️', '💖', '💝', '💕', '💞', '💘', '💗', '🌹', '🌸'];
    
    // Create 60 particles for a lush explosion
    for (let i = 0; i < 60; i++) {
      const char = heartsList[Math.floor(Math.random() * heartsList.length)];
      const size = 1.5 + Math.random() * 2.5; // sizes between 1.5rem and 4rem
      const left = Math.random() * 100; // left position percentage
      const duration = 2.5 + Math.random() * 2.0; // duration between 2.5s and 4.5s
      const rotation = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
      const delay = Math.random() * 0.8; // spread the launch slightly
      
      newParticles.push({
        id: i,
        char,
        left,
        size,
        duration,
        rotation,
        delay,
      });
    }
    
    setParticles(newParticles);

    // Complete/unmount after the longest duration
    const timeout = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute text-center select-none"
          style={{
            top: '-50px',
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            animationName: 'fall',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationFillMode: 'forwards',
            animationIterationCount: 1,
            ['--spin-rotation' as any]: `${p.rotation}deg`,
          }}
        >
          {p.char}
        </div>
      ))}
    </div>
  );
};

export default HeartExplosion;
