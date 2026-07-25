import React, { useState } from 'react';
import { Sparkles, Moon, Sun, Heart, X } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import HeartExplosion from './HeartExplosion';

interface CuteNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'midnight' | 'midday';
  title: string;
  message: string;
  icon?: string;
}

const CuteNotificationModal: React.FC<CuteNotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  icon,
}) => {
  const { lang } = useLang();
  const tr = translations.notifications;
  const [showHearts, setShowHearts] = useState(false);

  if (!isOpen) return null;

  const isMidnight = type === 'midnight';

  const handleSendKiss = () => {
    setShowHearts(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      {showHearts && (
        <HeartExplosion
          onComplete={() => setShowHearts(false)}
          chars={isMidnight ? ['💋', '🌙', '✨', '💖', '⭐', '😴', '💕'] : ['☀️', '💋', '💖', '🌸', '✨', '🌻', '💕']}
        />
      )}

      <div className="relative w-full max-w-md bg-card border-[3px] border-primary/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/20 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decorative background glow */}
        <div
          className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none ${
            isMidnight ? 'bg-indigo-500' : 'bg-amber-400'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <X size={18} />
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-3xl border-[3px] flex items-center justify-center text-3xl mb-4 shadow-md ${
              isMidnight
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
            }`}
          >
            {icon ? (
              <span>{icon}</span>
            ) : isMidnight ? (
              <Moon size={32} className="animate-pulse" />
            ) : (
              <Sun size={32} className="animate-spin-slow" />
            )}
          </div>

          {/* Slot indicator */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border ${
              isMidnight
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
            }`}
          >
            <Sparkles size={12} />
            {isMidnight ? t(tr.midnightLabel, lang) : t(tr.middayLabel, lang)}
          </span>

          {/* Title */}
          <h2 className="text-2xl font-black text-foreground tracking-tight mb-3">
            {title}
          </h2>

          {/* Message Content */}
          <div className="w-full bg-secondary/40 border-[2px] border-border/60 rounded-2xl p-4 mb-6 text-left">
            <p className="text-foreground/90 font-medium text-base leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* Action Button */}
          <div className="w-full">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md text-base"
            >
              <Heart size={18} className="fill-primary-foreground" />
              {t(tr.closeBtn, lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuteNotificationModal;
