// GET /api/ebook/download?id=&k=&f=pdf|epub (bundles: f=<bookId>.pdf|epub) — streams the book file for an approved order
import { json } from '../../_lib/db.js';
import { edb, product, orderFile } from '../../_lib/ebook.js';

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url), fk = u.searchParams.get('f') || '';
  if (!/^([a-z0-9-]+\.)?(pdf|epub)$/.test(fk)) return json(400, { error: 'file' });
  const DB = await edb(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  const o = await DB.prepare(`SELECT id,status,downloads,product FROM ebook_orders WHERE id=?1 AND k=?2`).bind(u.searchParams.get('id') || '', u.searchParams.get('k') || '').first();
  if (!o || o.status !== 'approved') return json(403, { error: 'คำสั่งซื้อนี้ยังดาวน์โหลดไม่ได้' });
  const P = product(o.product), f = orderFile(P, fk);
  if (!f) return json(400, { error: 'file' });
  if (o.downloads >= P.maxDownloads) return json(429, { error: 'ดาวน์โหลดครบจำนวนแล้ว ติดต่อเราที่หน้าติดต่อ' });
  const parts = await DB.prepare(`SELECT part FROM ebook_files WHERE name=?1 ORDER BY part`).bind(f.name).all();
  const list = (parts.results || []).map(r => r.part);
  if (!list.length) return json(503, { error: 'ไฟล์หนังสือยังไม่พร้อม' });
  await DB.prepare(`UPDATE ebook_orders SET downloads=downloads+1 WHERE id=?1`).bind(o.id).run();
  const stream = new ReadableStream({
    async pull(ctrl) {
      if (!list.length) { ctrl.close(); return; }
      const p = list.shift();
      const r = await DB.prepare(`SELECT data FROM ebook_files WHERE name=?1 AND part=?2`).bind(f.name, p).first();
      ctrl.enqueue(new Uint8Array(r.data));
    }
  });
  return new Response(stream, { headers: {
    'content-type': f.type, 'content-disposition': `attachment; filename="${f.download}"`,
    'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' } });
}
