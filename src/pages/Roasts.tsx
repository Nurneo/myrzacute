import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Flame, AlertCircle, Ghost } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { roasts } from '@/content/roasts';

const RoastsPage = () => {
  const [currentRoast, setCurrentRoast] = useState<string | null>(null);

  const generateRoast = () => {
    const randomIndex = Math.floor(Math.random() * roasts.length);
    setCurrentRoast(roasts[randomIndex]);
  };

  return (
    <PageContainer>
      <SectionHeader 
        title="Режим прожарки" 
        subtitle="Не принимай близко к сердцу, я люблю тебя" 
      />
      
      <div className="space-y-8">
        <Alert className="bg-orange-50 border-orange-200 text-orange-800 rounded-2xl">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="font-bold">Внимание</AlertTitle>
          <AlertDescription className="text-xs opacity-80">
            Действуй осторожно. Эти прожарки на 100% состоят из дерзости.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center py-4">
          <Button 
            variant="outline" 
            onClick={generateRoast}
            className="rounded-full px-8 py-6 h-auto text-lg font-bold gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-all active:scale-95"
          >
            <Flame size={20} />
            Прожарь меня
          </Button>
        </div>

        {currentRoast ? (
          <Card className="border-none shadow-xl bg-orange-500 text-white rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <CardContent className="p-10 text-center relative">
              <div className="absolute top-4 right-4 opacity-20">
                <Ghost size={40} />
              </div>
              <p className="text-xl font-bold leading-relaxed">
                "{currentRoast}"
              </p>
              <div className="mt-6 flex justify-center">
                <Flame size={24} className="animate-bounce" fill="currentColor" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 opacity-40">
            <Flame size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium uppercase tracking-widest">Готова подгореть?</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RoastsPage;