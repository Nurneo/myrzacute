import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { Heart, Lock, Delete, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import FallingItems from '@/components/FallingItems';
import { cn } from '@/lib/utils';

const PASSCODE = "260626";

const SecretPage = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tr = translations.secret;

  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('secret_unlocked') === 'true';
  });
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isWallpaperDark, setIsWallpaperDark] = useState(false);
  const [shake, setShake] = useState(false);

  const handleOpenLetter = () => {
    setIsWallpaperDark(true);
    setTimeout(() => {
      setIsLetterOpen(true);
    }, 1000);
  };

  // Sync unlock state to sessionStorage
  useEffect(() => {
    if (isUnlocked) {
      sessionStorage.setItem('secret_unlocked', 'true');
    }
  }, [isUnlocked]);

  // Handle keyboard inputs
  useEffect(() => {
    if (isUnlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        setPasscode("");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passcode, isUnlocked]);

  const handleDigit = (digit: string) => {
    if (passcode.length < 6) {
      const nextPasscode = passcode + digit;
      setPasscode(nextPasscode);

      if (nextPasscode.length === 6) {
        if (nextPasscode === PASSCODE) {
          toast.success(lang === 'ru' ? 'Доступ разрешен 💖' : 'Access granted 💖');
          setTimeout(() => setIsUnlocked(true), 400);
        } else {
          setShake(true);
          toast.error(t(tr.wrongPasscode, lang));
          setTimeout(() => {
            setPasscode("");
            setShake(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPasscode("");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-transparent">
      {/* ── Custom Dynamic Wallpaper Backgrounds ── */}
      {isUnlocked && (
        <>
          {/* Light Wallpaper */}
          <div
            className={`fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transition-opacity duration-1000`}
            style={{
              backgroundImage: "url('/wallpapers/wallpaper-light.webp')",
              opacity: isWallpaperDark ? 0 : 1,
            }}
          />
          {/* Dark Wallpaper */}
          <div
            className={`fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transition-opacity duration-1000`}
            style={{
              backgroundImage: "url('/wallpapers/wallpaper-dark.webp')",
              opacity: isWallpaperDark ? 1 : 0,
            }}
          />
        </>
      )}

      {/* Main Content Area */}
      <PageContainer useWallpaper={false} disableGradient={isUnlocked} className="relative z-10 flex-1 flex flex-col justify-between">
        
        {/* Passcode Screen */}
        {!isUnlocked && (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-primary/10 border-[3px] border-border flex items-center justify-center mb-4 shadow-sm">
                <Lock size={32} className="text-primary animate-pulse" />
              </div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                {t(tr.passcodeTitle, lang)}
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-2">
                {t(tr.passcodeSubtitle, lang)}
              </p>
            </div>

            {/* Dots Indicator */}
            <div 
              className={`flex justify-center gap-4 mb-12 transition-transform duration-300 ${
                shake ? 'animate-bounce text-destructive scale-105' : ''
              }`}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-[3px] border-border transition-all duration-200 ${
                    i < passcode.length
                      ? 'bg-accent border-accent scale-110 shadow-sm'
                      : 'bg-card'
                  }`}
                />
              ))}
            </div>

            {/* Numerical Keypad */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit.toString())}
                  className="w-16 h-16 rounded-2xl bg-card border-[3px] border-border text-2xl font-bold flex items-center justify-center shadow-sm hover:bg-primary/10 active:scale-95 transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="w-16 h-16 rounded-2xl bg-card border-[3px] border-border text-sm font-black text-muted-foreground flex items-center justify-center shadow-sm hover:bg-destructive/10 hover:border-destructive hover:text-destructive active:scale-95 transition-all"
              >
                C
              </button>
              <button
                onClick={() => handleDigit("0")}
                className="w-16 h-16 rounded-2xl bg-card border-[3px] border-border text-2xl font-bold flex items-center justify-center shadow-sm hover:bg-primary/10 active:scale-95 transition-all"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="w-16 h-16 rounded-2xl bg-card border-[3px] border-border text-muted-foreground flex items-center justify-center shadow-sm hover:bg-primary/10 active:scale-95 transition-all"
              >
                <Delete size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Unlocked Letter Screen */}
        {isUnlocked && (
          <div className="flex-1 flex flex-col justify-between py-4">
            
            {/* Header Navigation */}
            <div className="flex items-center justify-between w-full mb-6">
              <button
                onClick={() => {
                  if (isLetterOpen) {
                    setIsLetterOpen(false);
                    setIsWallpaperDark(false);
                  } else {
                    navigate('/');
                  }
                }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white dark:bg-card border-[3px] border-border shadow-sm hover:bg-secondary/20 transition-all active:scale-90"
              >
                <ArrowLeft size={20} className="text-primary dark:text-foreground" />
              </button>
              
              {/* Spacer matching layout */}
              <div className="w-10 h-10" />
            </div>

            {/* Letter Envelope Display */}
            <div className="flex-1 flex items-center justify-center min-h-[350px]">
              {isLetterOpen && <FallingItems />}
              {!isLetterOpen ? (
                /* Closed Envelope representation */
                <div 
                  onClick={handleOpenLetter}
                  className={cn(
                    "w-72 h-48 bg-card border-[3px] border-border rounded-3xl relative shadow-xl hover:shadow-2xl cursor-pointer group transition-all duration-1000 flex flex-col justify-between p-6 overflow-hidden",
                    isWallpaperDark ? "scale-95 opacity-0 pointer-events-none translate-y-4" : "hover:-translate-y-2 active:scale-95"
                  )}
                >
                  {/* Diagonal lines to make it look like envelope back */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="0" x2="144" y2="96" stroke="currentColor" strokeWidth="3" />
                      <line x1="288" y1="0" x2="144" y2="96" stroke="currentColor" strokeWidth="3" />
                      <line x1="0" y1="192" x2="144" y2="96" stroke="currentColor" strokeWidth="3" />
                      <line x1="288" y1="192" x2="144" y2="96" stroke="currentColor" strokeWidth="3" />
                    </svg>
                  </div>

                  <div className="text-xs font-black uppercase tracking-widest text-primary/60">
                    {lang === 'ru' ? 'Для тебя' : 'For you'}
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border-[3px] border-accent flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Heart size={28} className="text-red-500 fill-red-500 animate-pulse" />
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground text-center">
                    {t(tr.letterClosedHint, lang)}
                  </div>
                </div>
              ) : (
                /* Opened Letter view */
                <div className="w-full max-w-sm bg-[#FFFDF6] dark:bg-[#FAF6EC] border-[3px] border-border rounded-3xl p-6 shadow-2xl animate-open-letter flex flex-col max-h-[500px]">
                  {/* Seal header decoration */}
                  <div className="flex justify-center -mt-10 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500 border-[3px] border-[#FFFDF6] flex items-center justify-center shadow-md">
                      <Heart size={16} className="text-white fill-white" />
                    </div>
                  </div>

                  {/* Letter text wrapper (scrollable) */}
                  <div className="flex-1 overflow-y-auto pr-1 select-text custom-scrollbar mask-scroller scroll-smooth">
                    <p className="font-serif text-base text-[#4F2B1F] leading-relaxed whitespace-pre-line italic text-left">
                      {t(tr.letterBody, lang)}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </PageContainer>
    </div>
  );
};

export default SecretPage;
