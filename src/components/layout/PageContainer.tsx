"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTheme } from 'next-themes';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  const backgroundImage = isDark 
    ? "url('/wallpapers/wallpaper-dark.webp')"
    : "url('/wallpapers/wallpaper-light.webp')";

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Custom Wallpaper Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transition-opacity duration-300"
        style={{ backgroundImage }}
      />

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
      <main className={`flex-1 w-full max-w-md mx-auto px-6 pt-6 pb-20 relative z-10 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;