import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface SafeModeContextType {
  isSafeMode: boolean;
  toggleSafeMode: () => void;
  setSafeMode: (value: boolean) => void;
}

const SafeModeContext = createContext<SafeModeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'myrzacute_safe_mode';

export const SafeModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSafeMode, setIsSafeModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const setSafeMode = (value: boolean) => {
    setIsSafeModeState(value);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSafeMode = () => {
    setSafeMode(!isSafeMode);
  };

  // Face-down detection using DeviceOrientation API
  useEffect(() => {
    let lastTriggerTime = 0;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta === null && gamma === null) return;

      // When phone is placed screen face down on a flat surface,
      // beta is around 180° or -180° (Math.abs(beta) > 145) or gamma > 140
      const isFaceDown = (beta !== null && Math.abs(beta) > 145) || (gamma !== null && Math.abs(gamma) > 145);

      if (isFaceDown) {
        const now = Date.now();
        // Cooldown of 3 seconds to avoid repeated triggers
        if (now - lastTriggerTime > 3000) {
          lastTriggerTime = now;
          setIsSafeModeState(prev => {
            if (!prev) {
              try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(true));
              } catch {}
              toast.info('Privacy mode activated (device face down) 🙈', {
                duration: 2500,
                id: 'face-down-privacy-toast',
              });
              return true;
            }
            return prev;
          });
        }
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  return (
    <SafeModeContext.Provider value={{ isSafeMode, toggleSafeMode, setSafeMode }}>
      {children}
    </SafeModeContext.Provider>
  );
};

export const useSafeMode = (): SafeModeContextType => {
  const context = useContext(SafeModeContext);
  if (!context) {
    throw new Error('useSafeMode must be used within a SafeModeProvider');
  }
  return context;
};
