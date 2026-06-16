"use client";

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart, Flame, Settings, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dailyMessages } from '@/content/dailyMessages';
import { format } from 'date-fns';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';

const Home = () => {
  const { lang } = useLang();
  const tr = translations.home;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const messageOfTheDay = dailyMessages.find(m => m.date === todayStr)?.message || t(tr.messageFallback, lang);

  const features = [
    {
      title: t(tr.features.calendar.title, lang),
      description: t(tr.features.calendar.description, lang),
      icon: Calendar,
      color: "bg-secondary text-primary",
      path: "/calendar",
    },
    {
      title: t(tr.features.pickupLines.title, lang),
      description: t(tr.features.pickupLines.description, lang),
      icon: Heart,
      color: "bg-accent/10 text-accent",
      path: "/pickup-lines",
    },
    {
      title: t(tr.features.roasts.title, lang),
      description: t(tr.features.roasts.description, lang),
      icon: Flame,
      color: "bg-orange-100 text-orange-500",
      path: "/roasts",
    },
    {
      title: t(tr.features.settings.title, lang),
      description: t(tr.features.settings.description, lang),
      icon: Settings,
      color: "bg-muted text-muted-foreground",
      path: "/settings",
    },
  ];

  return (
    <PageContainer>
      <header className="mb-8">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">MYRZACUTE</h1>
        <p className="text-muted-foreground font-medium">{t(tr.subtitle, lang)}</p>
      </header>

      <div className="mb-10 relative">
        <div className="absolute -top-4 -left-2 opacity-10 text-primary">
          <Quote size={48} fill="currentColor" />
        </div>
        <div className="bg-primary/5 rounded-3xl p-8 border-[3px] border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">
            {t(tr.messageDayLabel, lang)}
          </p>
          <p className="text-xl font-medium text-foreground leading-relaxed italic">
            &ldquo;{messageOfTheDay}&rdquo;
          </p>
        </div>
      </div>

      <SectionHeader title={t(tr.exploreTitle, lang)} subtitle={t(tr.exploreSubtitle, lang)} />

      <div className="grid grid-cols-1 gap-4">
        {features.map((feature) => (
          <Link key={feature.path} to={feature.path}>
            <Card className="overflow-hidden border-[3px] border-border shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};

export default Home;
