import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { memories } from '@/content/memories';
import { Calendar, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const MemoriesPage = () => {
  return (
    <PageContainer>
      <SectionHeader 
        title="Наши моменты" 
        subtitle="Коллекция самых теплых воспоминаний" 
      />
      
      <div className="grid grid-cols-1 gap-6">
        {memories.map((memory) => (
          <Card key={memory.id} className="overflow-hidden border-[3px] border-border shadow-sm rounded-3xl bg-card group">
            <div className="aspect-video relative overflow-hidden border-b-[3px] border-border">
              <img 
                src={memory.imageUrl} 
                alt={memory.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border-[2px] border-border flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-wider text-foreground">
                  {format(new Date(memory.date), 'd MMM yyyy', { locale: ru })}
                </span>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">{memory.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {memory.description}
              </p>
            </CardContent>
          </Card>
        ))}

        {memories.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium uppercase tracking-widest">Здесь пока пусто, но скоро будет много фото</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default MemoriesPage;