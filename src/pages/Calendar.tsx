import React, { useState, useMemo } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { format, isAfter, startOfDay, addDays, subDays, isBefore, getDaysInMonth, getDay, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Heart, Lock, Unlock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { dailyMessages } from '@/content';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { cn } from '@/lib/utils';

const FIRST_DATE = new Date(2026, 5, 1); // June 1 2026
const WEEK_DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WEEK_DAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const CalendarPage = () => {
  const today = startOfDay(new Date());
  const [selected, setSelected] = useState<Date>(today);
  const [viewMonth, setViewMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const { lang } = useLang();
  const tr = translations.calendar;
  const dateLocale = lang === 'ru' ? ru : undefined;

  const isLocked = isAfter(startOfDay(selected), today);
  const selectedDateString = format(selected, 'yyyy-MM-dd');
  const dailyContent = dailyMessages.find(m => m.date === selectedDateString);

  // Build the grid for viewMonth
  const { days, monthLabel } = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const total = getDaysInMonth(viewMonth);
    // Monday-based: getDay returns 0=Sun..6=Sat, convert to Mon=0..Sun=6
    const firstWeekday = (getDay(new Date(year, month, 1)) + 6) % 7;
    const label = format(viewMonth, lang === 'ru' ? 'LLLL yyyy' : 'MMMM yyyy', { locale: dateLocale });
    const cells: (Date | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: total }, (_, i) => new Date(year, month, i + 1)),
    ];
    // Pad to full rows
    while (cells.length % 7 !== 0) cells.push(null);
    return { days: cells, monthLabel: label };
  }, [viewMonth, lang, dateLocale]);

  const canGoPrev = !isBefore(
    new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
    new Date(FIRST_DATE.getFullYear(), FIRST_DATE.getMonth(), 1)
  );

  const prevMonth = () => {
    if (!canGoPrev) return;
    setViewMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const nextMonth = () => setViewMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleDayClick = (day: Date | null) => {
    if (!day) return;
    if (isBefore(startOfDay(day), FIRST_DATE)) return;
    setSelected(day);
  };

  const goToPrev = () => {
    setSelected(prev => {
      const candidate = subDays(prev, 1);
      if (isBefore(candidate, FIRST_DATE)) return prev;
      // Also update viewMonth if we cross a month boundary
      if (candidate.getMonth() !== prev.getMonth()) {
        setViewMonth(new Date(candidate.getFullYear(), candidate.getMonth(), 1));
      }
      return candidate;
    });
  };

  const goToNext = () => {
    setSelected(prev => {
      const next = addDays(prev, 1);
      if (next.getMonth() !== prev.getMonth()) {
        setViewMonth(new Date(next.getFullYear(), next.getMonth(), 1));
      }
      return next;
    });
  };

  const weekDays = lang === 'ru' ? WEEK_DAYS_RU : WEEK_DAYS_EN;

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">
          {t(tr.title, lang)}
        </h1>
        <p className="text-sm text-primary mt-1 font-medium">
          {t(tr.subtitle, lang)}
        </p>
      </div>

      <div className="space-y-4">
        {/* ── Calendar Card ── */}
        <div className="rounded-3xl border-[3px] border-border bg-card overflow-hidden shadow-sm">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <button
              onClick={prevMonth}
              disabled={!canGoPrev}
              className="w-9 h-9 rounded-2xl border-[3px] border-border bg-background/40 flex items-center justify-center transition-all duration-200 hover:bg-primary/20 active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} className="text-primary" />
            </button>
            <span className="font-black text-sm uppercase tracking-[0.15em] text-primary">
              {monthLabel}
            </span>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-2xl border-[3px] border-border bg-background/40 flex items-center justify-center transition-all duration-200 hover:bg-primary/20 active:scale-95"
            >
              <ChevronRight size={16} className="text-primary" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 px-3 pb-1">
            {weekDays.map(d => (
              <div key={d} className="text-center text-[11px] font-black uppercase tracking-wider text-primary/60 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-1 px-3 pb-5">
            {days.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="h-11" />;
              }

              const dayStart = startOfDay(day);
              const isBeforeFirst = isBefore(dayStart, FIRST_DATE);
              const isToday = isSameDay(day, today);
              const isSelected = isSameDay(day, selected);
              const isFuture = isAfter(dayStart, today);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  disabled={isBeforeFirst}
                  className={cn(
                    'relative h-11 w-full flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all duration-200',
                    // Base state
                    !isBeforeFirst && 'cursor-pointer',
                    isBeforeFirst && 'opacity-20 pointer-events-none',
                    // Not selected hover
                    !isSelected && !isBeforeFirst && 'hover:bg-primary/20 hover:scale-105 active:scale-95',
                    // Today indicator (not selected)
                    isToday && !isSelected && 'ring-2 ring-primary/60 ring-inset text-primary',
                    // Future (locked) days
                    isFuture && !isSelected && 'text-primary/50',
                    // Past/today (unlocked)
                    !isFuture && !isSelected && !isToday && 'text-primary',
                    // Selected
                    isSelected && 'bg-primary text-primary-foreground scale-105 shadow-lg ring-2 ring-primary/40 ring-offset-1 ring-offset-card',
                  )}
                >
                  <span>{day.getDate()}</span>
                  {/* Dot for days that have a message */}
                  {!isFuture && dailyMessages.some(m => m.date === format(day, 'yyyy-MM-dd')) && (
                    <span className={cn(
                      'absolute bottom-1 w-1 h-1 rounded-full',
                      isSelected ? 'bg-primary-foreground/70' : 'bg-primary/60'
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Status / Message Card ── */}
        {isLocked ? (
          <div className="rounded-3xl border-[3px] border-border bg-secondary/60 overflow-hidden shadow-sm">
            {/* Decorative blobs */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-3xl">
              {[...Array(5)].map((_, i) => (
                <Lock
                  key={i}
                  size={24}
                  className="absolute text-border/20"
                  style={{ top: `${[12, 40, 60, 25, 70][i]}%`, left: `${[8, 70, 20, 85, 55][i]}%` }}
                />
              ))}
            </div>

            <div className="p-6 relative z-10">
              {/* Nav row */}
              <div className="flex items-center gap-3 mb-5">
                <button onClick={goToPrev} className="w-10 h-10 rounded-2xl border-[3px] border-border bg-card/50 flex items-center justify-center hover:bg-card transition-all duration-200 hover:scale-105 active:scale-95">
                  <ChevronLeft size={18} className="text-muted-foreground" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {format(selected, 'EEEE', { locale: dateLocale })}
                  </p>
                  <p className="text-xl font-black text-muted-foreground/80 tracking-tight">
                    {format(selected, lang === 'ru' ? 'd MMMM yyyy' : 'MMMM d, yyyy', { locale: dateLocale })}
                  </p>
                </div>
                <button onClick={goToNext} className="w-10 h-10 rounded-2xl border-[3px] border-border bg-card/50 flex items-center justify-center hover:bg-card transition-all duration-200 hover:scale-105 active:scale-95">
                  <ChevronRight size={18} className="text-muted-foreground" />
                </button>
              </div>

              {/* Lock badge */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-border/30 border-[3px] border-border flex items-center justify-center shadow-inner">
                  <Lock size={26} className="text-muted-foreground" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-2 bg-border/20 border-[2px] border-border rounded-full px-4 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {t(tr.locked, lang)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground/70 italic text-center leading-relaxed pt-1">
                  &ldquo;{t(tr.lockedQuote, lang)}&rdquo;
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border-[3px] border-border bg-card overflow-hidden shadow-sm">
            <div className="p-6">
              {/* Nav row */}
              <div className="flex items-center gap-3 mb-5">
                <button onClick={goToPrev} className="w-10 h-10 rounded-2xl border-[3px] border-border bg-background/40 flex items-center justify-center hover:bg-primary/20 transition-all duration-200 hover:scale-105 active:scale-95">
                  <ChevronLeft size={18} className="text-primary" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                    {format(selected, 'EEEE', { locale: dateLocale })}
                  </p>
                  <p className="text-xl font-black text-foreground tracking-tight">
                    {format(selected, lang === 'ru' ? 'd MMMM yyyy' : 'MMMM d, yyyy', { locale: dateLocale })}
                  </p>
                </div>
                <button onClick={goToNext} className="w-10 h-10 rounded-2xl border-[3px] border-border bg-background/40 flex items-center justify-center hover:bg-primary/20 transition-all duration-200 hover:scale-105 active:scale-95">
                  <ChevronRight size={18} className="text-primary" />
                </button>
              </div>

              {/* Unlock badge */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 border-[3px] border-border flex items-center justify-center shadow-sm">
                  <Unlock size={26} className="text-primary" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-2 bg-primary/20 border-[2px] border-primary/40 rounded-full px-4 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                    {t(tr.unlocked, lang)}
                  </span>
                </div>

                {/* Message */}
                {dailyContent ? (
                  <div className="w-full mt-1 space-y-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <Sparkles size={13} className="text-primary" />
                      <span className="font-black text-base text-primary">{dailyContent.title}</span>
                      <Sparkles size={13} className="text-primary" />
                    </div>
                    <div className="bg-primary/10 border-[3px] border-border rounded-2xl p-4">
                      <p className="text-sm text-foreground font-medium leading-relaxed text-center">
                        &ldquo;{dailyContent.message}&rdquo;
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full mt-1">
                    <div className="bg-primary/10 border-[3px] border-border rounded-2xl p-4 flex items-center justify-center gap-2">
                      <Heart size={14} className="text-primary" fill="currentColor" />
                      <p className="text-sm text-foreground/80 italic">
                        {t(tr.freeDay, lang)}
                      </p>
                      <Heart size={14} className="text-primary" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CalendarPage;
