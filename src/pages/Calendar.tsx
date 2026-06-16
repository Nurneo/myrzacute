import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format, isAfter, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon, Heart, Lock, Unlock, Sparkles } from 'lucide-react';
import { dailyMessages } from '@/content';

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const today = startOfDay(new Date());
  const isLocked = date ? isAfter(startOfDay(date), today) : false;

  const selectedDateString = date ? format(date, 'yyyy-MM-dd') : '';
  const dailyContent = dailyMessages.find(m => m.date === selectedDateString);

  return (
    <PageContainer>
      <SectionHeader
        title="Наш календарь"
        subtitle="Каждый день с тобой — подарок"
      />

      <div className="space-y-6">
        {/* Calendar Card */}
        <Card className="border-[3px] border-border shadow-sm overflow-hidden bg-card rounded-3xl">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={new Date()}
              locale={ru}
              weekStartsOn={1}
              className="rounded-md border-none"
              classNames={{
                day_selected:
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-secondary text-primary font-bold',
              }}
            />
          </CardContent>
        </Card>

        {/* Status Card */}
        {date && (
          <div className="relative">
            {isLocked ? (
              /* ─── LOCKED ─── */
              <Card className="border-[3px] border-border rounded-3xl overflow-hidden bg-secondary/60">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                  <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-border/20" />
                  <div className="absolute -bottom-8 -left-8 w-52 h-52 rounded-full bg-border/10" />
                  {/* Repeating lock icons as watermark */}
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
                  {/* Lock icon badge */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-border/30 border-[3px] border-border mb-4 shadow-inner">
                    <Lock size={30} className="text-muted-foreground" strokeWidth={2.5} />
                  </div>

                  {/* Status pill */}
                  <div className="inline-flex items-center gap-1.5 bg-border/20 border-[2px] border-border rounded-full px-3 py-1 mb-4">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Закрыто
                    </span>
                  </div>

                  {/* Date display */}
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {format(date, 'EEEE', { locale: ru })}
                  </p>
                  <h3 className="text-3xl font-black text-muted-foreground/80 tracking-tighter">
                    {format(date, 'd MMMM yyyy', { locale: ru })}
                  </h3>

                  {/* Locked message */}
                  <div className="mt-6 pt-6 border-t-[3px] border-border/50">
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "Терпение, красавица. Этот сюрприз ждёт своего момента."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* ─── UNLOCKED ─── */
              <Card className="border-[3px] border-border rounded-3xl overflow-hidden bg-primary/10">
                {/* Decorative background */}
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
                  {/* Unlock icon badge */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border-[3px] border-border mb-4 shadow-sm">
                    <Unlock size={28} className="text-primary" strokeWidth={2.5} />
                  </div>

                  {/* Status pill */}
                  <div className="inline-flex items-center gap-1.5 bg-primary/20 border-[2px] border-primary/40 rounded-full px-3 py-1 mb-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                      Открыто
                    </span>
                  </div>

                  {/* Date display */}
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">
                    {format(date, 'EEEE', { locale: ru })}
                  </p>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter">
                    {format(date, 'd MMMM yyyy', { locale: ru })}
                  </h3>

                  {/* Unlocked content */}
                  <div className="mt-6 pt-6 border-t-[3px] border-border">
                    {dailyContent ? (
                      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="inline-flex items-center gap-1.5 mb-1">
                          <Sparkles size={14} className="text-primary" />
                          <h4 className="font-black text-lg text-primary">{dailyContent.title}</h4>
                          <Sparkles size={14} className="text-primary" />
                        </div>
                        <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-2xl border-[3px] border-border">
                          <p className="text-base text-foreground font-medium leading-relaxed">
                            "{dailyContent.message}"
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-in fade-in space-y-2">
                        <div className="inline-flex items-center gap-2 mb-1">
                          <Heart size={16} className="text-primary" fill="currentColor" />
                          <span className="text-sm font-bold text-primary">Свободный день</span>
                          <Heart size={16} className="text-primary" fill="currentColor" />
                        </div>
                        <div className="bg-primary/10 p-4 rounded-2xl border-[3px] border-border">
                          <p className="text-sm text-foreground/80 italic leading-relaxed">
                            "На этот день пока нет сообщения, но я всё равно думаю о тебе."
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CalendarPage;
