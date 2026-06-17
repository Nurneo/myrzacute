import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format, isAfter, startOfDay, addDays, subDays, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Heart, Lock, Unlock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { dailyMessages } from '@/content';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';

// First available date in the data
const FIRST_DATE = new Date(2026, 5, 1); // June 1 2026

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { lang } = useLang();
  const tr = translations.calendar;

  const today = startOfDay(new Date());
  const isLocked = isAfter(startOfDay(date), today);

  const selectedDateString = format(date, 'yyyy-MM-dd');
  const dailyContent = dailyMessages.find(m => m.date === selectedDateString);

  const dateLocale = lang === 'ru' ? ru : undefined;

  // Navigate day by day — clamp to FIRST_DATE on the left
  const goToPrev = () => {
    setDate(prev => {
      const candidate = subDays(prev, 1);
      return isBefore(candidate, FIRST_DATE) ? FIRST_DATE : candidate;
    });
  };

  const goToNext = () => {
    setDate(prev => addDays(prev, 1));
  };

  // Only allow selecting days from June 2026 onward; block outside/empty cells
  const handleSelect = (d: Date | undefined) => {
    if (!d) return;
    if (isBefore(startOfDay(d), FIRST_DATE)) return;
    setDate(d);
  };

  return (
    <PageContainer>
      <SectionHeader
        title={t(tr.title, lang)}
        subtitle={t(tr.subtitle, lang)}
      />

      <div className="space-y-6">
        {/* Calendar Card */}
        <Card className="border-[3px] border-border shadow-sm overflow-hidden bg-card rounded-3xl">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              defaultMonth={date}
              locale={dateLocale}
              weekStartsOn={1}
              showOutsideDays={false}
              disabled={{ before: FIRST_DATE }}
              className="rounded-md border-none"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-2 w-full",
                month_caption: "flex justify-center pt-1 relative items-center mb-2",
                caption_label: "text-sm font-black tracking-wide uppercase",
                nav: "space-x-1 flex items-center",
                button_previous: "absolute left-1 h-8 w-8 bg-transparent border-[2px] border-border rounded-xl flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity",
                button_next: "absolute right-1 h-8 w-8 bg-transparent border-[2px] border-border rounded-xl flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity",
                month_grid: "w-full border-collapse",
                weekdays: "flex",
                weekday: "text-muted-foreground rounded-md flex-1 font-bold text-[0.7rem] text-center py-1",
                week: "flex w-full mt-1",
                day: "flex-1 h-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected])]:rounded-xl focus-within:relative focus-within:z-20",
                day_button: "w-full h-10 p-0 font-semibold rounded-xl transition-all duration-200 hover:bg-primary/20 hover:scale-105 aria-selected:opacity-100",
                selected: "bg-primary text-primary-foreground rounded-xl shadow-md scale-105 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                today: "bg-secondary text-primary font-black ring-2 ring-primary/40 rounded-xl",
                outside: "opacity-0 pointer-events-none",
                disabled: "text-muted-foreground/30 pointer-events-none",
                hidden: "invisible pointer-events-none",
              }}
            />
          </CardContent>
        </Card>

        {/* Status Card */}
        <div className="relative">
          {isLocked ? (
            /* ─── LOCKED ─── */
            <Card className="border-[3px] border-border rounded-3xl overflow-hidden bg-secondary/60">
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-border/20" />
                <div className="absolute -bottom-8 -left-8 w-52 h-52 rounded-full bg-border/10" />
                {[...Array(6)].map((_, i) => (
                  <Lock
                    key={i}
                    size={28}
                    className="absolute text-border/20"
                    style={{
                      top: `${[10, 30, 55, 20, 65, 40][i]}%`,
                      left: `${[5, 25, 10, 70, 55, 85][i]}%`,
                      transform: `rotate(${[-10, 5, -5, 15, -8, 3][i]}deg)`,
                    }}
                  />
                ))}
              </div>

              <CardContent className="p-8 text-center relative z-10">
                {/* Arrow navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={goToPrev}
                    className="w-10 h-10 rounded-2xl border-[3px] border-border bg-card/60 flex items-center justify-center hover:bg-card transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Previous day"
                  >
                    <ChevronLeft size={18} className="text-muted-foreground" />
                  </button>
                  <div className="flex-1 mx-3">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {format(date, 'EEEE', { locale: dateLocale })}
                    </p>
                    <h3 className="text-2xl font-black text-muted-foreground/80 tracking-tighter">
                      {format(date, lang === 'ru' ? 'd MMMM yyyy' : 'MMMM d, yyyy', { locale: dateLocale })}
                    </h3>
                  </div>
                  <button
                    onClick={goToNext}
                    className="w-10 h-10 rounded-2xl border-[3px] border-border bg-card/60 flex items-center justify-center hover:bg-card transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Next day"
                  >
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-border/30 border-[3px] border-border mb-3 shadow-inner">
                  <Lock size={30} className="text-muted-foreground" strokeWidth={2.5} />
                </div>

                <div className="inline-flex items-center gap-1.5 bg-border/20 border-[2px] border-border rounded-full px-3 py-1 mb-4">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {t(tr.locked, lang)}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t-[3px] border-border/50">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    &ldquo;{t(tr.lockedQuote, lang)}&rdquo;
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* ─── UNLOCKED ─── */
            <Card className="border-[3px] border-border rounded-3xl overflow-hidden bg-primary/10">
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-primary/10" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-primary/5" />
                <Heart
                  size={90}
                  fill="currentColor"
                  className="absolute -bottom-3 -right-3 text-primary/10"
                />
              </div>

              <CardContent className="p-8 text-center relative z-10">
                {/* Arrow navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={goToPrev}
                    className="w-10 h-10 rounded-2xl border-[3px] border-border bg-card/60 flex items-center justify-center hover:bg-primary/20 transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Previous day"
                  >
                    <ChevronLeft size={18} className="text-primary" />
                  </button>
                  <div className="flex-1 mx-3">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                      {format(date, 'EEEE', { locale: dateLocale })}
                    </p>
                    <h3 className="text-2xl font-black text-foreground tracking-tighter">
                      {format(date, lang === 'ru' ? 'd MMMM yyyy' : 'MMMM d, yyyy', { locale: dateLocale })}
                    </h3>
                  </div>
                  <button
                    onClick={goToNext}
                    className="w-10 h-10 rounded-2xl border-[3px] border-border bg-card/60 flex items-center justify-center hover:bg-primary/20 transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Next day"
                  >
                    <ChevronRight size={18} className="text-primary" />
                  </button>
                </div>

                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border-[3px] border-border mb-3 shadow-sm">
                  <Unlock size={28} className="text-primary" strokeWidth={2.5} />
                </div>

                <div className="inline-flex items-center gap-1.5 bg-primary/20 border-[2px] border-primary/40 rounded-full px-3 py-1 mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                    {t(tr.unlocked, lang)}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t-[3px] border-border">
                  {dailyContent ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                      <div className="inline-flex items-center gap-1.5 mb-1">
                        <Sparkles size={14} className="text-primary" />
                        <h4 className="font-black text-lg text-primary">{dailyContent.title}</h4>
                        <Sparkles size={14} className="text-primary" />
                      </div>
                      <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-2xl border-[3px] border-border">
                        <p className="text-base text-foreground font-medium leading-relaxed">
                          &ldquo;{dailyContent.message}&rdquo;
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in space-y-2">
                      <div className="inline-flex items-center gap-2 mb-1">
                        <Heart size={16} className="text-primary" fill="currentColor" />
                        <span className="text-sm font-bold text-primary">{t(tr.freeDay, lang)}</span>
                        <Heart size={16} className="text-primary" fill="currentColor" />
                      </div>
                      <div className="bg-primary/10 p-4 rounded-2xl border-[3px] border-border">
                        <p className="text-sm text-foreground/80 italic leading-relaxed">
                          &ldquo;{t(tr.freeDayNote, lang)}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default CalendarPage;
