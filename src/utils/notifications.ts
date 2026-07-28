import { format, addDays } from 'date-fns';
import { sendTelegramNotification } from './telegram';

const STORAGE_KEY_ENABLED = 'myrzacute_notifications_enabled';
const STORAGE_KEY_HISTORY = 'myrzacute_notification_history';
const STORAGE_KEY_LAST_SLOT = 'myrzacute_last_notification_slot';

export interface NotificationHistoryItem {
  id: string;
  slotKey: string;
  type: 'midnight' | 'midday';
  title: string;
  message: string;
  icon: string;
  timestamp: string;
  read: boolean;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export function getNotificationsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
  return stored === null ? true : stored === 'true';
}

export function setNotificationsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
}

export async function showNativeNotification(title: string, body: string, icon = '💖'): Promise<boolean> {
  // Always attempt Telegram notification push so user gets notified on phone even if browser is closed/blocked
  sendTelegramNotification(`${icon} <b>${title}</b>\n\n${body}`).catch((err) => {
    console.warn('Telegram notification push failed:', err);
  });

  if (!isNotificationSupported()) return false;

  // Do NOT auto-request permission here as background timers will trigger browser security blocks.
  // Native notifications will only fire if permission is already granted by user interaction.
  if (Notification.permission !== 'granted') return false;

  // 1. Try Service Worker registration showNotification (Required for iOS Safari / Android PWA)
  try {
    if ('serviceWorker' in navigator) {
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<ServiceWorkerRegistration | null>((resolve) => setTimeout(() => resolve(null), 500)),
      ]);

      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `myrzacute-${Date.now()}`,
          vibrate: [200, 100, 200, 100, 200],
        } as NotificationOptions);
        return true;
      }
    }
  } catch (err) {
    console.warn('Service worker showNotification failed:', err);
  }

  // 2. Fallback for Desktop browsers supporting classic constructor
  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `myrzacute-${Date.now()}`,
    });
    return true;
  } catch (e) {
    console.warn('Native notification fallback failed:', e);
    return false;
  }
}

export function scheduleSWBackgroundSlot(title: string, message: string, targetTimeMs: number): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_OS_NOTIFICATION',
        title,
        message,
        targetTimeMs,
      });
    }
  } catch (err) {
    console.warn('Failed to send background schedule message to Service Worker:', err);
  }
}

/**
 * Returns current slot info based on the time.
 * Slots:
 * 00:00 - 11:59: '00:00' (midnight)
 * 12:00 - 23:59: '12:00' (midday)
 */
export function getCurrentSlotInfo(now: Date = new Date()): {
  slotKey: string;
  type: 'midnight' | 'midday';
  dateStr: string;
} {
  const dateStr = format(now, 'yyyy-MM-dd');
  const hours = now.getHours();
  const isMidnightSlot = hours < 12;

  const type: 'midnight' | 'midday' = isMidnightSlot ? 'midnight' : 'midday';
  const slotKey = `${dateStr}_${isMidnightSlot ? '00:00' : '12:00'}`;

  return { slotKey, type, dateStr };
}

/**
 * Gets the next target Date for 00:00 or 12:00 notification.
 */
export function getNextNotificationTarget(now: Date = new Date()): {
  targetDate: Date;
  type: 'midnight' | 'midday';
} {
  const hours = now.getHours();
  const targetDate = new Date(now);

  if (hours < 12) {
    // Next is 12:00 PM today
    targetDate.setHours(12, 0, 0, 0);
    return { targetDate, type: 'midday' };
  } else {
    // Next is 00:00 AM tomorrow
    const tomorrow = addDays(now, 1);
    tomorrow.setHours(0, 0, 0, 0);
    return { targetDate: tomorrow, type: 'midnight' };
  }
}

/**
 * Calculate countdown until next scheduled 00:00 or 12:00 notification
 */
export function getTimeUntilNextNotification(now: Date = new Date()): {
  hours: number;
  minutes: number;
  seconds: number;
  type: 'midnight' | 'midday';
  targetDate: Date;
} {
  const { targetDate, type } = getNextNotificationTarget(now);
  const diffMs = Math.max(0, targetDate.getTime() - now.getTime());

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, type, targetDate };
}

export function getLastNotifiedSlot(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_LAST_SLOT);
}

export function setLastNotifiedSlot(slotKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_LAST_SLOT, slotKey);
}

export function getNotificationHistory(): NotificationHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addNotificationToHistory(item: NotificationHistoryItem): NotificationHistoryItem[] {
  const history = getNotificationHistory();
  // Avoid duplicate slots in history
  const filtered = history.filter(h => h.slotKey !== item.slotKey);
  const updated = [item, ...filtered].slice(0, 30); // Keep last 30
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  }
  return updated;
}

export function getUnreadNotificationCount(): number {
  const history = getNotificationHistory();
  return history.filter(item => !item.read).length;
}

export function markAllNotificationsAsRead(): NotificationHistoryItem[] {
  const history = getNotificationHistory();
  const updated = history.map(item => ({ ...item, read: true }));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  }
  return updated;
}
