import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          {!isHome ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ChevronLeft size={24} />
            </Button>
          ) : (
            <div className="w-10" /> // Spacer for alignment
          )}
          
          <span className="text-xs font-black tracking-[0.3em] uppercase text-muted-foreground/50">
            Myrzacute
          </span>
          
          <div className="w-10" /> {/* Right spacer */}
        </div>
      </header>

      <main className={`flex-1 w-full max-w-md mx-auto px-6 pt-6 pb-20 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;