"use client";

import React from "react";
import { Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useLang } from "@/context/LanguageContext";
import { translations, t } from "@/content/translations";
import { cn } from "@/lib/utils";

/**
 * Theme + Language preference toggles.
 * Shared switch shell keeps both rows visually consistent.
 */
const PreferenceToggles = () => {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLang();
  const isDark = theme === "dark";
  const tr = translations.settings;

  return (
    <div className="mt-10 flex flex-col gap-4">
      {/* Theme toggle */}
      <div className="flex items-center justify-between p-6 rounded-3xl border-[3px] border-border bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <span className="font-bold text-foreground">{t(tr.themeLabel, lang)}</span>
        </div>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
          className={cn(
            "relative inline-flex h-10 w-20 items-center rounded-full border-[3px] transition-colors duration-500 focus:outline-none",
            isDark ? "bg-[#4C9DB0] border-[#4F2B1F]" : "bg-[#EFCEDB] border-[#FFEBAF]",
          )}
        >
          <span
            className={cn(
              "inline-block h-6 w-6 transform rounded-full transition-transform duration-500 border-[3px]",
              isDark
                ? "translate-x-11 bg-[#FFEBAF] border-[#4F2B1F]"
                : "translate-x-1 bg-[#4F2B1F] border-[#FFEBAF]",
            )}
          />
        </button>
      </div>

      {/* Language toggle */}
      <div className="flex items-center justify-between p-6 rounded-3xl border-[3px] border-border bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[3px] border-border">
            <Globe size={20} />
          </div>
          <span className="font-bold text-foreground">{lang === "en" ? "EN" : "RU"}</span>
        </div>
        <button
          onClick={() => setLang(lang === "en" ? "ru" : "en")}
          aria-label="Toggle language"
          className={cn(
            "relative inline-flex h-10 w-20 items-center rounded-full border-[3px] transition-colors duration-500 focus:outline-none border-border",
            lang === "en" ? "bg-primary/20" : "bg-accent/20",
          )}
        >
          <span
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center transform rounded-full transition-transform duration-500 overflow-hidden shadow-sm",
              lang === "en" ? "translate-x-10" : "translate-x-1",
            )}
          >
            <img
              src={
                lang === "en"
                  ? "https://flagsapi.com/RU/flat/64.png"
                  : "https://flagsapi.com/GB/flat/64.png"
              }
              alt={lang === "en" ? "Switch to Russian" : "Switch to English"}
              className="w-7 h-7 object-cover rounded-full"
            />
          </span>
        </button>
      </div>
    </div>
  );
};

export default PreferenceToggles;
