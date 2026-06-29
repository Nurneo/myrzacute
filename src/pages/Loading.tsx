import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { useTheme } from 'next-themes';

interface LoadingProps {
  isExitingText?: boolean;
  isExitingBg?: boolean;
}

const Loading = ({ isExitingText, isExitingBg }: LoadingProps) => {
  const { lang } = useLang();
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center z-[100] transition-all duration-600 ease-in-out",
        isExitingBg ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      style={{
        background: isDark
          ? "linear-gradient(to bottom, #a89bf2 80%, #4c9db0 100%)"
          : "linear-gradient(to bottom, #4c9db0 80%, #a89bf2 100%)"
      }}
    >
      <div 
        className={cn(
          "text-center space-y-4 transition-all duration-300 ease-in-out",
          isExitingText ? "opacity-0 scale-95 blur-[2px]" : "opacity-100 scale-100"
        )}
      >
        <h1 className="text-4xl font-black text-primary tracking-tighter animate-in fade-in zoom-in duration-500">
          MYRZACUTE
        </h1>
        <p className="text-primary-foreground/60 dark:text-white/60 text-sm font-medium tracking-widest uppercase animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {t(translations.loading.tagline, lang)}
        </p>

        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Heart className="text-red-500 fill-red-500 animate-pulse" size={20} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
