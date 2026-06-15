import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";

import Home from "./pages/Home";
import CalendarPage from "./pages/Calendar";
import PickupLinesPage from "./pages/PickupLines";
import RoastsPage from "./pages/Roasts";
import MemoriesPage from "./pages/Memories";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Loading from "./pages/Loading";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      // Completely remove loading component after animation finishes
      const removeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Matches the duration-1000 in Loading.tsx
      return () => clearTimeout(removeTimer);
    }, 2000);

    return () => clearTimeout(exitTimer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isLoading && <Loading isExiting={isExiting} />}
      
      <div className={`flex-1 flex flex-col transition-all duration-1000 ${isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/pickup-lines" element={<PickupLinesPage />} />
          <Route path="/roasts" element={<RoastsPage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;