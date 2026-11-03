// GET /api/ebook/qr — the shop's own PromptPay QR image (uploaded by the owner in /admin)
import { edb } from '../../_lib/ebook.js';
export async function onRequestGet({ env }) {
  const DB = await edb(env).catch(() => null);
  const r = DB && await DB.prepare(`SELECT data FROM ebook_files WHERE name='promptpay-qr' AND part=0`).first();
  if (!r) return new Response('no qr', { status: 404 });
  const b = new Uint8Array(r.data);
  const type = b[0] === 0x89 ? 'image/png' : b[0] === 0xFF ? 'image/jpeg' : 'image/webp';
  return new Response(b, { headers: { 'content-type': type, 'cache-control': 'public, max-age=300' } });
}
