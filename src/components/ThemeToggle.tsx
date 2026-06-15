"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between p-6 rounded-3xl border-[3px] border-border bg-card shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </div>
        <div>
          <p className="font-bold text-foreground">Режим интерфейса</p>
          <p className="text-xs text-muted-foreground">
            {isDark ? 'Ночной режим' : 'Дневной режим'}
          </p>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-10 w-20 items-center rounded-full border-[3px] transition-colors duration-500 focus:outline-none",
          // Day mode (Moonstone bg) -> Switch is Petal Frost (#EFCEDB)
          // Night mode (Petal Frost bg) -> Switch is Moonstone (#4C9DB0)
          isDark 
            ? "bg-[#4C9DB0] border-[#4F2B1F]" 
            : "bg-[#EFCEDB] border-[#FFEBAF]"
        )}
      >
        <span
          className={cn(
            "inline-block h-6 w-6 transform rounded-full transition-transform duration-500 border-[3px]",
            // Accent color on the switch matches the switch's theme context
            isDark 
              ? "translate-x-11 bg-[#FFEBAF] border-[#4F2B1F]" 
              : "translate-x-1 bg-[#4F2B1F] border-[#FFEBAF]"
          )}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;