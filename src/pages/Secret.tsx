import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { Heart, Lock, Delete, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import FallingItems from '@/components/FallingItems';
import HeartExplosion from '@/components/HeartExplosion';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PASSCODE_1 = "260626";
const PASSCODE_2 = "070726";

// ── Sealed Envelope representation (Locked) ──
const SealedEnvelope = () => (
  <div className="relative w-[240px] h-[160px] group transition-all duration-300 select-none">
    <svg width="240" height="160" viewBox="0 0 240 160" className="w-full h-full drop-shadow-md">
      {/* Background base */}
      <rect x="0" y="0" width="240" height="160" rx="16" fill="#FAF5EC" stroke="#4F2B1F" strokeWidth="3" />
      {/* Left fold */}
      <polygon points="0,0 120,80 0,160" fill="#F0E6D2" stroke="#4F2B1F" strokeWidth="2.5" />
      {/* Right fold */}
      <polygon points="240,0 120,80 240,160" fill="#F0E6D2" stroke="#4F2B1F" strokeWidth="2.5" />
      {/* Bottom fold */}
      <polygon points="0,160 120,80 240,160" fill="#E6DABF" stroke="#4F2B1F" strokeWidth="2.5" />
      {/* Top flap */}
      <polygon points="0,0 120,80 240,0" fill="#F5EBD6" stroke="#4F2B1F" strokeWidth="3" />
    </svg>
    {/* Red wax seal in the middle */}
    <div className="absolute top-[80px] left-[120px] -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-rose-600 border-[3px] border-[#4F2B1F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
      <Lock size={16} className="text-amber-100 fill-amber-100" />
    </div>
  </div>
);

// ── Unsealed Envelope representation (Unlocked) ──
const UnsealedEnvelope = ({ title }: { title: string }) => (
  <div className="relative w-[240px] h-[160px] group transition-all duration-300 select-none">
    <svg width="240" height="160" viewBox="0 0 240 160" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Background base */}
      <rect x="0" y="40" width="240" height="120" rx="16" fill="#FAF5EC" stroke="#4F2B1F" strokeWidth="3" />
      {/* Open flap pointing upwards */}
      <polygon points="0,40 120,0 240,40" fill="#FAF5EC" stroke="#4F2B1F" strokeWidth="3" />
    </svg>
    
    {/* Peeking Letter Paper */}
    <div className="absolute left-[20px] right-[20px] bottom-[28px] h-[95px] bg-[#FFFDF6] border-[3px] border-[#4F2B1F] rounded-xl shadow-inner flex flex-col items-center justify-center p-2 group-hover:-translate-y-6 transition-transform duration-500 z-10">
      <Heart size={16} className="text-red-500 fill-red-500 animate-pulse mb-1" />
      <span className="text-[10px] font-black text-rose-600 text-center tracking-tight leading-tight uppercase px-1 line-clamp-2 max-w-[180px]">
        {title}
      </span>
    </div>

    {/* Front pocket overlays (draw on top of peeking paper) */}
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg width="240" height="160" viewBox="0 0 240 160" className="w-full h-full">
        {/* Left pocket flap */}
        <polygon points="0,40 120,105 0,160" fill="#F0E6D2" stroke="#4F2B1F" strokeWidth="2.5" />
        {/* Right pocket flap */}
        <polygon points="240,40 120,105 240,160" fill="#F0E6D2" stroke="#4F2B1F" strokeWidth="2.5" />
        {/* Bottom pocket flap */}
        <polygon points="0,160 120,105 240,160" fill="#E6DABF" stroke="#4F2B1F" strokeWidth="2.5" />
      </svg>
    </div>
  </div>
);

const SecretPage = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tr = translations.secret;

  const location = useLocation();

  // Unlocked states for each letter
  const [isUnlocked1, setIsUnlocked1] = useState(false);
  const [isUnlocked2, setIsUnlocked2] = useState(false);

  useEffect(() => {
    const routerState = location.state as { unlockLetterId?: number } | null;
    if (routerState?.unlockLetterId === 1) {
      setIsUnlocked1(true);
      setActiveLetterId(1);
    } else if (routerState?.unlockLetterId === 2) {
      setIsUnlocked2(true);
      setActiveLetterId(2);
    }
  }, [location.state]);

  // Active views
  const [activeLetterId, setActiveLetterId] = useState<number | null>(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isWallpaperDark, setIsWallpaperDark] = useState(false);

  // Passcode dialog states
  const [activePasscodeLetter, setActivePasscodeLetter] = useState<number | null>(null);
  const [passcode, setPasscode] = useState("");
  const [shake, setShake] = useState(false);

  // General effects
  const [showExplosion, setShowExplosion] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  // Answers states for each letter
  const [answer1, setAnswer1] = useState<'yes' | 'no' | 'stage2' | null>(() => {
    return localStorage.getItem('secret_love_answer_1') as 'yes' | 'no' | 'stage2' | null;
  });
  const [answer2, setAnswer2] = useState<'yes' | 'no' | 'stage2' | null>(() => {
    return localStorage.getItem('secret_love_answer_2') as 'yes' | 'no' | 'stage2' | null;
  });

  const activeAnswer = activeLetterId === 1 ? answer1 : answer2;

  // Handle open letter viewport
  const handleOpenLetter = () => {
    setIsWallpaperDark(true);
    setTimeout(() => {
      setIsLetterOpen(true);
    }, 1000);
  };

  const handleYesClick = () => {
    if (activeLetterId === 1) {
      setAnswer1('yes');
      localStorage.setItem('secret_love_answer_1', 'yes');
      setShowExplosion(true);
    } else {
      if (answer2 === null) {
        setAnswer2('stage2');
        localStorage.setItem('secret_love_answer_2', 'stage2');
      } else if (answer2 === 'stage2') {
        setAnswer2('yes');
        localStorage.setItem('secret_love_answer_2', 'yes');
        setShowExplosion(true);
      }
    }
  };

  const handleNoClick = () => {
    if (activeLetterId === 1) {
      setAnswer1('no');
      localStorage.setItem('secret_love_answer_1', 'no');
    } else {
      setAnswer2('no');
      localStorage.setItem('secret_love_answer_2', 'no');
    }
    setShowExplosion(true);
    setIsVibrating(true);
    toast.error(
      lang === 'ru' ? 'Неправильный выбор! Попробуй еще раз 😜' : 'Wrong choice! Try again 😜',
      { position: 'top-center', duration: 3000 }
    );
    setTimeout(() => {
      setIsVibrating(false);
    }, 1000);
  };

  const handleClearAnswer = () => {
    if (activeLetterId === 1) {
      setAnswer1(null);
      localStorage.removeItem('secret_love_answer_1');
    } else {
      setAnswer2(null);
      localStorage.removeItem('secret_love_answer_2');
    }
  };



  // Keypad inputs listener
  useEffect(() => {
    if (activePasscodeLetter === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        setPasscode("");
        setActivePasscodeLetter(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passcode, activePasscodeLetter]);

  const handleDigit = (digit: string) => {
    if (passcode.length < 6) {
      const nextPasscode = passcode + digit;
      setPasscode(nextPasscode);

      if (nextPasscode.length === 6) {
        const targetCode = activePasscodeLetter === 1 ? PASSCODE_1 : PASSCODE_2;
        if (nextPasscode === targetCode) {
          toast.success(lang === 'ru' ? 'Доступ разрешен 💖' : 'Access granted 💖');
          setTimeout(() => {
            if (activePasscodeLetter === 1) {
              setIsUnlocked1(true);
            } else {
              setIsUnlocked2(true);
            }
            // Transition directly to State 2 (unsealed envelope view) for this letter!
            setActiveLetterId(activePasscodeLetter);
            setActivePasscodeLetter(null);
            setPasscode("");
            setShowExplosion(true);
          }, 400);
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

  const handleLetterClick = (id: number) => {
    const isUnlocked = id === 1 ? isUnlocked1 : isUnlocked2;
    if (isUnlocked) {
      setActiveLetterId(id);
      setIsLetterOpen(false);
    } else {
      setPasscode("");
      setActivePasscodeLetter(id);
    }
  };



  return (
    <div className="min-h-dvh flex flex-col relative overflow-y-auto overflow-x-hidden bg-transparent select-none">
      {/* ── Custom Dynamic Wallpaper Backgrounds ── */}
      {activeLetterId !== null && (
        <>
          {/* Light Wallpaper */}
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transition-opacity duration-1000"
            style={{
              backgroundImage: "url('/wallpapers/wallpaper-light.webp')",
              opacity: isWallpaperDark ? 0 : 1,
            }}
          />
          {/* Dark Wallpaper */}
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transition-opacity duration-1000"
            style={{
              backgroundImage: "url('/wallpapers/wallpaper-dark.webp')",
              opacity: isWallpaperDark ? 1 : 0,
            }}
          />
        </>
      )}

      {/* Main Content Area */}
      <PageContainer useWallpaper={activeLetterId === null} disableGradient={activeLetterId !== null} className="relative z-10 flex-1 flex flex-col justify-between">
        
        {/* VIEW 1: LETTERS SELECTION LIST (State 1 - Both Sealed) */}
        {activeLetterId === null && (
          <div className="flex-1 flex flex-col justify-between py-6">
            
            {/* Header */}
            <div className="flex items-center justify-between w-full mb-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-card border-[3px] border-border shadow-sm hover:bg-secondary/20 transition-all active:scale-90"
              >
                <ArrowLeft size={20} className="text-primary dark:text-foreground" />
              </button>
              <div className="text-center flex-1 mx-2">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  {t(tr.lettersTitle, lang)}
                </h1>
                <p className="text-xs text-muted-foreground font-semibold">
                  {t(tr.lettersSubtitle, lang)}
                </p>
              </div>
              <div className="w-10 h-10" />
            </div>

            {/* Selection Grid (Always shows Sealed envelopes initially) */}
            <div className="flex flex-col sm:flex-row gap-10 w-full max-w-2xl mx-auto flex-1 items-center justify-center py-6">
              
              {/* LETTER 1 */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => handleLetterClick(1)}
                  className="bg-transparent hover:scale-105 active:scale-95 transition-all duration-300 border-none p-0 cursor-pointer focus:outline-none"
                >
                  <SealedEnvelope />
                </button>
                <div className="text-center max-w-[200px]">
                  <h3 className="font-black text-sm sm:text-base text-foreground leading-snug">
                    {t(tr.letterLockedTitle, lang)}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                    {t(tr.letter1ClosedHint, lang)}
                  </p>
                </div>
              </div>

              {/* LETTER 2 */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => handleLetterClick(2)}
                  className="bg-transparent hover:scale-105 active:scale-95 transition-all duration-300 border-none p-0 cursor-pointer focus:outline-none"
                >
                  <SealedEnvelope />
                </button>
                <div className="text-center max-w-[200px]">
                  <h3 className="font-black text-sm sm:text-base text-foreground leading-snug">
                    {t(tr.letterLockedTitle, lang)}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                    {t(tr.letter2ClosedHint, lang)}
                  </p>
                </div>
              </div>

            </div>



          </div>
        )}

        {/* VIEW 2: DUAL STATE FOR SELECTED LETTER */}
        {activeLetterId !== null && (
          <div className="flex-1 flex flex-col justify-between py-4">
            
            {/* Header Navigation */}
            <div className="flex items-center justify-between w-full mb-6">
              <button
                onClick={() => {
                  if (isLetterOpen) {
                    setIsLetterOpen(false);
                    setIsWallpaperDark(false);
                  } else {
                    setActiveLetterId(null);
                  }
                }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white dark:bg-card border-[3px] border-border shadow-sm hover:bg-secondary/20 transition-all active:scale-90"
              >
                <ArrowLeft size={20} className="text-primary dark:text-foreground" />
              </button>
              
              <div className="w-10 h-10" />
            </div>

            {/* Letter Envelope Area */}
            <div className="flex-1 flex items-center justify-center min-h-[350px]">
              {isLetterOpen && <FallingItems />}
              {!isLetterOpen ? (
                /* State 2: Unsealed single envelope in center */
                <div className="flex flex-col items-center gap-6 animate-open-letter">
                  <button
                    onClick={handleOpenLetter}
                    className="bg-transparent hover:scale-105 active:scale-95 transition-all duration-300 border-none p-0 cursor-pointer focus:outline-none"
                  >
                    <UnsealedEnvelope title={activeLetterId === 1 ? t(tr.letter1UnlockedTitle, lang) : t(tr.letter2UnlockedTitle, lang)} />
                  </button>
                  <div className="text-center max-w-[240px]">
                    <h3 className="font-black text-lg text-foreground leading-snug">
                      {activeLetterId === 1 
                        ? t(tr.letter1UnlockedTitle, lang) 
                        : t(tr.letter2UnlockedTitle, lang)
                      }
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mt-1">
                      {t(tr.letterClosedHint, lang)}
                    </p>
                  </div>
                </div>
              ) : (
                /* State 3: Fully opened letter view */
                <div className="w-full flex flex-col items-center gap-6">
                  {/* Opened Letter viewport */}
                  <div className={cn(
                    "w-full max-w-sm bg-[#FFFDF6] dark:bg-[#FAF6EC] border-[3px] border-border rounded-3xl p-6 shadow-2xl animate-open-letter flex flex-col max-h-[420px] transition-all",
                    isVibrating && "animate-vibrate"
                  )}>
                    <div className="flex justify-center -mt-10 mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-500 border-[3px] border-[#FFFDF6] flex items-center justify-center shadow-md">
                        <Heart size={16} className="text-white fill-white" />
                      </div>
                    </div>

                    {/* Letter text wrapper (scrollable) */}
                    <div className="flex-1 overflow-y-auto pr-1 select-text custom-scrollbar mask-scroller scroll-smooth">
                      {(() => {
                        const contentKey = activeLetterId === 1 ? tr.letterBody : tr.letter2Body;
                        const fullText = t(contentKey, lang).trim();
                        const lastNewlineIndex = fullText.lastIndexOf('\n');
                        if (lastNewlineIndex !== -1) {
                          const bodyText = fullText.substring(0, lastNewlineIndex).trim();
                          const lastLine = fullText.substring(lastNewlineIndex).trim();
                          return (
                            <>
                              <p className="font-serif text-base text-[#4F2B1F] leading-relaxed whitespace-pre-line italic text-left">
                                {bodyText}
                              </p>
                              
                              <div className="flex items-center justify-center my-5 gap-3 pointer-events-none">
                                <span className="h-[1px] w-12 bg-[#4F2B1F]/15"></span>
                                <Heart size={14} className="text-red-500/50 fill-red-500/20 animate-pulse" />
                                <span className="h-[1px] w-12 bg-[#4F2B1F]/15"></span>
                              </div>

                              <div className="relative overflow-hidden rounded-2xl border border-rose-200/50 dark:border-rose-900/30 bg-rose-50/40 dark:bg-rose-950/10 px-4 py-3.5 text-center shadow-[0_4px_16px_-4px_rgba(244,63,94,0.08)] backdrop-blur-[0.5px]">
                                <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-rose-300/10 blur-xl pointer-events-none" />
                                <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-red-300/10 blur-xl pointer-events-none" />
                                
                                <p className="font-serif text-[18px] font-semibold text-rose-600 dark:text-rose-400 italic tracking-wide leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                                  {lastLine}
                                </p>
                              </div>
                            </>
                          );
                        }
                        return (
                          <p className="font-serif text-base text-[#4F2B1F] leading-relaxed whitespace-pre-line italic text-left">
                            {fullText}
                          </p>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Question & Answer Card */}
                  <div className="w-full max-w-sm bg-card border-[3px] border-border rounded-3xl p-6 shadow-2xl animate-open-letter flex flex-col items-center text-center relative overflow-hidden">
                    {activeAnswer === null ? (
                      /* Question 1 View */
                      <div className="w-full py-2">
                        <p className="font-serif text-[18px] font-black text-foreground mb-6">
                          {activeLetterId === 1 ? t(tr.letter1Question, lang) : t(tr.letter2Question, lang)}
                        </p>
                        <div className="flex justify-center gap-4 w-full">
                          <button
                            onClick={handleYesClick}
                            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-base shadow-md transition-all duration-150 flex items-center justify-center gap-2"
                          >
                            <Heart size={16} className="fill-white text-white animate-pulse" />
                            {lang === 'ru' ? 'Да' : 'Yes'}
                          </button>
                          
                          <button
                            onClick={handleNoClick}
                            className="flex-1 py-3 rounded-2xl bg-slate-600 hover:bg-slate-700 active:scale-95 text-white font-bold text-base shadow-md transition-all duration-150"
                          >
                            {lang === 'ru' ? 'Нет' : 'No'}
                          </button>
                        </div>
                      </div>
                    ) : activeAnswer === 'stage2' && activeLetterId === 2 ? (
                      /* Question 2 View */
                      <div className="w-full py-2 animate-open-letter">
                        <p className="font-serif text-[18px] font-black text-foreground mb-6">
                          {t(tr.dateQuestion, lang)}
                        </p>
                        <div className="flex justify-center gap-4 w-full">
                          <button
                            onClick={handleYesClick}
                            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-base shadow-md transition-all duration-150 flex items-center justify-center gap-2"
                          >
                            <Heart size={16} className="fill-white text-white animate-pulse" />
                            {lang === 'ru' ? 'Да' : 'Yes'}
                          </button>
                          
                          <button
                            onClick={handleNoClick}
                            className="flex-1 py-3 rounded-2xl bg-slate-600 hover:bg-slate-700 active:scale-95 text-white font-bold text-base shadow-md transition-all duration-150"
                          >
                            {lang === 'ru' ? 'Нет' : 'No'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Answer Outcome View */
                      <div className="w-full flex flex-col items-center animate-open-letter">
                        <div className="w-full max-w-[200px] aspect-square rounded-2xl overflow-hidden border-[3px] border-border shadow-md bg-white dark:bg-card flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-105">
                          <img
                            src={activeAnswer === 'yes' ? `/Questions/letter${activeLetterId}_yes.jpg` : `/Questions/letter${activeLetterId}_no.jpg`}
                            alt={activeAnswer === 'yes' ? 'Happy' : 'Sad'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <p className={cn(
                          "font-serif text-lg font-black leading-relaxed px-2 mb-6",
                          activeAnswer === 'yes' ? "text-red-500 dark:text-red-400" : "text-slate-600 dark:text-slate-400"
                        )}>
                          {activeAnswer === 'yes' 
                            ? 'И я тебя люблю, диер)'
                            : 'Неправильно, попробуй ещё раз('
                          }
                        </p>

                        {activeAnswer === 'no' && (
                          <div className="flex justify-center w-full mt-2">
                            <button
                              onClick={handleClearAnswer}
                              className="px-8 py-2.5 rounded-2xl border-[3px] border-border bg-white dark:bg-card text-foreground hover:bg-secondary/20 active:scale-95 font-bold text-sm tracking-wide shadow-sm transition-all duration-150"
                            >
                              {lang === 'ru' ? 'Корошо' : 'Fine'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </PageContainer>

      {/* ── Keypad Passcode Entry Dialog Modal ── */}
      <Dialog open={activePasscodeLetter !== null} onOpenChange={(open) => !open && setActivePasscodeLetter(null)}>
        <DialogContent className="max-w-[90vw] sm:max-w-[320px] rounded-3xl border-[3px] border-border bg-card p-6 shadow-2xl flex flex-col items-center select-none focus:outline-none">
          <DialogHeader className="text-center w-full">
            <DialogTitle className="text-xl font-black text-foreground">
              {t(tr.passcodeTitle, lang)}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-semibold mt-1">
              {t(tr.passcodeSubtitle, lang)}
            </DialogDescription>
          </DialogHeader>

          {/* Dots Indicator */}
          <div 
            className={cn(
              "flex justify-center gap-3 my-6 transition-transform duration-300",
              shake && 'animate-bounce text-destructive scale-105'
            )}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3.5 h-3.5 rounded-full border-[3px] border-border transition-all duration-200",
                  i < passcode.length
                    ? 'bg-accent border-accent scale-110 shadow-sm'
                    : 'bg-card'
                )}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit.toString())}
                className="w-14 h-14 rounded-2xl bg-card border-[3px] border-border text-xl font-black flex items-center justify-center shadow-sm hover:bg-primary/10 active:scale-95 transition-all"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="w-14 h-14 rounded-2xl bg-card border-[3px] border-border text-[11px] font-black text-muted-foreground flex items-center justify-center shadow-sm hover:bg-destructive/10 hover:border-destructive hover:text-destructive active:scale-95 transition-all"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => handleDigit("0")}
              className="w-14 h-14 rounded-2xl bg-card border-[3px] border-border text-xl font-black flex items-center justify-center shadow-sm hover:bg-primary/10 active:scale-95 transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="w-14 h-14 rounded-2xl bg-card border-[3px] border-border text-muted-foreground flex items-center justify-center shadow-sm hover:bg-primary/10 active:scale-95 transition-all"
            >
              <Delete size={18} />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Heart Explosion Particles */}
      {showExplosion && (
        <HeartExplosion 
          chars={activeAnswer === 'yes' ? undefined : ['💔', '🥀', '🥺', '🌧️']}
          onComplete={() => setShowExplosion(false)} 
        />
      )}
    </div>
  );
};

export default SecretPage;
