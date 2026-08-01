import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { getPushMessage } from './_lib/pushMessages';

/**
 * GET /api/cron-notify
 * Called by Vercel Cron at:
 *   - 0 18 * * * (00:00 UTC+6 = 18:00 UTC) → midnight push
 *   - 0 6 * * *  (12:00 UTC+6 = 06:00 UTC) → midday push
 *
 * Also supports manual test via query param: ?test=midnight or ?test=midday
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify cron secret (Vercel auto-injects CRON_SECRET for cron invocations)
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers['authorization'];
    const testMode = req.query.test as string | undefined;

    // In production, verify the cron secret. Allow test mode without auth for manual testing.
    if (!testMode && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:myrzacute@proton.me';

    if (!vapidPublicKey || !vapidPrivateKey) {
      return res.status(500).json({ error: 'VAPID keys not configured' });
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // Determine push type from time or test param
    let pushType: 'midnight' | 'midday';

    if (testMode === 'midnight' || testMode === 'midday') {
      pushType = testMode;
    } else {
      // Determine from current UTC+6 time
      const nowUTC = new Date();
      const utcPlus6Hour = (nowUTC.getUTCHours() + 6) % 24;
      // 18:00 UTC = 00:00 UTC+6 → midnight
      // 06:00 UTC = 12:00 UTC+6 → midday
      pushType = utcPlus6Hour >= 22 || utcPlus6Hour < 6 ? 'midnight' : 'midday';
    }

    const message = getPushMessage(pushType);
    const payload = JSON.stringify({
      title: message.title,
      body: message.body,
      icon: message.icon,
    });

    // Fetch all subscriptions
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
      return res.status(200).json({
        success: true,
        type: pushType,
        sent: 0,
        message: 'No subscriptions found',
      });
    }

    // Send push to all devices
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
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint);
            return { endpoint: sub.endpoint, status: 'expired_removed' };
          }
          console.error(`Cron push failed for ${sub.endpoint}:`, err.message);
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
      type: pushType,
      sent,
      expired,
      total: subscriptions.length,
    });
  } catch (err) {
    console.error('Cron notify error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
