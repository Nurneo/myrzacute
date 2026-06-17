"use client";

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart, Flame, Quote, Sun, Moon, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dailyMessages } from '@/content/dailyMessages';
import { format } from 'date-fns';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const Home = () => {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const tr = translations.home;
  const trSettings = translations.settings;
  const isDark = theme === 'dark';

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

      {/* Theme + Language toggles */}
      <div className="mt-10 flex flex-col gap-4">
        {/* Theme toggle */}
        <div className="flex items-center justify-between p-6 rounded-3xl border-[3px] border-border bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span className="font-bold text-foreground">{t(trSettings.themeLabel, lang)}</span>
          </div>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className={cn(
              "relative inline-flex h-10 w-20 items-center rounded-full border-[3px] transition-colors duration-500 focus:outline-none",
              isDark
                ? "bg-[#4C9DB0] border-[#4F2B1F]"
                : "bg-[#EFCEDB] border-[#FFEBAF]"
            )}
          >
            <span
              className={cn(
                "inline-block h-6 w-6 transform rounded-full transition-transform duration-500 border-[3px]",
                isDark
                  ? "translate-x-11 bg-[#FFEBAF] border-[#4F2B1F]"
                  : "translate-x-1 bg-[#4F2B1F] border-[#FFEBAF]"
              )}
            />
          </button>
        </div>

        {/* Language toggle */}
        <div className="flex items-center justify-between p-6 rounded-3xl border-[3px] border-border bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
              <Globe size={20} />
            </div>
            <span className="font-bold text-foreground">
              {lang === 'en' ? 'EN' : 'RU'}
            </span>
          </div>
          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            aria-label="Toggle language"
            className={cn(
              "relative inline-flex h-10 w-20 items-center rounded-full border-[3px] transition-colors duration-500 focus:outline-none border-border",
              lang === 'en' ? "bg-primary/20" : "bg-accent/20"
            )}
          >
            <span
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center transform rounded-full transition-transform duration-500 overflow-hidden shadow-sm",
                lang === 'en' ? "translate-x-10" : "translate-x-1"
              )}
            >
              <img
                src={lang === 'en'
                  ? "https://flagsapi.com/RU/flat/64.png"
                  : "https://flagsapi.com/GB/flat/64.png"
                }
                alt={lang === 'en' ? "Switch to Russian" : "Switch to English"}
                className="w-7 h-7 object-cover rounded-full"
              />
            </span>
          </button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50 pt-2">
          MYRZACUTE v1.0.0
        </p>
      </div>
    </PageContainer>
  );
};

export default Home;
