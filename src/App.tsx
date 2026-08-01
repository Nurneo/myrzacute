import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationManager } from "@/components/NotificationManager";

import Home from "./pages/Home";
const CalendarPage = lazy(() => import("./pages/Calendar"));
const PickupLinesPage = lazy(() => import("./pages/PickupLines"));
const RoastsPage = lazy(() => import("./pages/Roasts"));
const SecretPage = lazy(() => import("./pages/Secret"));
const ImportantDatesPage = lazy(() => import("./pages/ImportantDates"));
const NotFound = lazy(() => import("./pages/NotFound"));
import Loading from "./pages/Loading";

const RouteFallback = () => (
  <div className="flex-1 w-full max-w-md mx-auto px-6 pt-6 pb-20 relative z-10 flex flex-col gap-6 animate-pulse select-none pointer-events-none">
    {/* Header Skeleton */}
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-8 w-44 bg-foreground/20 rounded-2xl" />
        <div className="h-4 w-32 bg-foreground/15 rounded-xl" />
      </div>
      <div className="w-10 h-10 rounded-2xl bg-foreground/20 border-[3px] border-foreground/10" />
    </div>

    {/* Counter Card Skeleton */}
    <div className="h-36 w-full bg-foreground/5 rounded-3xl border-[3px] border-foreground/10 flex flex-col items-center justify-center p-6 gap-3">
      <div className="h-4 w-28 bg-foreground/15 rounded-xl" />
      <div className="h-3 w-40 bg-foreground/10 rounded-lg" />
      <div className="grid grid-cols-4 gap-3 w-full max-w-xs mt-2">
        <div className="h-12 bg-foreground/10 rounded-2xl" />
        <div className="h-12 bg-foreground/10 rounded-2xl" />
        <div className="h-12 bg-foreground/10 rounded-2xl" />
        <div className="h-12 bg-foreground/10 rounded-2xl" />
      </div>
    </div>

    {/* Section Title Skeleton */}
    <div className="h-6 w-32 bg-foreground/15 rounded-xl mt-2" />

    {/* Feature Lists Skeleton */}
    <div className="flex flex-col gap-4">
      <div className="h-20 w-full bg-foreground/10 rounded-3xl border-[3px] border-foreground/10" />
      <div className="h-20 w-full bg-foreground/10 rounded-3xl border-[3px] border-foreground/10" />
      <div className="h-20 w-full bg-foreground/10 rounded-3xl border-[3px] border-foreground/10" />
    </div>
  </div>
);

const SPLASH_DURATION_MS = 1000;
const SPLASH_FADE_MS = 500;

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsExiting(true), SPLASH_DURATION_MS);
    const removeTimer = setTimeout(
      () => setIsLoading(false),
      SPLASH_DURATION_MS + SPLASH_FADE_MS,
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-transparent flex flex-col relative overflow-hidden">
      {isLoading && <Loading isExiting={isExiting} />}

      <div className="flex-1 flex flex-col">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/pickup-lines" element={<PickupLinesPage />} />
            <Route path="/roasts" element={<RoastsPage />} />
            <Route path="/secret" element={<SecretPage />} />
            <Route path="/important-dates" element={<ImportantDatesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light">
    <LanguageProvider>
      <NotificationManager>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </NotificationManager>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
