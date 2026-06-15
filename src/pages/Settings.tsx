import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { useTheme } from 'next-themes';
import { Sun, Moon, Globe, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = React.useState<'en' | 'ru'>('ru');

  return (
    <PageContainer>
      <SectionHeader 
        title="Настройки" 
        subtitle="Сделай приложение своим" 
      />
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">Внешний вид</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-3xl border-[3px] transition-all gap-3",
                theme === 'light' 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
              )}
            >
              <Sun size={24} />
              <span className="font-bold text-sm">День</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-3xl border-[3px] transition-all gap-3",
                theme === 'dark' 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
              )}
            >
              <Moon size={24} />
              <span className="font-bold text-sm">Ночь</span>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">Предпочтения</h3>
          <Card className="border-[3px] border-border shadow-sm bg-card rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y-[3px] divide-border">
                <button 
                  onClick={() => setLanguage('en')}
                  className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
                      <Globe size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">English</p>
                      <p className="text-xs text-muted-foreground">Язык по умолчанию</p>
                    </div>
                  </div>
                  {language === 'en' && <Check size={20} className="text-primary" />}
                </button>

                <button 
                  onClick={() => setLanguage('ru')}
                  className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border-[3px] border-border">
                      <Globe size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Русский</p>
                      <p className="text-xs text-muted-foreground">Русский язык</p>
                    </div>
                  </div>
                  {language === 'ru' && <Check size={20} className="text-primary" />}
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="pt-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">
            MYRZACUTE v1.0.0
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;