import { supabase } from '@/utils/supabase';

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
    ('PushManager' in window ||
      (typeof ServiceWorkerRegistration !== 'undefined' &&
        'pushManager' in ServiceWorkerRegistration.prototype)) &&
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
    if (!registration?.pushManager) return false;
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
 * 3. Upserts directly to Supabase push_subscriptions table
 * 4. Also calls /api/subscribe as fallback
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
    if (!registration?.pushManager) {
      console.warn('pushManager is not available on ServiceWorkerRegistration (on iOS, app must be added to Home Screen first)');
      return false;
    }

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

    const jsonSub = subscription.toJSON();

    // 1. DIRECT WRITE TO SUPABASE (Guarantees registration even without backend serverless function!)
    if (jsonSub?.endpoint && jsonSub.keys?.p256dh && jsonSub.keys?.auth && supabase) {
      try {
        const { error: sbError } = await supabase
          .from('push_subscriptions')
          .upsert(
            {
              endpoint: jsonSub.endpoint,
              keys_p256dh: jsonSub.keys.p256dh,
              keys_auth: jsonSub.keys.auth,
              user_agent: navigator.userAgent,
              last_seen_at: new Date().toISOString(),
            },
            { onConflict: 'endpoint' }
          );

        if (sbError) {
          console.warn('Direct Supabase push subscription upsert error:', sbError);
        } else {
          console.log('✅ Device successfully registered in Supabase push_subscriptions table!');
        }
      } catch (sbCatch) {
        console.warn('Supabase direct write exception:', sbCatch);
      }
    }

    // 2. Also POST to /api/subscribe for serverless logging
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: jsonSub,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});

    console.log('✅ Web Push subscription active');
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
    if (!registration?.pushManager) return false;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      if (subscription.endpoint && supabase) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint);
      }
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
 * @param delaySeconds - Optional delay before server sends push (allows user to close app and test lock screen)
 */
export async function triggerRemotePush(
  title?: string,
  body?: string,
  icon?: string,
  type?: string,
  messageIndex?: number,
  delaySeconds?: number
): Promise<{ success: boolean; sent?: number; message?: string }> {
  try {
    const response = await fetch('/api/trigger-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, icon, type, messageIndex, delaySeconds }),
    });

    if (!response.ok) {
      console.error('Remote push trigger failed:', response.statusText);
      return { success: false };
    }

    const data = await response.json();
    return { success: true, sent: data.sent, message: data.message };
  } catch (err) {
    console.error('Error triggering remote push:', err);
    return { success: false };
  }
}
