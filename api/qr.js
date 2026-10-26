import QRCode from "qrcode";
import { sb, handler, err } from "./_lib.js";

export default handler(async (req, res) => {
  const id = String(req.query.id);
  const { data } = await sb.from("museums").select("id").eq("id", id).maybeSingle();
  if (!data) throw err(404, "Muzey topilmadi");
  const png = await QRCode.toBuffer(`https://${req.headers.host}/m/${id}`, { margin: 2, scale: 10, color: { dark: "#b3264a" } });
  res.setHeader("Content-Type", "image/png");
  res.send(png);
});
