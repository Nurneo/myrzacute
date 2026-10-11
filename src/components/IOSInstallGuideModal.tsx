import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Share, PlusSquare, Sparkles, X, Smartphone, ShieldCheck } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

interface IOSInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLang();

  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const isSecure = typeof window !== 'undefined' && window.isSecureContext;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-card border-[3px] border-border rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[2px] border-primary/30">
              <Smartphone size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {lang === 'ru' ? 'Уведомления на iPhone' : 'Notifications on iPhone'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {lang === 'ru' ? 'Правило безопасности Apple iOS' : 'Apple iOS Requirement'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-left">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {lang === 'ru'
              ? 'На iOS (iPhone/iPad) веб-уведомления работают только если приложение добавлено на экран «Домой» (как отдельное приложение):'
              : 'On iOS, Apple requires web apps to be added to the Home Screen to receive system notifications:'}
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/40 border-[2px] border-border">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Share size={16} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-foreground block">
                  {lang === 'ru' ? '1. Нажмите «Поделиться»' : '1. Tap the Share button'}
                </span>
                <span className="text-muted-foreground">
                  {lang === 'ru' ? 'В нижней панели Safari (иконка квадрата со стрелкой вверх).' : 'In Safari bottom bar (the square icon with up arrow).'}
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/40 border-[2px] border-border">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <PlusSquare size={16} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-foreground block">
                  {lang === 'ru' ? '2. Выберите «На экран «Домой»»' : '2. Select "Add to Home Screen"'}
                </span>
                <span className="text-muted-foreground">
                  {lang === 'ru' ? 'Прокрутите меню вниз и нажмите «На экран «Домой»».' : 'Scroll down the share sheet and tap "Add to Home Screen".'}
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/40 border-[2px] border-border">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-foreground block">
                  {lang === 'ru' ? '3. Откройте с экрана «Домой»' : '3. Open from your Home Screen'}
                </span>
                <span className="text-muted-foreground">
                  {lang === 'ru' ? 'Запустите иконку Myrzacute с рабочего стола и включите уведомления 🔔.' : 'Launch the Myrzacute icon from home screen and turn on notifications 🔔.'}
                </span>
              </div>
            </div>
          </div>

          {!isSecure && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <ShieldCheck size={18} className="flex-shrink-0" />
              <span>
                {lang === 'ru'
                  ? 'Apple блокирует уведомления на небезопасных IP (http://). На Netlify с HTTPS (https://...) всё работает идеально!'
                  : 'Apple blocks notifications on insecure HTTP. It works properly once deployed to Netlify with HTTPS!'}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-2 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-98 transition-all"
          >
            {lang === 'ru' ? 'Понятно' : 'Got it'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default IOSInstallGuideModal;
