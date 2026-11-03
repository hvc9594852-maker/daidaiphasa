// GET /api/ebook/qr — the shop's own PromptPay QR image (uploaded by the owner in /admin)
import { edb } from '../../_lib/ebook.js';
import { isAdmin } from '../../_lib/db.js';
// shown only to someone holding an open order (the QR carries the owner's PromptPay ID)
export async function onRequestGet({ request, env }) {
  const DB = await edb(env).catch(() => null);
  const u = new URL(request.url);
  const o = DB && await DB.prepare(`SELECT status FROM ebook_orders WHERE id=?1 AND k=?2`).bind(u.searchParams.get('id') || '', u.searchParams.get('k') || '').first();
  const admin = isAdmin(request, env);
  if (!admin && (!o || !['pending', 'review'].includes(o.status))) return new Response('forbidden', { status: 403 });
  const r = DB && await DB.prepare(`SELECT data FROM ebook_files WHERE name='promptpay-qr' AND part=0`).first();
  if (!r) return new Response('no qr', { status: 404 });
  const b = new Uint8Array(r.data);
  const type = b[0] === 0x89 ? 'image/png' : b[0] === 0xFF ? 'image/jpeg' : 'image/webp';
  return new Response(b, { headers: { 'content-type': type, 'cache-control': 'private, no-store' } });
}
