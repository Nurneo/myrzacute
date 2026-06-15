"use client";

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
      {!isHome && (
        <div className="w-full max-w-md mx-auto px-6 pt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-2xl bg-white shadow-sm border border-border/50 hover:bg-secondary/20 transition-all active:scale-90"
          >
            <ChevronLeft size={24} className="text-primary" />
          </Button>
        </div>
      )}
      <main className={`flex-1 w-full max-w-md mx-auto px-6 pt-6 pb-20 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;