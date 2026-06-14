import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import PlaceholderBlock from '@/components/ui/PlaceholderBlock';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const ComplimentsPage = () => {
  return (
    <PageContainer>
      <SectionHeader 
        title="Compliments" 
        subtitle="Just a few reminders of how great you are" 
      />
      
      <div className="space-y-6">
        <PlaceholderBlock height="h-16" label="Category Selector" />
        
        <div className="flex justify-center py-4">
          <Button className="rounded-full px-8 py-6 h-auto text-lg font-bold gap-2 shadow-lg shadow-primary/20">
            <Heart size={20} fill="currentColor" />
            Generate Love
          </Button>
        </div>

        <PlaceholderBlock height="h-48" label="Compliment Result Card" />
      </div>
    </PageContainer>
  );
};

export default ComplimentsPage;