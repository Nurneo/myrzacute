import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { pickupLines } from '@/content/pickupLines';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';

const PickupLinesPage = () => {
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const { lang } = useLang();
  const tr = translations.pickupLines;

  const generateLine = () => {
    const randomIndex = Math.floor(Math.random() * pickupLines.length);
    setCurrentLine(pickupLines[randomIndex]);
  };

  return (
    <PageContainer>
      <SectionHeader
        title={t(tr.title, lang)}
        subtitle={t(tr.subtitle, lang)}
      />

      <div className="space-y-8">
        <div className="flex justify-center py-4">
          <Button
            onClick={generateLine}
            className="rounded-full px-8 py-6 h-auto text-lg font-bold gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 border-[3px] border-border"
          >
            <Heart size={20} fill="currentColor" />
            {t(tr.button, lang)}
          </Button>
        </div>

        {currentLine ? (
          <Card className="border-[3px] border-border shadow-xl bg-card rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <CardContent className="p-10 text-center relative">
              <div className="absolute top-4 left-4 opacity-10">
                <Sparkles size={40} className="text-primary" />
              </div>
              <p className="text-xl font-medium text-foreground leading-relaxed">
                &ldquo;{currentLine}&rdquo;
              </p>
              <div className="mt-6 flex justify-center">
                <Heart size={24} className="text-accent animate-pulse" fill="currentColor" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 opacity-40">
            <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium uppercase tracking-widest">{t(tr.empty, lang)}</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default PickupLinesPage;
