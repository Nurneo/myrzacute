import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Heart } from 'lucide-react';

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <PageContainer>
      <SectionHeader 
        title="Our Calendar" 
        subtitle="Every day is a gift with you" 
      />
      
      <div className="space-y-6">
        {/* Calendar Card */}
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

        {/* Selected Date Details */}
        {date && (
          <Card className="border-none shadow-sm bg-primary/5 rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Heart size={80} fill="currentColor" className="text-primary" />
            </div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm mb-4 text-primary">
                <CalendarIcon size={24} />
              </div>
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">
                {format(date, 'EEEE')}
              </p>
              <h3 className="text-3xl font-black text-foreground tracking-tighter">
                {format(date, 'MMMM do')}
              </h3>
              <p className="text-muted-foreground font-medium mt-2">
                {format(date, 'yyyy')}
              </p>
              
              <div className="mt-6 pt-6 border-t border-primary/10">
                <p className="text-sm text-muted-foreground italic">
                  "Every moment spent with you is a favorite memory in the making."
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default CalendarPage;