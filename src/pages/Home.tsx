"use client";

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart, Flame, Settings, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dailyMessages } from '@/content/dailyMessages';
import { format } from 'date-fns';

const features = [
  {
    title: "Календарь",
    description: "Наши особенные моменты",
    icon: Calendar,
    color: "bg-secondary text-primary",
    path: "/calendar"
  },
  {
    title: "Подкаты",
    description: "Почему ты потрясающая",
    icon: Heart,
    color: "bg-accent/10 text-accent",
    path: "/pickup-lines"
  },
  {
    title: "Режим прожарки",
    description: "Потому что я люблю тебя дразнить",
    icon: Flame,
    color: "bg-orange-100 text-orange-500",
    path: "/roasts"
  },
  {
    title: "Настройки",
    description: "Настрой приложение под себя",
    icon: Settings,
    color: "bg-muted text-muted-foreground",
    path: "/settings"
  }
];

const Home = () => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const messageOfTheDay = dailyMessages.find(m => m.date === todayStr)?.message || "Ты сегодня просто великолепна! ✨";

  return (
    <PageContainer>
      <header className="mb-8">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">MYRZACUTE</h1>
        <p className="text-muted-foreground font-medium">С возвращением, львица.</p>
      </header>

      <div className="mb-10 relative">
        <div className="absolute -top-4 -left-2 opacity-10 text-primary">
          <Quote size={48} fill="currentColor" />
        </div>
        <div className="bg-primary/5 rounded-3xl p-8 border-2 dark:border-[3px] border-primary/10 dark:border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Сообщение дня</p>
          <p className="text-xl font-medium text-foreground leading-relaxed italic">
            "{messageOfTheDay}"
          </p>
        </div>
      </div>

      <SectionHeader title="Исследовать" subtitle="Что мы чувствуем сегодня?" />

      <div className="grid grid-cols-1 gap-4">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.path}>
            <Card className="overflow-hidden border-2 dark:border-[3px] border-border shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]">
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