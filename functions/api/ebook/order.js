// POST /api/ebook/order {email, name, hp}  → new order with a unique satang amount + PromptPay QR payload
// GET  /api/ebook/order?id=&k=              → order status (and download links once approved)
import { json, who } from '../../_lib/db.js';
import { edb, rid, PRODUCT, promptpayPayload, maskId } from '../../_lib/ebook.js';

function view(o, env) {
  const out = { id: o.id, status: o.status, amount: o.amount, email: o.email, created_at: o.created_at, downloads: o.downloads, maxDownloads: PRODUCT.maxDownloads };
  if (o.status === 'pending' || o.status === 'review') {
    out.qr = promptpayPayload(env.PROMPTPAY_ID, o.amount);
    if (!out.qr) out.qrImage = '/api/ebook/qr';
    out.payee = maskId(env.PROMPTPAY_ID);
    out.payeeName = env.PROMPTPAY_NAME || '';
  }
  if (o.status === 'approved') out.files = Object.keys(PRODUCT.files);
  if (o.status === 'rejected') out.note = o.note || '';
  return out;
}

export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch (e) { return json(400, { error: 'json' }); }
  if (b.hp) return json(200, { ok: true });
  const email = String(b.email || '').trim().toLowerCase().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json(400, { error: 'อีเมลไม่ถูกต้อง' });
  const name = String(b.name || '').trim().slice(0, 80);
  const DB = await edb(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  if (!promptpayPayload(env.PROMPTPAY_ID, 100) && !(await DB.prepare(`SELECT 1 AS x FROM ebook_files WHERE name='promptpay-qr' LIMIT 1`).first()))
    return json(503, { error: 'ร้านยังไม่เปิดรับชำระเงิน' });
  const w = await who(request);
  const recent = await DB.prepare(`SELECT COUNT(*) AS c FROM ebook_orders WHERE who=?1 AND created_at > datetime('now','-1 hour')`).bind(w).first();
  if (recent && recent.c >= 6) return json(429, { error: 'สร้างคำสั่งซื้อบ่อยเกินไป ลองใหม่ภายหลัง' });
  // unique amount among open orders in the last 3 days: ฿149.01 – ฿149.99
  const open = await DB.prepare(`SELECT amount FROM ebook_orders WHERE status IN ('pending','review') AND created_at > datetime('now','-3 days')`).all();
  const used = new Set((open.results || []).map(r => r.amount));
  let amount = 0;
  for (let i = 0; i < 200 && !amount; i++) { const a = PRODUCT.price + 1 + Math.floor(Math.random() * 99); if (!used.has(a)) amount = a; }
  if (!amount) amount = PRODUCT.price + 1 + Math.floor(Math.random() * 99);
  const o = { id: rid(6), k: rid(16), product: PRODUCT.id, email, name, amount, status: 'pending', downloads: 0, created_at: new Date().toISOString() };
  await DB.prepare(`INSERT INTO ebook_orders(id,k,product,email,name,amount,who) VALUES(?1,?2,?3,?4,?5,?6,?7)`)
    .bind(o.id, o.k, o.product, email, name, amount, w).run();
  return json(200, Object.assign(view(o, env), { k: o.k }));
}

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url), id = u.searchParams.get('id') || '', k = u.searchParams.get('k') || '';
  const DB = await edb(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  const o = await DB.prepare(`SELECT * FROM ebook_orders WHERE id=?1 AND k=?2`).bind(id, k).first();
  if (!o) return json(404, { error: 'ไม่พบคำสั่งซื้อ' });
  return json(200, view(o, env));
}
