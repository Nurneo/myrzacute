import type { Config } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { getPushMessage } from './_lib/pushMessages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const testMode = url.searchParams.get('test');

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || process.env.VITE_VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:myrzacute@proton.me';

    if (!vapidPublicKey || !vapidPrivateKey) {
      return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    let pushType: 'midnight' | 'midday';
    if (testMode === 'midnight' || testMode === 'midday') {
      pushType = testMode;
    } else {
      const nowUTC = new Date();
      const utcPlus6Hour = (nowUTC.getUTCHours() + 6) % 24;
      pushType = utcPlus6Hour >= 22 || utcPlus6Hour < 6 ? 'midnight' : 'midday';
    }

    const message = getPushMessage(pushType);
    const payload = JSON.stringify({
      title: message.title,
      body: message.body,
      icon: message.icon,
    });

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch subscriptions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          type: pushType,
          sent: 0,
          message: 'No subscriptions found',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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

    return new Response(
      JSON.stringify({
        success: true,
        type: pushType,
        sent,
        expired,
        total: subscriptions.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Cron notify error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

export const config: Config = {
  schedule: '0 6,18 * * *',
};
