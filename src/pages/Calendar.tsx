import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format, isAfter, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon, Heart, Lock } from 'lucide-react';
import { dailyMessages } from '@/content';

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 0, 1));

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
        <Card className="border-2 dark:border-[3px] border-border shadow-sm overflow-hidden bg-card rounded-3xl">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={new Date(2026, 0)}
              locale={ru}
              weekStartsOn={1}
              className="rounded-md border-none"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-secondary text-primary font-bold",
              }}
            />
          </CardContent>
        </Card>

        {date && (
          <Card className={`border-2 dark:border-[3px] border-border shadow-sm rounded-3xl overflow-hidden relative transition-all duration-500 ${isLocked ? 'bg-muted' : 'bg-primary/5'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              {isLocked ? <Lock size={80} className="text-muted-foreground" /> : <Heart size={80} fill="currentColor" className="text-primary" />}
            </div>
            
            <CardContent className="p-8 text-center relative z-10">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm mb-4 transition-colors duration-500 border-2 dark:border-[3px] border-border ${isLocked ? 'bg-white text-muted-foreground' : 'bg-white text-primary'}`}>
                {isLocked ? <Lock size={24} /> : <CalendarIcon size={24} />}
              </div>
              
              <p className={`text-xs font-black uppercase tracking-[0.2em] mb-1 transition-colors duration-500 ${isLocked ? 'text-muted-foreground' : 'text-primary'}`}>
                {format(date, 'EEEE', { locale: ru })}
              </p>
              <h3 className="text-3xl font-black text-foreground tracking-tighter">
                {format(date, 'd MMMM yyyy', { locale: ru })}
              </h3>
              
              <div className={`mt-6 pt-6 border-t-2 dark:border-t-[3px] transition-colors duration-500 ${isLocked ? 'border-muted-foreground/10' : 'border-primary/10 dark:border-border'}`}>
                {isLocked ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                    <h4 className="font-bold text-lg text-muted-foreground">Закрыто</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "Терпение, красавица. Этот сюрприз ждет своего момента."
                    </p>
                  </div>
                ) : dailyContent ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <h4 className="font-bold text-xl text-primary">{dailyContent.title}</h4>
                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 dark:border-[3px] border-primary/5 dark:border-border">
                      <p className="text-base text-foreground font-medium leading-relaxed">
                        "{dailyContent.message}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in">
                    <p className="text-sm text-muted-foreground italic">
                      "На этот день пока нет сообщения, но я всё равно думаю о тебе."
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default CalendarPage;