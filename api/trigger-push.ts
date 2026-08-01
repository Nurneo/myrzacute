import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { getPushMessage } from './_lib/pushMessages';

/**
 * POST /api/trigger-push
 * Called when user types 000000 on the keypad or taps the bell button.
 * Sends a Web Push notification to ALL registered devices.
 *
 * Body (optional): { title?: string, body?: string, icon?: string, type?: string, messageIndex?: number }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:myrzacute@proton.me';

    if (!vapidPublicKey || !vapidPrivateKey) {
      return res.status(500).json({ error: 'VAPID keys not configured' });
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // Get notification content
    const { title, body, icon, type, messageIndex } = req.body || {};
    const pushType = type || 'secret';
    const message = getPushMessage(pushType, messageIndex);

    const payload = JSON.stringify({
      title: title || message.title,
      body: body || message.body,
      icon: icon || message.icon,
    });

    // Fetch all subscriptions from Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'No subscriptions found' });
    }

    // Send push to all registered devices
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys_p256dh,
            auth: sub.keys_auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscription, payload);
          return { endpoint: sub.endpoint, status: 'sent' };
        } catch (err: any) {
          // 410 Gone or 404 = subscription expired, clean up
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint);
            return { endpoint: sub.endpoint, status: 'expired_removed' };
          }
          console.error(`Push failed for ${sub.endpoint}:`, err.message);
          return { endpoint: sub.endpoint, status: 'failed', error: err.message };
        }
      })
    );

    const sent = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any).status === 'sent'
    ).length;
    const expired = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any).status === 'expired_removed'
    ).length;

    return res.status(200).json({
      success: true,
      sent,
      expired,
      total: subscriptions.length,
    });
  } catch (err) {
    console.error('Trigger push error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
