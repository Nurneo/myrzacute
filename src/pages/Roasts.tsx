import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import PlaceholderBlock from '@/components/ui/PlaceholderBlock';
import { Button } from '@/components/ui/button';
import { Flame, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const RoastsPage = () => {
  return (
    <PageContainer>
      <SectionHeader 
        title="Roast Mode" 
        subtitle="Don't take it personally, I love you" 
      />
      
      <div className="space-y-6">
        <Alert className="bg-orange-50 border-orange-200 text-orange-800 rounded-2xl">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="font-bold">Warning</AlertTitle>
          <AlertDescription className="text-xs opacity-80">
            Proceed with caution. These roasts are handcrafted with 100% sass.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center py-4">
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto text-lg font-bold gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50">
            <Flame size={20} />
            Roast Me
          </Button>
        </div>

        <PlaceholderBlock height="h-48" label="Roast Result Card" />
      </div>
    </PageContainer>
  );
};

export default RoastsPage;