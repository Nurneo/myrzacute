import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";

const Home = lazy(() => import("./pages/Home"));
const CalendarPage = lazy(() => import("./pages/Calendar"));
const PickupLinesPage = lazy(() => import("./pages/PickupLines"));
const RoastsPage = lazy(() => import("./pages/Roasts"));
const SecretPage = lazy(() => import("./pages/Secret"));
const NotFound = lazy(() => import("./pages/NotFound"));
import Loading from "./pages/Loading";

const RouteFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const SPLASH_VISIBLE_MS = 1000;
const SPLASH_TEXT_EXIT_MS = 300;
const SPLASH_BG_EXIT_MS = 600;

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExitingText, setIsExitingText] = useState(false);
  const [isExitingBg, setIsExitingBg] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setIsExitingText(true), SPLASH_VISIBLE_MS);
    const bgTimer = setTimeout(() => setIsExitingBg(true), SPLASH_VISIBLE_MS + SPLASH_TEXT_EXIT_MS);
    const removeTimer = setTimeout(
      () => setIsLoading(false),
      SPLASH_VISIBLE_MS + SPLASH_TEXT_EXIT_MS + SPLASH_BG_EXIT_MS,
    );
    return () => {
      clearTimeout(textTimer);
      clearTimeout(bgTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-transparent flex flex-col relative overflow-hidden">
      {isLoading && <Loading isExitingText={isExitingText} isExitingBg={isExitingBg} />}

      <div
        className={`flex-1 flex flex-col transition-all duration-600 ease-out ${
          isExitingBg ? "opacity-100 scale-100" : "opacity-0 scale-98"
        }`}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/pickup-lines" element={<PickupLinesPage />} />
            <Route path="/roasts" element={<RoastsPage />} />
            <Route path="/secret" element={<SecretPage />} />
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
