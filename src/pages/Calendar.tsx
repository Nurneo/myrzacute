import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import PlaceholderBlock from '@/components/ui/PlaceholderBlock';

const CalendarPage = () => {
  return (
    <PageContainer>
      <SectionHeader 
        title="Our Calendar" 
        subtitle="Every day is a gift with you" 
      />
      
      <div className="space-y-6">
        <PlaceholderBlock height="h-12" label="Month Selector" />
        <PlaceholderBlock height="h-80" label="Calendar Grid" />
        <PlaceholderBlock height="h-32" label="Selected Day Details" />
      </div>
    </PageContainer>
  );
};

export default CalendarPage;