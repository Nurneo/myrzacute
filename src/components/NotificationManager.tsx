import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useLang } from '@/context/LanguageContext';
import { getNotificationMessage } from '@/content/notificationMessages';
import { translations, t } from '@/content/translations';
import {
  getCurrentSlotInfo,
  getLastNotifiedSlot,
  setLastNotifiedSlot,
  addNotificationToHistory,
  showNativeNotification,
  getNotificationsEnabled,
  scheduleSWBackgroundSlot,
  getNextNotificationTarget,
  isWithinScheduledWindow,
} from '@/utils/notifications';
import { supabase } from '@/utils/supabase';
import CuteNotificationModal from './CuteNotificationModal';

interface NotificationContextType {
  triggerNotification: (
    title?: string,
    message?: string,
    icon?: string,
    type?: 'midnight' | 'midday' | 'secret',
    explicitIndex?: number
  ) => void;
  broadcastNotification: (
    title?: string,
    message?: string,
    icon?: string,
    type?: 'midnight' | 'midday' | 'secret',
    explicitIndex?: number
  ) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  triggerNotification: () => {},
  broadcastNotification: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useLang();
  const tr = translations.notifications;

  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    type: 'midnight' | 'midday';
    title: string;
    message: string;
    icon: string;
  } | null>(null);

  const triggerNotification = useCallback(
    (
      customTitle?: string,
      customMessage?: string,
      customIcon?: string,
      customType?: 'midnight' | 'midday' | 'secret',
      explicitIndex?: number
    ) => {
      const now = new Date();
      const slotInfo = getCurrentSlotInfo(now);
      const type = customType || slotInfo.type;
      const content = getNotificationMessage(type, slotInfo.dateStr, lang, explicitIndex);

      const title = customTitle || content.title;
      const message = customMessage || content.message;
      const icon = customIcon || content.icon;
      const modalType: 'midnight' | 'midday' = type === 'midnight' ? 'midnight' : 'midday';

      // Add to history
      addNotificationToHistory({
        id: `notif_${Date.now()}`,
        slotKey: `slot_${Date.now()}`,
        type: modalType,
        title,
        message,
        icon,
        timestamp: new Date().toISOString(),
        read: false,
      });

      // Send native system alert & Telegram push
      showNativeNotification(title, message, icon);

      // Pop in-app cute modal
      setActiveModal({
        isOpen: true,
        type: modalType,
        title,
        message,
        icon,
      });
    },
    [lang]
  );

  const broadcastNotification = useCallback(
    (
      customTitle?: string,
      customMessage?: string,
      customIcon?: string,
      customType?: 'midnight' | 'midday' | 'secret',
      explicitIndex?: number
    ) => {
      // First trigger locally on sender device
      triggerNotification(customTitle, customMessage, customIcon, customType, explicitIndex);

      // Broadcast payload to all other connected devices in real time via Supabase Realtime
      if (supabase) {
        const channel = supabase.channel('global_notifications');
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            channel.send({
              type: 'broadcast',
              event: 'remote_notification',
              payload: {
                customTitle,
                customMessage,
                customIcon,
                customType,
                explicitIndex,
                senderTime: Date.now(),
              },
            });
          }
        });
      }
    },
    [triggerNotification]
  );

  // Listen for broadcast events from other devices
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel('global_notifications');
    channel
      .on('broadcast', { event: 'remote_notification' }, (event) => {
        if (event.payload) {
          const { customTitle, customMessage, customIcon, customType, explicitIndex } = event.payload;
          triggerNotification(customTitle, customMessage, customIcon, customType, explicitIndex);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [triggerNotification]);

  const checkScheduledNotifications = useCallback(() => {
    if (!getNotificationsEnabled()) return;

    const now = new Date();
    const { slotKey, type, dateStr } = getCurrentSlotInfo(now);
    const lastNotified = getLastNotifiedSlot();

    // Fire ONLY if this slot hasn't been notified AND current time is within strict 6-minute window
    if (lastNotified !== slotKey) {
      const windowInfo = isWithinScheduledWindow(now);

      // If outside the 6-minute window (23:59-00:05 or 11:59-12:05), do NOT fire late notification.
      // Update lastNotifiedSlot to mark this slot as expired/seen without bothering the user.
      if (!windowInfo.inWindow) {
        setLastNotifiedSlot(slotKey);
        return;
      }

      const content = getNotificationMessage(type, dateStr, lang);

      addNotificationToHistory({
        id: `${slotKey}_${Date.now()}`,
        slotKey,
        type,
        title: content.title,
        message: content.message,
        icon: content.icon,
        timestamp: new Date().toISOString(),
        read: false,
      });

      setLastNotifiedSlot(slotKey);
      showNativeNotification(content.title, content.message, content.icon);

      setActiveModal({
        isOpen: true,
        type,
        title: content.title,
        message: content.message,
        icon: content.icon,
      });
    }

    // Schedule next slot for Service Worker OS-level background trigger
    const { targetDate, type: nextType } = getNextNotificationTarget(now);
    const nextDateStr = nextType === 'midnight' ? targetDate.toISOString().split('T')[0] : dateStr;
    const nextContent = getNotificationMessage(nextType, nextDateStr, lang);
    scheduleSWBackgroundSlot(nextContent.title, nextContent.message, targetDate.getTime());
  }, [lang]);

  // Check on mount, on interval (5s), and on window focus / visibilitychange
  useEffect(() => {
    checkScheduledNotifications();

    const interval = setInterval(checkScheduledNotifications, 5000);

    const handleFocusOrVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkScheduledNotifications();
      }
    };

    window.addEventListener('focus', handleFocusOrVisibility);
    document.addEventListener('visibilitychange', handleFocusOrVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocusOrVisibility);
      document.removeEventListener('visibilitychange', handleFocusOrVisibility);
    };
  }, [checkScheduledNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        triggerNotification,
        broadcastNotification,
      }}
    >
      {children}

      {/* Cute Active Notification Modal */}
      {activeModal && (
        <CuteNotificationModal
          isOpen={activeModal.isOpen}
          onClose={() => setActiveModal(null)}
          type={activeModal.type}
          title={activeModal.title}
          message={activeModal.message}
          icon={activeModal.icon}
        />
      )}
    </NotificationContext.Provider>
  );
};

