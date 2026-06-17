import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import ThemeToggle from '@/components/ThemeToggle';
import { Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { cn } from '@/lib/utils';

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
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
                    <Globe size={20} />
                  </div>
                  {/* Show current language label */}
                  <span className="font-bold text-foreground">
                    {lang === 'en' ? 'EN' : 'RU'}
                  </span>
                </div>

                {/* Toggle switch — shows the FLAG of the language you will switch TO */}
                <button
                  onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
                  aria-label="Toggle language"
                  className={cn(
                    "relative inline-flex h-10 w-20 items-center rounded-full border-[3px] transition-colors duration-500 focus:outline-none border-border",
                    lang === 'en' ? "bg-primary/20" : "bg-accent/20"
                  )}
                >
                  {/* Sliding knob with the flag of the TARGET language */}
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center transform rounded-full transition-transform duration-500 text-base shadow-sm",
                      lang === 'en'
                        ? "translate-x-10"   // currently EN → knob is on right, shows RU flag
                        : "translate-x-1"    // currently RU → knob is on left, shows EN flag
                    )}
                  >
                    {/* Show the flag you're switching TO */}
                    {lang === 'en' ? '🇷🇺' : '🇬🇧'}
                  </span>
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
