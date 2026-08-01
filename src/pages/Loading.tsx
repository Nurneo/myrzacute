import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { useTheme } from 'next-themes';

interface LoadingProps {
  isExiting?: boolean;
}

const Loading = ({ isExiting }: LoadingProps) => {
  const { lang } = useLang();
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center z-[100] touch-none select-none pointer-events-none transform-gpu transition-all duration-500 ease-out",
        isExiting ? "opacity-0 scale-95 blur-[4px]" : "opacity-100 scale-100"
      )}
      style={{
        background: isDark
          ? "linear-gradient(to bottom, #a89bf2 80%, #4c9db0 100%)"
          : "linear-gradient(to bottom, #4c9db0 80%, #a89bf2 100%)",
      }}
    >
      <div className="text-center space-y-5 px-6 flex flex-col items-center transform-gpu">
        {/* Glow Ring + Breathing Heart Centerpiece */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-2">
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-30" style={{ animationDuration: '2.4s' }} />
          <div className="absolute -inset-2 rounded-full bg-primary/20 blur-md animate-pulse" />

          <div className="relative w-16 h-16 rounded-3xl bg-card/60 backdrop-blur-md border-[3px] border-border flex items-center justify-center shadow-lg transform-gpu animate-bounce" style={{ animationDuration: '2.2s' }}>
            <Heart className="text-red-500 fill-red-500 transition-transform duration-300" size={32} />
          </div>
        </div>

        {/* App Title */}
        <h1 
          className="text-4xl sm:text-5xl font-black text-primary tracking-tighter drop-shadow-sm"
          style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          MYRZACUTE
        </h1>

        {/* Tagline */}
        <p 
          className="text-primary-foreground/70 dark:text-white/70 text-xs sm:text-sm font-semibold tracking-widest uppercase flex items-center gap-1.5 justify-center"
          style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 150ms both' }}
        >
          <Sparkles size={14} className="text-primary" />
          <span>{t(translations.loading.tagline, lang)}</span>
          <Sparkles size={14} className="text-primary" />
        </p>

        {/* Wave Dots Indicator */}
        <div className="pt-6 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
