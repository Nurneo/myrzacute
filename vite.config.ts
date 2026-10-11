import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function devApiPlugin(): Plugin {
  return {
    name: "dev-api-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          return res.end();
        }

        const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://frkrbcihxffqbustjeed.supabase.co";
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZya3JiY2loeGZmcWJ1c3RqZWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMTUyNTYsImV4cCI6MjA5ODg5MTI1Nn0.p_9W9_QTMhD1X26dlv4oubDS4Gw3Qonr-LfQrpLchrc";
        const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || "BFAatbFKzG8tzk02Ovbv3hsdQS1bwuD7NyPWw2LLPgvZ9RMlyH06WWmbs0Z-MDzWry_BQzO_ir8_bnHpk1IL65o";
        const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "gP7JjxA26w0aXcs9TIJmyy4uuO4Q-tDd-VTpRxdtDi0";
        const vapidSubject = process.env.VAPID_SUBJECT || "mailto:myrzacute@proton.me";

        // POST /api/subscribe
        if (req.url.startsWith("/api/subscribe") && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => { body += chunk; });
          req.on("end", async () => {
            try {
              const { subscription, userAgent } = JSON.parse(body);
              const { createClient } = await import("@supabase/supabase-js");
              const supabase = createClient(supabaseUrl, supabaseKey);
              await supabase.from("push_subscriptions").upsert({
                endpoint: subscription.endpoint,
                keys_p256dh: subscription.keys.p256dh,
                keys_auth: subscription.keys.auth,
                user_agent: userAgent || null,
                last_seen_at: new Date().toISOString(),
              }, { onConflict: "endpoint" });
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // POST /api/trigger-push
        if (req.url.startsWith("/api/trigger-push") && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => { body += chunk; });
          req.on("end", async () => {
            try {
              const data = JSON.parse(body || "{}");
              const { title, body: msgBody, icon, delaySeconds } = data;
              if (typeof delaySeconds === "number" && delaySeconds > 0) {
                await new Promise((r) => setTimeout(r, delaySeconds * 1000));
              }

              const webpush = (await import("web-push")).default;
              webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

              const { createClient } = await import("@supabase/supabase-js");
              const supabase = createClient(supabaseUrl, supabaseKey);
              const { data: subs } = await supabase.from("push_subscriptions").select("*");

              const payload = JSON.stringify({
                title: title || "Myrzacute 💖",
                body: msgBody || "У вас новое милое сообщение!",
                icon: icon || "/icons/icon-192.png",
              });

              let sent = 0;
              if (subs && subs.length > 0) {
                for (const sub of subs) {
                  try {
                    await webpush.sendNotification({
                      endpoint: sub.endpoint,
                      keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
                    }, payload);
                    sent++;
                  } catch (e: any) {
                    if (e.statusCode === 410 || e.statusCode === 404) {
                      await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
                    }
                  }
                }
              }

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, sent, total: subs?.length || 0 }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), devApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "vendor-react";
            }
            if (id.includes("date-fns")) {
              return "vendor-datefns";
            }
            if (id.includes("lucide-react")) {
              return "vendor-lucide";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-ui";
            }
            return "vendor-others";
          }
        },
      },
    },
  },
}));
