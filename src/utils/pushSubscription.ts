/**
 * Client-side Web Push subscription utility.
 * Handles PushManager subscription with VAPID keys and
 * registers the subscription with the backend API.
 */

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * Convert a URL-safe base64 string to a Uint8Array (required by PushManager.subscribe).
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if Web Push (PushManager) is supported in this browser.
 */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    !!VAPID_PUBLIC_KEY
  );
}

/**
 * Check if the browser currently has an active PushManager subscription.
 */
export async function isSubscribedToPush(): Promise<boolean> {
  if (!isPushSupported()) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (err) {
    console.warn('Error checking push subscription status:', err);
    return false;
  }
}

/**
 * Subscribe to Web Push notifications.
 * 1. Waits for Service Worker registration
 * 2. Calls pushManager.subscribe() with VAPID application server key
 * 3. POSTs the subscription to /api/subscribe to store in Supabase
 *
 * @returns true if subscription was successful, false otherwise
 */
export async function subscribeToPush(): Promise<boolean> {
  if (!isPushSupported()) {
    console.warn('Web Push not supported or VAPID key missing');
    return false;
  }

  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      } catch (subErr) {
        // If failed (e.g. key mismatch from previous test), attempt clean resubscribe
        console.warn('Initial pushManager.subscribe failed, attempting reset:', subErr);
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          await existing.unsubscribe();
        }
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }
    }

    if (!subscription) {
      return false;
    }

    // Send subscription to backend for storage
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      console.error('Failed to register push subscription with server:', response.status);
      return false;
    }

    console.log('✅ Web Push subscription registered successfully');
    return true;
  } catch (err) {
    console.error('Error subscribing to push:', err);
    return false;
  }
}

/**
 * Unsubscribe from Web Push notifications.
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log('Successfully unsubscribed from Web Push');
    }
    return true;
  } catch (err) {
    console.error('Error unsubscribing from push:', err);
    return false;
  }
}

/**
 * Trigger a remote push notification to ALL registered devices
 * by calling the server-side /api/trigger-push endpoint.
 *
 * @param title - Notification title
 * @param body - Notification body  
 * @param icon - Emoji icon
 * @param type - 'midnight' | 'midday' | 'secret'
 * @param messageIndex - Explicit message index
 */
export async function triggerRemotePush(
  title?: string,
  body?: string,
  icon?: string,
  type?: string,
  messageIndex?: number
): Promise<{ success: boolean; sent?: number }> {
  try {
    const response = await fetch('/api/trigger-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, icon, type, messageIndex }),
    });

    if (!response.ok) {
      console.error('Remote push trigger failed:', response.statusText);
      return { success: false };
    }

    const data = await response.json();
    return { success: true, sent: data.sent };
  } catch (err) {
    console.error('Error triggering remote push:', err);
    return { success: false };
  }
}
