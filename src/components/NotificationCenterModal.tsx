import React, { useState, useEffect } from 'react';
import { Bell, Clock, Sparkles, Check, AlertCircle, Trash2, X, Send, Moon, Sun } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { translations, t } from '@/content/translations';
import {
  getTimeUntilNextNotification,
  getNotificationsEnabled,
  setNotificationsEnabled,
  getNotificationPermission,
  requestNotificationPermission,
  getNotificationHistory,
  markAllNotificationsAsRead,
  NotificationHistoryItem,
  isNotificationSupported,
} from '@/utils/notifications';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestNotification: () => void;
}

const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onTriggerTestNotification,
}) => {
  const { lang } = useLang();
  const tr = translations.notifications;

  const [countdown, setCountdown] = useState(() => getTimeUntilNextNotification());
  const [enabled, setEnabled] = useState(() => getNotificationsEnabled());
  const [permission, setPermission] = useState(() => getNotificationPermission());
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);

  // Update history & mark as read when modal opens
  useEffect(() => {
    if (isOpen) {
      setHistory(getNotificationHistory());
      markAllNotificationsAsRead();
      setPermission(getNotificationPermission());
    }
  }, [isOpen]);

  // Countdown timer loop
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown(getTimeUntilNextNotification());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnable = async () => {
    const nextState = !enabled;
    setEnabled(nextState);
    setNotificationsEnabled(nextState);

    if (nextState && isNotificationSupported() && permission === 'default') {
      const granted = await requestNotificationPermission();
      setPermission(getNotificationPermission());
      if (!granted) {
        // user declined or blocked
      }
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('myrzacute_notification_history');
    setHistory([]);
  };

  const isMidnightNext = countdown.type === 'midnight';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-card border-[3px] border-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-[2px] border-primary/30">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t(tr.title, lang)}</h2>
              <p className="text-xs text-muted-foreground">{t(tr.subtitle, lang)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          
          {/* Countdown Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-secondary border-[3px] border-primary/30 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Clock size={14} />
                {t(tr.nextNotification, lang)}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  isMidnightNext
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                }`}
              >
                {isMidnightNext ? <Moon size={12} /> : <Sun size={12} />}
                {isMidnightNext ? t(tr.midnightLabel, lang) : t(tr.middayLabel, lang)}
              </span>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-card/80 backdrop-blur rounded-2xl border-[2px] border-border">
                <div className="text-2xl font-black text-foreground">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                  {lang === 'ru' ? 'Часов' : 'Hours'}
                </div>
              </div>
              <div className="p-3 bg-card/80 backdrop-blur rounded-2xl border-[2px] border-border">
                <div className="text-2xl font-black text-foreground">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                  {lang === 'ru' ? 'Минут' : 'Mins'}
                </div>
              </div>
              <div className="p-3 bg-card/80 backdrop-blur rounded-2xl border-[2px] border-border">
                <div className="text-2xl font-black text-primary">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                  {lang === 'ru' ? 'Секунд' : 'Secs'}
                </div>
              </div>
            </div>
          </div>

          {/* Browser Notification Permissions Switch */}
          <div className="p-4 rounded-2xl border-[2px] border-border bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                {permission === 'granted' ? (
                  <Check size={18} className="text-green-500" />
                ) : permission === 'denied' ? (
                  <AlertCircle size={18} className="text-destructive" />
                ) : (
                  <Bell size={18} />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{t(tr.enablePush, lang)}</div>
                <div className="text-xs text-muted-foreground">
                  {permission === 'granted'
                    ? t(tr.pushEnabled, lang)
                    : permission === 'denied'
                    ? t(tr.pushDenied, lang)
                    : '00:00 & 12:00'}
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleEnable}
              className={`w-12 h-6 rounded-full border-[2px] transition-colors relative ${
                enabled ? 'bg-primary border-primary' : 'bg-muted border-border'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Test Notification Button */}
          <button
            onClick={() => {
              onClose();
              onTriggerTestNotification();
            }}
            className="w-full py-3 px-4 rounded-2xl border-[2px] border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Send size={16} />
            {t(tr.testBtn, lang)}
          </button>

          {/* Notification History Header */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary" />
              {t(tr.historyTitle, lang)}
            </h3>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} />
                {lang === 'ru' ? 'Очистить' : 'Clear'}
              </button>
            )}
          </div>

          {/* Notification History List */}
          {history.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground rounded-2xl border-[2px] border-dashed border-border">
              {t(tr.noHistory, lang)}
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border-[2px] border-border bg-card shadow-sm flex items-start gap-3"
                >
                  <div className="text-2xl select-none pt-0.5">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-foreground truncate">{item.title}</h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationCenterModal;
