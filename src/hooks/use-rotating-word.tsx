import { useState, useEffect, useRef } from "react";
import type { Lang } from "@/content/translations";

// Weighted pools — the first entry is intentionally repeated so it dominates.
const WORDS: Record<Lang, string[]> = {
  ru: [
    "львица", "львица", "львица", "львица", "львица",
    "тигрица", "гелендваген", "ламборгини",
    "красавица", "качок", "диер", "мырзахан",
  ],
  en: [
    "lioness", "lioness", "lioness", "lioness", "lioness",
    "tigress", "G-wagon", "Lambo",
    "beauty", "swole queen", "dear", "myrzakhan",
  ],
};

const ROTATE_MS = 20000;
const TYPE_SPEED_MS = 55;

function pickRandom(pool: string[], exclude?: string): string {
  const candidates = exclude ? pool.filter((w) => w !== exclude) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Returns a word that rotates on an interval and types itself out
 * character-by-character whenever it changes.
 */
export function useRotatingWord(lang: Lang) {
  const pool = WORDS[lang];
  const [target, setTarget] = useState(() => pickRandom(pool));
  const [displayed, setDisplayed] = useState(target);
  const [typing, setTyping] = useState(false);
  const prevTarget = useRef(target);

  // Rotate on an interval; reset immediately when language changes.
  useEffect(() => {
    setTarget(pickRandom(WORDS[lang]));
    const timer = setInterval(() => {
      setTarget((prev) => pickRandom(WORDS[lang], prev));
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [lang]);

  // Typewriter effect on target change.
  useEffect(() => {
    if (prevTarget.current === target) return;
    prevTarget.current = target;
    setTyping(true);
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, TYPE_SPEED_MS);
    return () => clearInterval(interval);
  }, [target]);

  return { displayed, typing };
}
