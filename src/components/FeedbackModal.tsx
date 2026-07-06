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
import { showSuccess, showError } from "@/utils/toast";
import { format, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { sendTelegramNotification } from "@/utils/telegram";
import { Loader2 } from "lucide-react";
import { fetchFeedback, saveFeedback } from "@/utils/feedbackStorage";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: (updatedMood?: number | null) => void;
  selectedDate?: Date;
  showCommentInput?: boolean;
}

const moodLevels = [
  { level: 1, textKey: 'level1', color: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30' },
  { level: 2, textKey: 'level2', color: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border-orange-500/30' },
  { level: 3, textKey: 'level3', color: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
  { level: 4, textKey: 'level4', color: 'bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/30' },
  { level: 5, textKey: 'level5', color: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border-purple-500/30' },
];

const FeedbackModal = ({ isOpen, onClose, selectedDate, showCommentInput = true }: FeedbackModalProps) => {
  const { lang } = useLang();
  const tr = translations.home.feedback;

  const dateToUse = selectedDate || new Date();
  const todayStr = format(dateToUse, 'yyyy-MM-dd');
  const storageKey = `lioness-mood-${todayStr}`;

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [isSending, setIsSending] = useState(false);

  // Spin states
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const dragStartAngleRef = useRef(0);
  const dragStartRotationRef = useRef(0);
  const centerXRef = useRef(0);
  const centerYRef = useRef(0);

  // Load initial mood and message from storage
  useEffect(() => {
    let active = true;
    if (isOpen) {
      const loadFeedbackData = async () => {
        const data = await fetchFeedback(todayStr);
        if (active) {
          setSelectedLevel(data.mood);
          setMessage(data.note || "");
          if (data.mood) {
            const idx = moodLevels.findIndex(m => m.level === data.mood);
            if (idx !== -1) {
              setRotationAngle(-idx * 72);
            }
          } else {
            setRotationAngle(0);
          }
        }
      };
      loadFeedbackData();
      setHoveredLevel(null);
    }
    return () => {
      active = false;
    };
  }, [isOpen, todayStr]);

  const handleSelect = (level: number) => {
    setSelectedLevel(level);
    const idx = moodLevels.findIndex(m => m.level === level);
    if (idx !== -1) {
      const targetBaseAngle = -idx * 72;
      const currentRotation = rotationAngle;
      const adjustedDiff = (((targetBaseAngle - currentRotation + 180) % 360 + 360) % 360) - 180;
      setRotationAngle(currentRotation + adjustedDiff);
    }
  };

  const handleReset = () => {
    setSelectedLevel(null);
    setMessage("");
    setRotationAngle(0);
  };

  const handleConfirm = async () => {
    setIsSending(true);
    try {
      // 1. Update storage (Supabase with LocalStorage fallback)
      await saveFeedback(todayStr, {
        mood: selectedLevel,
        note: showCommentInput ? (message.trim() || null) : undefined,
      });

      // 2. Format Telegram message and send notification if either mood or text is filled
      if (selectedLevel || message.trim()) {
        const moodEmojiMap: Record<number, string> = {
          1: '🤒',
          2: '😕',
          3: '🦁',
          4: '✨',
          5: '👑',
        };

        const moodText = selectedLevel 
          ? t(tr[`level${selectedLevel}` as keyof typeof tr], lang) 
          : (lang === 'ru' ? 'Не выбрано' : 'Not selected');
        const moodEmoji = selectedLevel ? moodEmojiMap[selectedLevel] : '❓';

        let tgMsg = `🦁 <b>New Feedback from Lioness!</b>\n\n`;
        tgMsg += `📅 <b>Date:</b> <code>${todayStr}</code>\n`;
        tgMsg += `🎭 <b>Mood:</b> ${moodEmoji} ${moodText} (${selectedLevel || 0}/5)\n`;
        
        if (message.trim()) {
          tgMsg += `💬 <b>Message:</b>\n<blockquote>${message.trim()}</blockquote>`;
        }

        const sent = await sendTelegramNotification(tgMsg);
        if (sent) {
          showSuccess(
            lang === 'ru'
              ? "Отзыв успешно отправлен! ❤️"
              : "Feedback sent successfully! ❤️"
          );
        } else {
          showSuccess(
            lang === 'ru'
              ? "Сохранено (уведомление не отправлено)"
              : "Saved (notification failed)"
          );
        }
      } else {
        // If everything was reset and confirmed
        showSuccess(
          lang === 'ru'
            ? "Отзыв сброшен"
            : "Feedback reset"
        );
      }
      onClose(selectedLevel);
    } catch (err: any) {
      console.error(err);
      showError(
        lang === 'ru'
          ? `Не удалось сохранить отзыв: ${err.message || err}`
          : `Failed to save feedback: ${err.message || err}`
      );
    } finally {
      setIsSending(false);
    }
  };

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

  const radius = 96;
  const getCoordinates = (index: number, offsetAngle: number) => {
    const angle = (index * 360) / 5 - 90 + offsetAngle;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    return { x, y };
  };

  const dateStr = format(dateToUse, lang === 'ru' ? 'd MMMM' : 'MMMM d', { locale: lang === 'ru' ? ru : undefined });
  const subtitleText = isSameDay(dateToUse, new Date())
    ? (lang === 'ru' ? 'Как себя чувствует львица сегодня?' : 'How is the lioness feeling today?')
    : (lang === 'ru' ? `Как чувствовала себя львица ${dateStr}?` : `How did the lioness feel on ${dateStr}?`);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSending && onClose()}>
      <DialogContent className="max-w-[92vw] sm:max-w-md rounded-3xl border-[3px] border-border bg-card p-6 shadow-2xl flex flex-col gap-5 select-none overflow-y-auto max-h-[90vh]">
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
          className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-primary text-lg z-30 select-none animate-bounce">
            ▼
          </div>

          <div className="absolute w-[140px] h-[140px] rounded-full border-[3px] border-dashed border-border/20 pointer-events-none" />

          <div className={cn(
            "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-background border-[3px] border-border flex flex-col items-center justify-center p-2 text-center transition-all duration-300 shadow-inner z-10 pointer-events-none select-none",
            activeLevel && "scale-105"
          )}>
            {activeLevel ? (
              <div className="flex flex-col items-center gap-0.5 animate-in fade-in zoom-in duration-300">
                {renderMoodIcon(activeLevel, "w-10 h-10 sm:w-12 sm:h-12")}
                <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">
                  {activeLevel} / 5
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                <span className="text-2xl select-none animate-pulse">👑</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {lang === 'ru' ? 'Крути' : 'Spin'}
                </span>
              </div>
            )}
          </div>

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
                  transform: `translate(-50%, -50%) translate(${x * 0.8}px, ${y * 0.8}px) scale(${scale})`,
                }}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] flex items-center justify-center cursor-pointer focus:outline-none z-20 shadow-md",
                  !isDragging && "transition-all duration-500 ease-out",
                  isSelected
                    ? "bg-primary border-border shadow-lg ring-[2px] ring-primary/40 text-primary-foreground"
                    : cn(lvl.color, "bg-card border-border")
                )}
                aria-label={`Mood Level ${lvl.level}`}
              >
                <div className="transition-transform duration-300">
                  {renderMoodIcon(lvl.level, "w-6 h-6 sm:w-7 sm:h-7")}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected / Hovered Mood Text Box */}
        <div className="min-h-[3rem] flex items-center justify-center text-center p-2 rounded-2xl bg-primary/5 border-[3px] border-border border-dashed transition-all duration-300">
          <p className="text-sm font-bold text-foreground leading-snug">
            {activeMoodText}
          </p>
        </div>

        {/* Message Input Box */}
        {showCommentInput && (
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground pl-1">
              {t(tr.messageLabel, lang)}
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t(tr.messagePlaceholder, lang)}
              disabled={isSending}
              className="min-h-[80px] rounded-2xl border-[3px] border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary resize-none text-sm font-medium transition-all"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={(!selectedLevel && !message) || isSending}
            className={cn(
              "flex-1 py-3 px-4 rounded-2xl font-bold border-[3px] border-border text-foreground bg-card hover:bg-muted/10 transition-all active:scale-[0.98]",
              (!selectedLevel && !message) && "opacity-50 pointer-events-none"
            )}
          >
            {lang === 'ru' ? 'Сбросить' : 'Reset'}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSending}
            className="flex-[2] py-3 px-4 rounded-2xl font-bold bg-primary border-[3px] border-border text-primary-foreground hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t(tr.selectBtn, lang)
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
