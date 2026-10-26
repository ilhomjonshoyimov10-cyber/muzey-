import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});
export const PUB = `${process.env.SUPABASE_URL}/storage/v1/object/public/muzey`;
export const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "video/mp4": "mp4", "video/webm": "webm" };
export const err = (status, message) => Object.assign(new Error(message), { status });

export const handler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (e) {
    res.status(e.status || 500).json({ detail: e.status ? e.message : "Server xatosi" });
  }
};

// Telegram Mini App initData'ni tekshiradi, foydalanuvchi ID'sini qaytaradi.
export function userId(req) {
  const init = req.headers["x-init"] || "";
  if (!init && process.env.DEV) return 0;
  const p = new URLSearchParams(init);
  const hash = p.get("hash") || "";
  p.delete("hash");
  const check = [...p.entries()].map(([k, v]) => `${k}=${v}`).sort().join("\n");
  const key = crypto.createHmac("sha256", "WebAppData").update(process.env.BOT_TOKEN).digest();
  const good = crypto.createHmac("sha256", key).update(check).digest("hex");
  const ok = hash.length === good.length && crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(good));
  if (!ok || Date.now() / 1000 - Number(p.get("auth_date")) > 86400) throw err(401, "Telegram ichida oching");
  return JSON.parse(p.get("user")).id;
}
