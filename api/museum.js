import { sb, PUB, handler, err } from "./_lib.js";

export default handler(async (req, res) => {
  const { data } = await sb.from("museums").select("title, items").eq("id", String(req.query.id)).maybeSingle();
  if (!data) throw err(404, "Muzey topilmadi");
  res.json({ title: data.title, items: data.items.map((i) => ({ src: `${PUB}/${i.path}`, kind: i.kind })) });
});
