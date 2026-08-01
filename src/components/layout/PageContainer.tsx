"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import GlassHeartsBackground from '@/components/GlassHeartsBackground';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  useWallpaper?: boolean;
  disableGradient?: boolean;
}

const PageContainer = ({ children, className = "", useWallpaper = false, disableGradient = false }: PageContainerProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  const backgroundImage = isDark 
    ? "url('/wallpapers/wallpaper-dark.webp')"
    : "url('/wallpapers/wallpaper-light.webp')";

  const isSecret = location.pathname === '/secret';
  const showBackButton = !isHome && !isSecret;

  return (
    <div className="min-h-dvh flex flex-col bg-transparent relative overflow-x-hidden">
      {/* Custom Wallpaper Background */}
      {useWallpaper && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transition-opacity duration-300"
          style={{ backgroundImage }}
        />
      )}

      {/* Dynamic Theme Gradient Background */}
      {!useWallpaper && !disableGradient && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, #a89bf2 80%, #4c9db0 100%)"
              : "linear-gradient(to bottom, #4c9db0 80%, #a89bf2 100%)"
          }}
        />
      )}

      {/* Persistent Glass Hearts Background Layer */}
      <GlassHeartsBackground />

      {showBackButton && (
        <div className="w-full max-w-md mx-auto px-6 pt-6 relative z-50">
          <Link 
            to="/"
            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white dark:bg-card shadow-sm border-[3px] border-border"
            style={{ transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease' }}
            onPointerDown={(e) => (e.currentTarget.style.transform = 'scale(0.88)')}
            onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ChevronLeft size={24} className="text-primary dark:text-foreground" />
          </Link>
        </div>
      )}
      <main
        className={`flex-1 w-full max-w-md mx-auto px-6 pt-6 pb-20 relative z-10 ${className}`}
        style={{ animation: 'fadeSlideUp 0.38s cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {children}
      </main>
    </div>
  );
};

export default PageContainer;