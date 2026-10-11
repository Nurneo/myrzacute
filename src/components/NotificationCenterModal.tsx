import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check, AlertCircle, X } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
  isIOS,
  isStandalone,
} from '@/utils/notifications';
import { subscribeToPush, unsubscribeFromPush } from '@/utils/pushSubscription';
import IOSInstallGuideModal from './IOSInstallGuideModal';
import { toast } from 'sonner';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestNotification?: () => void;
}

const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useLang();
  const tr = translations.notifications;

  const [enabled, setEnabled] = useState(() => getNotificationsEnabled());
  const [permission, setPermission] = useState(() => getNotificationPermission());
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEnabled(getNotificationsEnabled());
      setPermission(getNotificationPermission());
    }
  }, [isOpen]);

  // Lock body scroll so page behind doesn't shift while open
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

  const handleToggleEnable = async () => {
    if (isIOS() && !isStandalone()) {
      setShowIOSModal(true);
      return;
    }

    const nextState = !enabled;
    setEnabled(nextState);
    setNotificationsEnabled(nextState);

    if (nextState) {
      if (isNotificationSupported()) {
        const granted = await requestNotificationPermission();
        setPermission(getNotificationPermission());
        if (granted) {
          await subscribeToPush();
          toast.success(
            lang === 'ru'
              ? 'Уведомления включены! 🔔'
              : 'Notifications enabled! 🔔'
          );
        }
      }
    } else {
      await unsubscribeFromPush();
      toast.info(
        lang === 'ru'
          ? 'Уведомления выключены'
          : 'Notifications disabled'
      );
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[340px] bg-card border-[3px] border-border rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[2px] border-primary/30">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">{t(tr.title, lang)}</h2>
              <p className="text-xs text-muted-foreground font-semibold">00:00 & 12:00</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Turn On / Off Toggle Card */}
        <div className="mt-5 p-4 rounded-2xl border-[2px] border-border bg-secondary/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl transition-colors ${
              enabled ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {permission === 'denied' ? (
                <AlertCircle size={20} className="text-destructive" />
              ) : enabled ? (
                <Check size={20} className="text-primary font-bold" />
              ) : (
                <Bell size={20} />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-foreground truncate">
                {lang === 'ru' ? 'Уведомления' : 'Notifications'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {enabled
                  ? (lang === 'ru' ? 'Включены' : 'Enabled')
                  : (lang === 'ru' ? 'Выключены' : 'Disabled')}
              </div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={handleToggleEnable}
            className={`w-14 h-8 rounded-full border-[2px] transition-colors p-0.5 flex items-center relative cursor-pointer active:scale-95 ${
              enabled ? 'bg-primary border-primary' : 'bg-muted border-border'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full bg-white dark:bg-card shadow-md transition-transform duration-200 transform ${
                enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Browser Settings Warning if Denied */}
        {permission === 'denied' && (
          <p className="text-[11px] text-destructive font-medium mt-3 text-center px-1">
            {t(tr.pushDenied, lang)}
          </p>
        )}
      </div>

      {/* iOS Safari Home Screen Guide */}
      <IOSInstallGuideModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </div>,
    document.body
  );
};

export default NotificationCenterModal;
