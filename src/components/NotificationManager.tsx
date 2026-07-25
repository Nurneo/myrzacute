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
} from '@/utils/notifications';
import CuteNotificationModal from './CuteNotificationModal';

interface NotificationContextType {
  triggerNotification: (
    title?: string,
    message?: string,
    icon?: string,
    type?: 'midnight' | 'midday' | 'secret',
    explicitIndex?: number
  ) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  triggerNotification: () => {},
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

      // Send browser / mobile native system alert
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

  const checkScheduledNotifications = useCallback(() => {
    if (!getNotificationsEnabled()) return;

    const now = new Date();
    const { slotKey, type, dateStr } = getCurrentSlotInfo(now);
    const lastNotified = getLastNotifiedSlot();

    if (lastNotified !== slotKey) {
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
  }, [lang]);

  // Check on mount and periodically every 15 seconds
  useEffect(() => {
    checkScheduledNotifications();
    const interval = setInterval(checkScheduledNotifications, 15000);
    return () => clearInterval(interval);
  }, [checkScheduledNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        triggerNotification,
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
