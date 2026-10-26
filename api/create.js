import crypto from "node:crypto";
import { sb, userId, handler, err, EXT } from "./_lib.js";

export default handler(async (req, res) => {
  if (req.method !== "POST") throw err(405, "POST kerak");
  const uid = userId(req);
  const { title = "", files = [] } = req.body || {};
  if (!Array.isArray(files) || files.length < 1 || files.length > 20) throw err(400, "1 dan 20 tagacha fayl tanlang");

  const id = crypto.randomBytes(6).toString("base64url");
  const items = [], signed = [];
  for (const [n, f] of files.entries()) {
    const ext = EXT[f.type];
    if (!ext) throw err(400, "Faqat JPG, PNG, WEBP rasm va MP4, WEBM video mumkin");
    if (!(f.size > 0 && f.size <= 25 * 1024 * 1024)) throw err(413, "Fayl 25 MB dan katta");
    const path = `${id}/${n}.${ext}`;
    const { data, error } = await sb.storage.from("muzey").createSignedUploadUrl(path);
    if (error) throw err(500, error.message);
    signed.push({ path, token: data.token });
    items.push({ path, kind: ext === "mp4" || ext === "webm" ? "video" : "image" });
  }
  const t = String(title).trim().slice(0, 60) || "Mening muzeyim";
  const { error } = await sb.from("museums").insert({ id, owner: uid, title: t, items });
  if (error) throw err(500, error.message);
  res.json({ id, signed, url: process.env.SUPABASE_URL, key: process.env.SUPABASE_ANON_KEY });
});
