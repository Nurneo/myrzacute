"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { lang } = useLang();
  const isDark = theme === 'dark';
  const tr = translations.settings;

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between p-6 rounded-3xl border-[3px] border-border bg-card shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </div>
        <span className="font-bold text-foreground">{t(tr.themeLabel, lang)}</span>
      </div>

      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-10 w-20 items-center rounded-full border-[3px] transition-colors duration-500 focus:outline-none border-border",
          isDark
            ? "bg-primary/20"
            : "bg-accent/20"
        )}
      >
        <span
          className={cn(
            "inline-block h-6 w-6 transform rounded-full transition-transform duration-500 border-[3px] border-border",
            isDark
              ? "translate-x-11 bg-primary"
              : "translate-x-1 bg-accent"
          )}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
