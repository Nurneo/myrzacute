import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLang } from "@/context/LanguageContext";
import { translations, t } from "@/content/translations";
import { showSuccess } from "@/utils/toast";
import { format, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MoodometerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date; // Added selectedDate prop
}

const moodLevels = [
  { level: 1, textKey: 'level1', color: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30' },
  { level: 2, textKey: 'level2', color: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border-orange-500/30' },
  { level: 3, textKey: 'level3', color: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
  { level: 4, textKey: 'level4', color: 'bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/30' },
  { level: 5, textKey: 'level5', color: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border-purple-500/30' },
];

const MoodometerModal = ({ isOpen, onClose, selectedDate }: MoodometerModalProps) => {
  const { lang } = useLang();
  const tr = translations.home.moodometer;

  // Compute key and date targets dynamically
  const dateToUse = selectedDate || new Date();
  const todayStr = format(dateToUse, 'yyyy-MM-dd');
  const storageKey = `lioness-mood-${todayStr}`;

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  // Spin states
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const dragStartAngleRef = useRef(0);
  const dragStartRotationRef = useRef(0);
  const centerXRef = useRef(0);
  const centerYRef = useRef(0);

  // Load initial mood from localStorage and rotate the wheel to place it at the top slot
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const lvlNum = Number(saved);
        setSelectedLevel(lvlNum);
        const idx = moodLevels.findIndex(m => m.level === lvlNum);
        if (idx !== -1) {
          // Align the saved index to the top (which is -90 degrees, i.e. base index 0)
          setRotationAngle(-idx * 72);
        }
      } else {
        setSelectedLevel(null);
        setRotationAngle(0);
      }
      setHoveredLevel(null);
    }
  }, [isOpen, storageKey]);

  // Closest-angle rotation calculation on direct selection
  const handleSelect = (level: number) => {
    setSelectedLevel(level);
    const idx = moodLevels.findIndex(m => m.level === level);
    if (idx !== -1) {
      const targetBaseAngle = -idx * 72;
      const currentRotation = rotationAngle;
      // Calculate shortest rotation path in degrees (clockwise vs counter-clockwise)
      const adjustedDiff = (((targetBaseAngle - currentRotation + 180) % 360 + 360) % 360) - 180;
      setRotationAngle(currentRotation + adjustedDiff);
    }
  };

  const handleReset = () => {
    setSelectedLevel(null);
    setRotationAngle(0);
  };

  const handleConfirm = () => {
    if (selectedLevel) {
      localStorage.setItem(storageKey, String(selectedLevel));
      const text = t(tr[`level${selectedLevel}` as keyof typeof tr], lang);
      showSuccess(
        lang === 'ru'
          ? `Настроение сохранено: "${text}"`
          : `Mood saved: "${text}"`
      );
    } else {
      localStorage.removeItem(storageKey);
      showSuccess(
        lang === 'ru'
          ? "Настроение сброшено"
          : "Mood reset"
      );
    }
    onClose();
  };

  // Dragging event handlers (Pointer Events automatically map touch/mouse/stylus correctly)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    centerXRef.current = rect.left + rect.width / 2;
    centerYRef.current = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerYRef.current, e.clientX - centerXRef.current) * (180 / Math.PI);
    dragStartAngleRef.current = angle;
    dragStartRotationRef.current = rotationAngle;
    setIsDragging(true);

    wheelRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !wheelRef.current) return;

    const angle = Math.atan2(e.clientY - centerYRef.current, e.clientX - centerXRef.current) * (180 / Math.PI);
    const delta = angle - dragStartAngleRef.current;
    const newAngle = dragStartRotationRef.current + delta;
    setRotationAngle(newAngle);

    // Calculate dynamic selection during rotation (snap index pointing to 12 o'clock)
    const normalizedAngle = (normalizedMod(newAngle, 360));
    const snapIndex = (5 - (Math.round(normalizedAngle / 72) % 5)) % 5;
    setSelectedLevel(moodLevels[snapIndex].level);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (wheelRef.current) {
      wheelRef.current.releasePointerCapture(e.pointerId);
    }

    // Snap magnet-style to nearest 72-degree node position
    const snapped = Math.round(rotationAngle / 72) * 72;
    setRotationAngle(snapped);

    const normalizedAngle = (normalizedMod(snapped, 360));
    const snapIndex = (5 - (Math.round(normalizedAngle / 72) % 5)) % 5;
    setSelectedLevel(moodLevels[snapIndex].level);
  };

  const normalizedMod = (n: number, m: number) => {
    return ((n % m) + m) % m;
  };

  const activeLevel = hoveredLevel || selectedLevel;
  const activeMoodText = activeLevel
    ? t(tr[`level${activeLevel}` as keyof typeof tr], lang)
    : (lang === 'ru' ? 'Крути колесо или выбери!' : 'Spin the wheel or tap!');

  // SVG source or Fallback emoji
  const renderMoodIcon = (level: number, sizeClass = "w-7 h-7 sm:w-8 sm:h-8") => {
    if (imgErrors[level]) {
      return <span className="text-xl sm:text-2xl select-none">🦁</span>;
    }
    return (
      <img
        src={`/moods/mood${level}.svg`}
        alt={`Mood ${level}`}
        className={cn(sizeClass, "object-contain transition-all duration-300")}
        loading="lazy"
        decoding="async"
        onError={() => setImgErrors((prev) => ({ ...prev, [level]: true }))}
      />
    );
  };

  // Coordinates calculation for the circular wheel
  const radius = 96; // Radius in pixels
  const getCoordinates = (index: number, offsetAngle: number) => {
    const angle = (index * 360) / 5 - 90 + offsetAngle; // Base top is -90 degrees
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    return { x, y };
  };

  // Dynamic dialog subtitles
  const dateStr = format(dateToUse, lang === 'ru' ? 'd MMMM' : 'MMMM d', { locale: lang === 'ru' ? ru : undefined });
  const subtitleText = isSameDay(dateToUse, new Date())
    ? (lang === 'ru' ? 'Как себя чувствует львица сегодня?' : 'How is the lioness feeling today?')
    : (lang === 'ru' ? `Как чувствовала себя львица ${dateStr}?` : `How did the lioness feel on ${dateStr}?`);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[92vw] sm:max-w-md rounded-3xl border-[3px] border-border bg-card p-6 shadow-2xl flex flex-col gap-6 select-none">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
            {t(tr.title, lang)}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm font-medium">
            {subtitleText}
          </DialogDescription>
        </DialogHeader>

        {/* Circular Wheel Area */}
        <div 
          ref={wheelRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center my-2 cursor-grab active:cursor-grabbing touch-none select-none"
        >
          {/* Top visual pointer arrow pointing to the selected slot */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-primary text-xl z-30 select-none animate-bounce">
            ▼
          </div>

          {/* Dashed outer guideline for the orbit visual */}
          <div className="absolute w-[192px] h-[192px] rounded-full border-[3px] border-dashed border-border/20 pointer-events-none" />

          {/* Center Display Node */}
          <div className={cn(
            "w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-background border-[3px] border-border flex flex-col items-center justify-center p-3 text-center transition-all duration-300 shadow-inner z-10 pointer-events-none select-none",
            activeLevel && "scale-105"
          )}>
            {activeLevel ? (
              <div className="flex flex-col items-center gap-1 animate-in fade-in zoom-in duration-300">
                {renderMoodIcon(activeLevel, "w-12 h-12 sm:w-14 sm:h-14")}
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  {activeLevel} / 5
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <span className="text-3xl select-none animate-pulse">👑</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {lang === 'ru' ? 'Крути' : 'Spin'}
                </span>
              </div>
            )}
          </div>

          {/* 5 Orbital Buttons (they calculate coordinates dynamically based on rotationAngle) */}
          {moodLevels.map((lvl, index) => {
            const { x, y } = getCoordinates(index, rotationAngle);
            const isSelected = selectedLevel === lvl.level;
            const isHovered = hoveredLevel === lvl.level;
            const scale = isSelected ? 1.1 : (isHovered ? 1.05 : 1);

            return (
              <button
                key={lvl.level}
                type="button"
                onMouseEnter={() => !isDragging && setHoveredLevel(lvl.level)}
                onMouseLeave={() => !isDragging && setHoveredLevel(null)}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => !isDragging && handleSelect(lvl.level)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                }}
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] flex items-center justify-center cursor-pointer focus:outline-none z-20 shadow-md",
                  !isDragging && "transition-all duration-500 ease-out",
                  isSelected
                    ? "bg-primary border-border shadow-lg ring-[3px] ring-primary/40 text-primary-foreground"
                    : cn(lvl.color, "bg-card border-border")
                )}
                aria-label={`Mood Level ${lvl.level}`}
              >
                <div className="transition-transform duration-300">
                  {renderMoodIcon(lvl.level)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected / Hovered Mood Text Box */}
        <div className="min-h-[4rem] flex items-center justify-center text-center p-3 rounded-2xl bg-primary/5 border-[3px] border-border border-dashed transition-all duration-300">
          <p className="text-base font-bold text-foreground leading-snug">
            {activeMoodText}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className={cn(
              "flex-1 py-3 px-4 rounded-2xl font-bold border-[3px] border-border text-foreground bg-card hover:bg-muted/10 transition-all active:scale-[0.98]",
              !selectedLevel && "opacity-50 pointer-events-none"
            )}
          >
            {lang === 'ru' ? 'Сбросить' : 'Reset'}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-[2] py-3 px-4 rounded-2xl font-bold bg-primary border-[3px] border-border text-primary-foreground hover:opacity-90 transition-all active:scale-[0.98]"
          >
            {t(tr.selectBtn, lang)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodometerModal;
