"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isHome && (
        <div className="w-full max-w-md mx-auto px-6 pt-6 relative z-50">
          <Link 
            to="/"
            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white dark:bg-card shadow-sm border-[3px] border-border hover:bg-secondary/20 transition-all active:scale-90"
          >
            <ChevronLeft size={24} className="text-primary dark:text-foreground" />
          </Link>
        </div>
      )}
      <main className={`flex-1 w-full max-w-md mx-auto px-6 pt-6 pb-20 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;