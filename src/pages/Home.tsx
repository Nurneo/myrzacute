import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Calendar, Heart, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Today's Message",
    description: "A little something for your day",
    icon: MessageCircle,
    color: "bg-primary/10 text-primary",
    path: "/calendar"
  },
  {
    title: "Calendar",
    description: "Track our special moments",
    icon: Calendar,
    color: "bg-secondary text-primary",
    path: "/calendar"
  },
  {
    title: "Pick-Up Lines",
    description: "Reasons why you're amazing",
    icon: Heart,
    color: "bg-accent/10 text-accent",
    path: "/pickup-lines"
  },
  {
    title: "Roast Mode",
    description: "Because I love teasing you",
    icon: Flame,
    color: "bg-orange-100 text-orange-500",
    path: "/roasts"
  }
];

const Home = () => {
  return (
    <PageContainer>
      <header className="mb-10">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">MYRZACUTE</h1>
        <p className="text-muted-foreground font-medium">Welcome back, beautiful.</p>
      </header>

      <SectionHeader title="Explore" subtitle="What are we feeling today?" />

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