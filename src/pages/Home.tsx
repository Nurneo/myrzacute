"use client";

import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart, Flame, Quote, Sun, Moon, Globe, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dailyMessages } from '@/content/dailyMessages';
import { format } from 'date-fns';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import FeedbackModal from '@/components/FeedbackModal';
import CoupleGallery from '@/components/CoupleGallery';
import { fetchFeedback } from '@/utils/feedbackStorage';
import { toggleThemeWithRipple } from '@/utils/themeTransition';

// Weighted word pool — львица is dominant
const WORDS_RU = [
  'львица', 'львица', 'львица', 'львица', 'львица',
  'тигрица', 'гелендваген', 'ламборгини',
  'красавица', 'качок', 'диер', 'мырзахан',
];
const WORDS_EN = [
  'lioness', 'lioness', 'lioness', 'lioness', 'lioness',
  'tigress', 'G-wagon', 'Lambo',
  'beauty', 'swole queen', 'dear', 'myrzakhan',
];

function pickRandom<T>(arr: T[], exclude?: T): T {
  const pool = exclude !== undefined ? arr.filter(w => w !== exclude) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

function useTypewriter(target: string, speed = 60) {
  const [displayed, setDisplayed] = useState(target);
  const [typing, setTyping] = useState(false);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (prevTarget.current === target) return;
    prevTarget.current = target;
    setTyping(true);
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      i++;
      setDisplayed(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [target, speed]);

  return { displayed, typing };
}

const Home = () => {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Listen to keystrokes to redirect on passcode
  useEffect(() => {
    let keysPressed = '';
    const PASSCODE_1 = '260626';
    const PASSCODE_2 = '070726';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        keysPressed += e.key;
        if (keysPressed.length > 6) {
          keysPressed = keysPressed.slice(-6);
        }
        if (keysPressed === PASSCODE_1) {
          navigate('/secret', { state: { unlockLetterId: 1 } });
        } else if (keysPressed === PASSCODE_2) {
          navigate('/secret', { state: { unlockLetterId: 2 } });
        }
      } else {
        keysPressed = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const tr = translations.home;
  const trSettings = translations.settings;
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodImgError, setMoodImgError] = useState(false);

  const [timeDiff, setTimeDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const START_DATE = new Date("2026-07-07T23:30:00");
    const calculateDiff = () => {
      const now = new Date();
      const diffMs = now.getTime() - START_DATE.getTime();
      
      if (diffMs < 0) {
        setTimeDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeDiff({ days, hours, minutes, seconds });
    };

    calculateDiff();
    const timer = setInterval(calculateDiff, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadHomeMood = async () => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const data = await fetchFeedback(todayStr);
      if (active) {
        setSelectedMood(data.mood);
      }
    };
    loadHomeMood();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setMoodImgError(false);
  }, [selectedMood]);

  const words = lang === 'ru' ? WORDS_RU : WORDS_EN;
  const [currentWord, setCurrentWord] = useState(() => pickRandom(words));
  const { displayed, typing } = useTypewriter(currentWord, 55);

  // Rotate every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWord(prev => pickRandom(lang === 'ru' ? WORDS_RU : WORDS_EN, prev));
    }, 20000);
    return () => clearInterval(timer);
  }, [lang]);

  // When language changes, pick a fresh word immediately
  useEffect(() => {
    setCurrentWord(pickRandom(lang === 'ru' ? WORDS_RU : WORDS_EN));
  }, [lang]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const messageOfTheDay = dailyMessages.find(m => m.date === todayStr)?.message || t(tr.messageFallback, lang);

  const features = [
    {
      title: t(tr.features.calendar.title, lang),
      description: t(tr.features.calendar.description, lang),
      icon: Calendar,
      color: "bg-secondary text-primary",
      path: "/calendar",
    },
    {
      title: t(tr.features.pickupLines.title, lang),
      description: t(tr.features.pickupLines.description, lang),
      icon: Heart,
      color: "bg-red-500/10 text-red-500",
      path: "/pickup-lines",
    },
    {
      title: t(tr.features.roasts.title, lang),
      description: t(tr.features.roasts.description, lang),
      icon: Flame,
      color: "bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400",
      path: "/roasts",
    },
    {
      title: t(tr.features.importantDates.title, lang),
      description: t(tr.features.importantDates.description, lang),
      icon: Sparkles,
      color: "bg-yellow-100 text-yellow-500 dark:bg-yellow-500/10 dark:text-yellow-400",
      path: "/important-dates",
    },
  ];

  return (
    <PageContainer>
      {/* ── Top Header with Compact Theme & Language Switches ── */}
      <header className="mb-6 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">MYRZACUTE</h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium">
            {lang === 'ru' ? 'С возвращением, ' : 'Welcome back, '}
            <span className="text-primary font-bold">
              {displayed}
              {typing && (
                <span className="inline-block w-[2px] h-[1em] bg-primary align-middle ml-[1px] animate-pulse" />
              )}
            </span>
            .
          </p>
        </div>

        {/* Compact Controls in Top-Right Corner */}
        <div className="flex items-center gap-2">
          {/* Sun/Moon Theme Toggle */}
          <button
            onClick={(e) => toggleThemeWithRipple(e, setTheme, isDark)}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-2xl bg-card border-[3px] border-border flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm text-foreground hover:bg-primary/10"
            title={isDark ? (lang === 'ru' ? 'Дневной режим' : 'Light Mode') : (lang === 'ru' ? 'Ночной режим' : 'Dark Mode')}
          >
            {isDark ? (
              <Sun size={20} className="text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon size={20} className="text-indigo-600 fill-indigo-600/20" />
            )}
          </button>

          {/* Language Switch Badge */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            aria-label="Toggle language"
            className="h-10 px-3 rounded-2xl bg-card border-[3px] border-border flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm text-foreground hover:bg-primary/10 font-black text-xs"
            title={lang === 'en' ? 'Switch to Russian' : 'Switch to English'}
          >
            <Globe size={16} className="text-primary" />
            <span>{lang === 'en' ? 'EN' : 'RU'}</span>
          </button>
        </div>
      </header>

      {/* ── "How u doin" / "Как настроение" Section ── */}
      <div 
        className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out"
        style={{ animationDelay: '150ms', animationFillMode: 'both' }}
      >
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">{t(tr.exploreTitle, lang)}</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">{t(tr.exploreSubtitle, lang)}</p>
        </div>
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className={cn(
            "w-12 h-12 rounded-2xl bg-card border-[3px] border-border text-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm hover:bg-primary/10",
            selectedMood && "bg-primary text-primary-foreground border-primary"
          )}
          title={t(translations.home.feedback.title, lang)}
        >
          {selectedMood ? (
            moodImgError ? (
              <span className="select-none">🦁</span>
            ) : (
              <img
                src={`/moods/mood${selectedMood}.svg`}
                alt="Current Mood"
                className="w-8 h-8 object-contain"
                loading="lazy"
                decoding="async"
                onError={() => setMoodImgError(true)}
              />
            )
          ) : (
            <span className="select-none">🦁</span>
          )}
        </button>
      </div>

      {/* ── Daily Message ── */}
      <div 
        className="mb-8 relative animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out"
        style={{ animationDelay: '300ms', animationFillMode: 'both' }}
      >
        <div className="absolute -top-4 -left-2 opacity-10 text-primary">
          <Quote size={48} fill="currentColor" />
        </div>
        <div className="bg-primary/5 rounded-3xl p-6 sm:p-7 border-[3px] border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">
            {t(tr.messageDayLabel, lang)}
          </p>
          <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed italic">
            &ldquo;{messageOfTheDay}&rdquo;
          </p>
        </div>
      </div>

      {/* ── Main Features Grid (Calendar, Pickup Lines, Roasts, Important Dates) ── */}
      <div className="grid grid-cols-1 gap-3.5 mb-8">
        {features.map((feature, index) => (
          <Link 
            key={feature.path} 
            to={feature.path}
            className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out"
            style={{
              animationDelay: `${450 + index * 80}ms`,
              animationFillMode: 'both',
            }}
          >
            <Card className="overflow-hidden border-[3px] border-border shadow-sm hover:shadow-md hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,235,175,0.12)] transition-all cursor-pointer group active:scale-[0.98]">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Couple Date Gallery Component (Placed below Important Dates, above Love-Timer) ── */}
      <CoupleGallery />

      {/* ── Day Counter Card (Love-Timer at Bottom — Click anywhere to enter Secret Page) ── */}
      <div 
        onClick={() => navigate('/secret')}
        title={lang === 'ru' ? 'Нажми, чтобы открыть секретную страницу' : 'Click to open Secret page'}
        className="mb-8 cursor-pointer group animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out"
        style={{ animationDelay: '850ms', animationFillMode: 'both' }}
      >
        <Card className="border-[3px] border-border bg-gradient-to-br from-red-500/5 via-rose-500/5 to-pink-500/10 dark:from-red-500/10 dark:via-rose-500/10 dark:to-pink-500/20 shadow-md hover:shadow-xl hover:border-red-500/40 transition-all duration-300 rounded-3xl overflow-hidden relative group active:scale-[0.99]">
          <div className="absolute top-4 right-4 text-red-500/20 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
            <Heart size={90} className="fill-red-500/10" />
          </div>
          
          <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center relative z-10">
            <span className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/10 text-red-500 mb-3 animate-pulse group-hover:scale-110 transition-transform">
              <Heart size={26} className="fill-red-500" />
            </span>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
              {t(tr.dayCounter.title, lang)}
            </p>
            <h2 className="text-sm font-bold text-foreground opacity-80 mb-3">
              {t(tr.dayCounter.subtitle, lang)}
            </h2>
            
            {/* Live Ticker Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm w-full mt-2">
              <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-2xl bg-card/90 border-[3px] border-border shadow-sm group-hover:border-red-500/30 transition-colors">
                <span className="text-xl sm:text-2xl font-black text-primary leading-tight">
                  {timeDiff.days}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
                  {t(tr.dayCounter.days, lang)}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-2xl bg-card/90 border-[3px] border-border shadow-sm group-hover:border-red-500/30 transition-colors">
                <span className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                  {String(timeDiff.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
                  {t(tr.dayCounter.hours, lang)}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-2xl bg-card/90 border-[3px] border-border shadow-sm group-hover:border-red-500/30 transition-colors">
                <span className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                  {String(timeDiff.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
                  {t(tr.dayCounter.minutes, lang)}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-2xl bg-card/90 border-[3px] border-border shadow-sm group-hover:border-red-500/30 transition-colors">
                <span className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                  {String(timeDiff.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
                  {t(tr.dayCounter.seconds, lang)}
                </span>
              </div>
            </div>

            <p className="text-[11px] font-bold text-red-500/80 mt-4 tracking-wide group-hover:text-red-500 transition-colors flex items-center gap-1">
              <span>🔒</span>
              <span>{lang === 'ru' ? 'Нажмите, чтобы открыть секрет' : 'Click to enter Secret Page'}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={(updatedMood) => {
          setIsFeedbackOpen(false);
          if (updatedMood !== undefined) {
            setSelectedMood(updatedMood);
          }
        }} 
      />
    </PageContainer>
  );
};

export default Home;
