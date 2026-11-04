// Admin API for the ebook store (needs ADMIN_PASSWORD, same login as /admin)
// GET  /api/admin-ebook             → orders (without slip images) + book file status
// GET  /api/admin-ebook?slip=<id>   → slip image of one order
// POST /api/admin-ebook {id, action:'approve'|'reject'|'pending', note}
// PUT  /api/admin-ebook?file=pdf|epub&product=<id>  (body = file bytes) → stores the private book file in D1, 1 MB per row
import { json, isAdmin, askLogin } from '../_lib/db.js';
import { edb, PRODUCTS, promptpayPayload, maskId, payConfig, idFromPayload } from '../_lib/ebook.js';
const CHUNK = 1000000;

export async function onRequestGet({ request, env }) {
  if (!(await isAdmin(request, env))) return askLogin();
  const DB = await edb(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  const u = new URL(request.url), sid = u.searchParams.get('slip');
  if (sid) {
    const o = await DB.prepare(`SELECT slip FROM ebook_orders WHERE id=?1`).bind(sid).first();
    const m = o && /^data:(image\/[a-z]+);base64,(.+)$/.exec(o.slip || '');
    if (!m) return new Response('no slip', { status: 404 });
    const bin = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
    return new Response(bin, { headers: { 'content-type': m[1], 'cache-control': 'private, no-store' } });
  }
  const pc = await payConfig(env, DB);
  const [orders, files] = await DB.batch([
    DB.prepare(`SELECT id,product,email,name,amount,status,note,downloads,created_at,slip_at,decided_at,(slip IS NOT NULL) AS has_slip FROM ebook_orders ORDER BY created_at DESC LIMIT 500`),
    DB.prepare(`SELECT name, COUNT(*) AS parts, SUM(LENGTH(data)) AS bytes FROM ebook_files GROUP BY name`)
  ]);
  return json(200, {
    products: Object.values(PRODUCTS).map(P => ({ id: P.id, title: P.title, price: P.price, page: P.page, files: P.files })),
    payment: { ready: !!pc, payee: pc ? maskId(pc.id) : '', name: pc ? pc.name || '' : '', bank: pc ? pc.bank || '' : '',
      qrImage: (files.results || []).some(f => f.name === 'promptpay-qr') },
    orders: orders.results, files: files.results
  });
}

export async function onRequestPost({ request, env }) {
  if (!(await isAdmin(request, env))) return askLogin();
  const DB = await edb(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  let b; try { b = await request.json(); } catch (e) { return json(400, { error: 'json' }); }
  if (b.action === 'paycfg') {
    // b.payload = text inside the shop's PromptPay QR (or b.id = PromptPay ID); b.name, b.bank shown to buyers
    const id = b.payload ? idFromPayload(b.payload) : String(b.id || '').replace(/\D/g, '');
    if (!promptpayPayload(id, 100)) return json(400, { error: 'อ่าน PromptPay จาก QR ไม่ได้' });
    const cfg = JSON.stringify({ id, name: String(b.name || '').slice(0, 80), bank: String(b.bank || '').slice(0, 40) });
    await DB.prepare(`DELETE FROM ebook_files WHERE name='pay-config'`).run();
    await DB.prepare(`INSERT INTO ebook_files(name,part,data) VALUES('pay-config',0,?1)`).bind(new TextEncoder().encode(cfg)).run();
    return json(200, { ok: true, payee: maskId(id) });
  }
  const map = { approve: 'approved', reject: 'rejected', pending: 'review' };
  const st = map[b.action]; if (!st) return json(400, { error: 'action' });
  await DB.prepare(`UPDATE ebook_orders SET status=?1, note=?2, decided_at=datetime('now') WHERE id=?3`)
    .bind(st, String(b.note || '').slice(0, 300), String(b.id || '')).run();
  return json(200, { ok: true, status: st });
}

export async function onRequestPut({ request, env }) {
  if (!(await isAdmin(request, env))) return askLogin();
  const DB = await edb(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  const u = new URL(request.url), which = u.searchParams.get('file') || '';
  if (which === 'qr') {
    const img = new Uint8Array(await request.arrayBuffer());
    const ok = (img[0] === 0x89 && img[1] === 0x50) || (img[0] === 0xFF && img[1] === 0xD8) || (img[8] === 0x57 && img[9] === 0x45);
    if (!ok || img.length > 1500000) return json(400, { error: 'ใช้รูป PNG หรือ JPG ขนาดไม่เกิน 1.5 MB' });
    await DB.prepare(`DELETE FROM ebook_files WHERE name='promptpay-qr'`).run();
    await DB.prepare(`INSERT INTO ebook_files(name,part,data) VALUES('promptpay-qr',0,?1)`).bind(img).run();
    return json(200, { ok: true, name: 'promptpay-qr', bytes: img.length });
  }
  const P = PRODUCTS[u.searchParams.get('product') || 'english-2562'];
  const f = P && P.files[which];
  if (!f) return json(400, { error: 'file' });
  const buf = new Uint8Array(await request.arrayBuffer());
  if (buf.length < 1000 || buf.length > 60e6) return json(400, { error: 'size' });
  const sig = f.type === 'application/pdf' ? [0x25, 0x50, 0x44, 0x46] : [0x50, 0x4b, 0x03, 0x04];
  if (!sig.every((v, i) => buf[i] === v)) return json(400, { error: 'ไฟล์ไม่ใช่ ' + (f.type === 'application/pdf' ? 'PDF' : 'EPUB') });
  await DB.prepare(`DELETE FROM ebook_files WHERE name=?1`).bind(f.name).run();
  for (let i = 0, p = 0; i < buf.length; i += CHUNK, p++) {
    await DB.prepare(`INSERT INTO ebook_files(name,part,data) VALUES(?1,?2,?3)`).bind(f.name, p, buf.slice(i, i + CHUNK)).run();
  }
  return json(200, { ok: true, name: f.name, bytes: buf.length });
}
