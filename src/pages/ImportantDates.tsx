import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { importantDates } from '@/content/importantDates';
import { useLang } from '@/context/LanguageContext';
import { t } from '@/content/translations';

const ImportantDatesPage = () => {
  const { lang } = useLang();
  
  return (
    <PageContainer>
      <SectionHeader
        title={lang === 'ru' ? 'Важные даты' : 'Important Dates'}
        subtitle={lang === 'ru' ? 'Хронология нашей любви' : 'The timeline of our love'}
      />

      <div className="relative border-l-[3px] border-primary/30 ml-4 pl-6 sm:pl-8 space-y-8 py-4">
        {importantDates.map((item, index) => (
          <div 
            key={index} 
            className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
          >
            {/* Timeline dot */}
            <div className="absolute -left-[37px] sm:-left-[45px] top-1.5 w-6 h-6 rounded-full bg-background border-[3px] border-primary flex items-center justify-center shadow-sm z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            </div>

            {/* Content card */}
            <Card className="border-[3px] border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all rounded-3xl overflow-hidden active:scale-[0.99]">
              <CardContent className="p-5 sm:p-6 text-left">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary mb-2">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-lg font-black text-foreground mb-1 leading-snug">
                  {t(item.title, lang)}
                </h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed mt-2 pt-2 border-t border-border/40">
                    {t(item.description, lang)}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default ImportantDatesPage;
