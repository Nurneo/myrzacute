import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/subscribe
 * Receives a Web Push subscription from the client and upserts it into Supabase.
 *
 * Body: { subscription: PushSubscription, userAgent?: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription, userAgent } = req.body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json({ error: 'Invalid push subscription object' });
    }

    // Initialize Supabase with server-side env vars (not VITE_ prefixed)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upsert: on conflict by endpoint, update keys + last_seen_at
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          endpoint: subscription.endpoint,
          keys_p256dh: subscription.keys.p256dh,
          keys_auth: subscription.keys.auth,
          user_agent: userAgent || null,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      );

    if (error) {
      console.error('Supabase upsert error:', error);
      return res.status(500).json({ error: 'Failed to save subscription' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
