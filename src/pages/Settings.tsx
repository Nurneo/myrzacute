import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import ThemeToggle from '@/components/ThemeToggle';
import PreferenceToggles from '@/components/ui/PreferenceToggles';
import { Globe } from 'lucide-react';

const languageOptions = [
  { id: 'en', label: 'English', sublabel: 'Язык по умолчанию', icon: Globe, iconColor: 'bg-primary/10 text-primary' },
  { id: 'ru', label: 'Русский', sublabel: 'Русский язык', icon: Globe, iconColor: 'bg-accent/10 text-accent' },
];

const SettingsPage = () => {
  const [language, setLanguage] = React.useState<'en' | 'ru'>('ru');

  return (
    <PageContainer>
      <SectionHeader 
        title="Настройки" 
        subtitle="Сделай приложение своим" 
      />
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">Внешний вид</h3>
          <ThemeToggle />
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">Предпочтения</h3>
          <PreferenceToggles
            options={languageOptions}
            activeId={language}
            onChange={(id) => setLanguage(id as 'en' | 'ru')}
          />
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