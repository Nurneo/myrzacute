import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";

import Home from "./pages/Home";
import CalendarPage from "./pages/Calendar";
import PickupLinesPage from "./pages/PickupLines";
import RoastsPage from "./pages/Roasts";
import NotFound from "./pages/NotFound";
import Loading from "./pages/Loading";

const SPLASH_VISIBLE_MS = 2000;
const SPLASH_EXIT_MS = 1000; // Must match the duration-1000 transition in Loading.tsx

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), SPLASH_VISIBLE_MS);
    const removeTimer = setTimeout(
      () => setIsLoading(false),
      SPLASH_VISIBLE_MS + SPLASH_EXIT_MS,
    );
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isLoading && <Loading isExiting={isExiting} />}

      <div
        className={`flex-1 flex flex-col transition-all duration-1000 ${
          isExiting ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/pickup-lines" element={<PickupLinesPage />} />
          <Route path="/roasts" element={<RoastsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
