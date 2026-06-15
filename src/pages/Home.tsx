import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Calendar, Heart, Flame, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Сообщение дня",
    description: "Кое-что приятное для тебя",
    icon: MessageCircle,
    color: "bg-primary/10 text-primary",
    path: "/calendar"
  },
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
  return (
    <PageContainer>
      <header className="mb-10">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">MYRZACUTE</h1>
        <p className="text-muted-foreground font-medium">С возвращением, львица.</p>
      </header>

      <SectionHeader title="Исследовать" subtitle="Что мы чувствуем сегодня?" />

      <div className="grid grid-cols-1 gap-4">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.path}>
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
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