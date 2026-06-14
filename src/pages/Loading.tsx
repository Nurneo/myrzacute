import React from 'react';
import { Heart } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-primary tracking-tighter">MYRZACUTE</h1>
        <p className="text-white/60 text-sm font-medium tracking-widest uppercase">Handcrafted for you</p>
        
        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Heart className="text-accent animate-pulse" size={20} fill="currentColor" />
        </div>
      </div>
    </div>
  );
};

export default Loading;