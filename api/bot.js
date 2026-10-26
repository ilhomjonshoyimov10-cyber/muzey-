// Telegram webhook: /start bosilganda salom va ikkita Mini App tugmasi yuboradi.
export default async function handler(req, res) {
  if (req.headers["x-telegram-bot-api-secret-token"] !== process.env.WEBHOOK_SECRET) return res.status(403).send("no");
  const m = req.body && req.body.message;
  if (m && m.text && m.text.startsWith("/start")) {
    const base = `https://${req.headers.host}`;
    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: m.chat.id,
        text:
          `Assalomu alaykum, ${m.from.first_name}! 👋\n\n` +
          "Rasm va videolaringizdan kichkina 3D muzey yarating: ichida yurib, suratlarni devordagi ramkalarda tomosha qilasiz.\n\n" +
          "1️⃣ «Muzey yaratish»ni bosing va fayllarni tanlang\n" +
          "2️⃣ Muzey shu zahoti ochiladi, aylanib ko'ring\n" +
          "3️⃣ Yoqsa, yaqiningizga havola yoki QR yuboring 💝",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🏛 Muzey yaratish", web_app: { url: `${base}/create` } }],
            [{ text: "📂 Muzeylarim", web_app: { url: `${base}/my` } }],
          ],
        },
      }),
    });
  }
  res.status(200).send("ok");
}
