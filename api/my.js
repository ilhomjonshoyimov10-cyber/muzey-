import { sb, userId, handler, err } from "./_lib.js";

export default handler(async (req, res) => {
  const uid = userId(req);
  const { data, error } = await sb.from("museums").select("id, title").eq("owner", uid).order("created_at", { ascending: false });
  if (error) throw err(500, error.message);
  res.json(data);
});
