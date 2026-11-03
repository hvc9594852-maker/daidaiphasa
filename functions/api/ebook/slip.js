// POST /api/ebook/slip {id, k, slip: "data:image/jpeg;base64,..."} — buyer attaches the transfer slip
import { json } from '../../_lib/db.js';
import { edb } from '../../_lib/ebook.js';

export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch (e) { return json(400, { error: 'json' }); }
  const slip = String(b.slip || '');
  if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(slip)) return json(400, { error: 'ไฟล์สลิปไม่ถูกต้อง' });
  if (slip.length > 900000) return json(413, { error: 'รูปสลิปใหญ่เกินไป' });
  const DB = await edb(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  const o = await DB.prepare(`SELECT id,status FROM ebook_orders WHERE id=?1 AND k=?2`).bind(String(b.id || ''), String(b.k || '')).first();
  if (!o) return json(404, { error: 'ไม่พบคำสั่งซื้อ' });
  if (o.status === 'approved') return json(200, { ok: true, status: 'approved' });
  await DB.prepare(`UPDATE ebook_orders SET slip=?1, status='review', slip_at=datetime('now') WHERE id=?2`).bind(slip, o.id).run();
  return json(200, { ok: true, status: 'review' });
}
