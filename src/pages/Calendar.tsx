import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format, isAfter, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, Heart, Lock } from 'lucide-react';
import { dailyMessages } from '@/content/dailyMessages';

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const today = startOfDay(new Date());
  const isLocked = date ? isAfter(startOfDay(date), today) : false;
  
  const selectedDateString = date ? format(date, 'yyyy-MM-dd') : '';
  const dailyContent = dailyMessages.find(m => m.date === selectedDateString);

  return (
    <PageContainer>
      <SectionHeader 
        title="Our Calendar" 
        subtitle="Every day is a gift with you" 
      />
      
      <div className="space-y-6">
        <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-secondary text-primary font-bold",
              }}
            />
          </CardContent>
        </Card>

        {date && (
          <Card className={`border-none shadow-sm rounded-3xl overflow-hidden relative transition-colors duration-300 ${isLocked ? 'bg-muted' : 'bg-primary/5'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              {isLocked ? <Lock size={80} className="text-muted-foreground" /> : <Heart size={80} fill="currentColor" className="text-primary" />}
            </div>
            
            <CardContent className="p-8 text-center relative z-10">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm mb-4 ${isLocked ? 'bg-white text-muted-foreground' : 'bg-white text-primary'}`}>
                {isLocked ? <Lock size={24} /> : <CalendarIcon size={24} />}
              </div>
              
              <p className={`text-xs font-black uppercase tracking-[0.2em] mb-1 ${isLocked ? 'text-muted-foreground' : 'text-primary'}`}>
                {format(date, 'EEEE')}
              </p>
              <h3 className="text-3xl font-black text-foreground tracking-tighter">
                {format(date, 'MMMM do')}
              </h3>
              
              <div className={`mt-6 pt-6 border-t ${isLocked ? 'border-muted-foreground/10' : 'border-primary/10'}`}>
                {isLocked ? (
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg text-muted-foreground">Locked</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "Patience, beautiful. This surprise is waiting for the right moment."
                    </p>
                  </div>
                ) : dailyContent ? (
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg text-primary">{dailyContent.title}</h4>
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      "{dailyContent.message}"
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    "No special message for this day yet, but I'm still thinking of you."
                  </p>
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