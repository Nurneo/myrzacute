import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import ThemeToggle from '@/components/ThemeToggle';
import { Globe, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';

const SettingsPage = () => {
  const { lang, setLang } = useLang();
  const tr = translations.settings;

  return (
    <PageContainer>
      <SectionHeader
        title={t(tr.title, lang)}
        subtitle={t(tr.subtitle, lang)}
      />

      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">
            {t(tr.appearance, lang)}
          </h3>
          <ThemeToggle />
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">
            {t(tr.preferences, lang)}
          </h3>
          <Card className="border-[3px] border-border shadow-sm bg-card rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y-[3px] divide-border">
                <button
                  onClick={() => setLang('en')}
                  className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
                      <Globe size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{t(tr.englishLabel, lang)}</p>
                      <p className="text-xs text-muted-foreground">{t(tr.englishSub, lang)}</p>
                    </div>
                  </div>
                  {lang === 'en' && <Check size={20} className="text-primary" />}
                </button>

                <button
                  onClick={() => setLang('ru')}
                  className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border-[3px] border-border">
                      <Globe size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{t(tr.russianLabel, lang)}</p>
                      <p className="text-xs text-muted-foreground">{t(tr.russianSub, lang)}</p>
                    </div>
                  </div>
                  {lang === 'ru' && <Check size={20} className="text-primary" />}
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
