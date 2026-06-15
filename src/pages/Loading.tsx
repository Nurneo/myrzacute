import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  isExiting?: boolean;
}

const Loading = ({ isExiting }: LoadingProps) => {
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] transition-all duration-1000 ease-in-out",
        isExiting ? "opacity-0 pointer-events-none scale-110" : "opacity-100"
      )}
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-primary tracking-tighter animate-in fade-in zoom-in duration-500">
          MYRZACUTE
        </h1>
        <p className="text-white/60 text-sm font-medium tracking-widest uppercase animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          Создано специально для тебя
        </p>
        
        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Heart className="text-accent animate-pulse" size={20} fill="currentColor" />
        </div>
      </div>
    </div>
  );
};

export default Loading;