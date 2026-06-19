import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Flame, AlertCircle, Ghost } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { roasts } from '@/content/roasts';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';

const RoastsPage = () => {
  const [currentRoast, setCurrentRoast] = useState<string | null>(null);
  const { lang } = useLang();
  const tr = translations.roasts;

  const generateRoast = () => {
    const randomIndex = Math.floor(Math.random() * roasts.length);
    setCurrentRoast(roasts[randomIndex]);
  };

  return (
    <PageContainer>
      <SectionHeader
        title={t(tr.title, lang)}
        subtitle={t(tr.subtitle, lang)}
      />

      <div className="space-y-8">
        <Alert className="bg-orange-50 dark:bg-orange-900/20 border-[3px] border-border text-orange-800 dark:text-orange-200 rounded-2xl">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="font-bold">{t(tr.warningTitle, lang)}</AlertTitle>
          <AlertDescription className="text-xs opacity-80">
            {t(tr.warningBody, lang)}
          </AlertDescription>
        </Alert>

        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={generateRoast}
            className="rounded-full px-8 py-6 h-auto text-lg font-bold gap-2 border-[3px] border-border text-foreground hover:bg-orange-50 dark:hover:bg-primary/10 transition-all active:scale-95"
          >
            <Flame size={20} />
            {t(tr.button, lang)}
          </Button>
        </div>

        {currentRoast ? (
          <Card className="border-[3px] border-border shadow-xl bg-orange-500 dark:bg-primary text-white dark:text-primary-foreground rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <CardContent className="p-10 text-center relative">
              <div className="absolute top-4 right-4 opacity-20">
                <Ghost size={40} />
              </div>
              <p className="text-xl font-bold leading-relaxed">
                &ldquo;{currentRoast}&rdquo;
              </p>
              <div className="mt-6 flex justify-center">
                <Flame size={24} className="animate-bounce" fill="currentColor" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 opacity-40">
            <Flame size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium uppercase tracking-widest">{t(tr.empty, lang)}</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RoastsPage;
