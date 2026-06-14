import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import PlaceholderBlock from '@/components/ui/PlaceholderBlock';

const SettingsPage = () => {
  return (
    <PageContainer>
      <SectionHeader 
        title="Settings" 
        subtitle="Make it yours" 
      />
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Appearance</h3>
          <PlaceholderBlock height="h-24" label="Theme Controls" />
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Preferences</h3>
          <PlaceholderBlock height="h-48" label="Language & Audio Controls" />
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">About</h3>
          <div className="p-4 bg-white rounded-2xl border border-border text-center">
            <p className="text-xs text-muted-foreground">MYRZACUTE v1.0.0</p>
            <p className="text-[10px] text-muted-foreground mt-1">Made with love</p>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;