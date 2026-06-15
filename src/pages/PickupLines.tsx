import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { pickupLines } from '@/content/pickupLines';

const PickupLinesPage = () => {
  const [currentLine, setCurrentLine] = useState<string | null>(null);

  const generateLine = () => {
    const randomIndex = Math.floor(Math.random() * pickupLines.length);
    setCurrentLine(pickupLines[randomIndex]);
  };

  return (
    <PageContainer>
      <SectionHeader 
        title="Pick-Up Lines" 
        subtitle="Just a few reminders of how great you are" 
      />
      
      <div className="space-y-8">
        <div className="flex justify-center py-4">
          <Button 
            onClick={generateLine}
            className="rounded-full px-8 py-6 h-auto text-lg font-bold gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Heart size={20} fill="currentColor" />
            Generate Line
          </Button>
        </div>

        {currentLine ? (
          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <CardContent className="p-10 text-center relative">
              <div className="absolute top-4 left-4 opacity-10">
                <Sparkles size={40} className="text-primary" />
              </div>
              <p className="text-xl font-medium text-foreground leading-relaxed">
                "{currentLine}"
              </p>
              <div className="mt-6 flex justify-center">
                <Heart size={24} className="text-accent animate-pulse" fill="currentColor" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 opacity-40">
            <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium uppercase tracking-widest">Click the button for some love</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default PickupLinesPage;