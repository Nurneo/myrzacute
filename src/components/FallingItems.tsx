import React, { useEffect, useState } from 'react';

interface FallingItem {
  id: number;
  char: string;
  left: number;
  size: number;
  duration: number;
  rotation: number;
  delay: number;
}

const FallingItems: React.FC = () => {
  const [items, setItems] = useState<FallingItem[]>([]);

  // Function to create a single falling item
  const createItem = (id: number, isInitial = false): FallingItem => {
    const rand = Math.random();
    let char = '';
    if (rand < 0.70) {
      // 70% hearts
      const hearts = ['❤️', '💖', '💝', '💙', '💚', '💛', '💜', '🧡', '🖤', '🤍', '💕', '💞', '💘', '💗'];
      char = hearts[Math.floor(Math.random() * hearts.length)];
    } else if (rand < 0.90) {
      // 20% flowers
      const flowers = ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷'];
      char = flowers[Math.floor(Math.random() * flowers.length)];
    } else {
      // 10% dumbbells and cars
      const dumbbellsAndCars = ['🏋️', '🏋️‍♂️', '🏋️‍♀️', '💪', '🚗', '🏎️', '🚙', '🏎'];
      char = dumbbellsAndCars[Math.floor(Math.random() * dumbbellsAndCars.length)];
    }

    const size = 1 + Math.random() * 2; // size between 1rem and 3rem
    const left = Math.random() * 100; // left position percentage
    const duration = 3 + Math.random() * 4; // duration between 3s and 7s
    const rotation = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540); // spin rotation degrees
    const delay = isInitial ? 0 : Math.random() * 2; // initial burst has no delay, stream has random delay

    return {
      id,
      char,
      left,
      size,
      duration,
      rotation,
      delay
    };
  };

  useEffect(() => {
    // Generate initial burst of items immediately
    const initialItems: FallingItem[] = [];
    const burstSize = 40;
    let currentId = 0;
    for (let i = 0; i < burstSize; i++) {
      initialItems.push(createItem(currentId++, true));
    }
    setItems(initialItems);

    // Continuous stream of falling items
    const interval = setInterval(() => {
      setItems(prev => {
        // Keep elements count reasonable to avoid memory/DOM bloat
        const kept = prev.slice(-60);
        return [...kept, createItem(currentId++)];
      });
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map(item => (
        <div
          key={item.id}
          className="absolute text-center select-none"
          style={{
            top: '-50px',
            left: `${item.left}%`,
            fontSize: `${item.size}rem`,
            animationName: 'fall',
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationIterationCount: 1,
            // Pass the random spin rotation as CSS custom property
            ['--spin-rotation' as any]: `${item.rotation}deg`,
          }}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
};

export default FallingItems;
