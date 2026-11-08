// ใดๆภาษา.com — ebook store helpers (orders, PromptPay QR payload, private file storage in D1)
// Needs: D1 binding DB, env PROMPTPAY_ID (เบอร์มือถือ 10 หลัก หรือเลขบัตรประชาชน 13 หลัก ที่ผูก PromptPay)
import { db } from './db.js';

export const PRODUCTS = {
  'english-2562': {
    id: 'english-2562', page: '/ebook-english',
    title: '2,562 คำศัพท์อังกฤษที่ใช้บ่อย',
    price: 4500,                        // satang (฿45.00)
    files: { pdf: { name: 'english-2562.pdf', download: '2562-English-Words-Thai.pdf', type: 'application/pdf' },
             epub: { name: 'english-2562.epub', download: '2562-English-Words-Thai.epub', type: 'application/epub+zip' } },
    maxDownloads: 30
  },
  'japanese-3000': {
    id: 'japanese-3000', page: '/ebook-japanese',
    title: '3,000 คำศัพท์ญี่ปุ่น JLPT N5–N1',
    price: 4500,
    files: { pdf: { name: 'japanese-3000.pdf', download: '3000-Japanese-Words-JLPT-Thai.pdf', type: 'application/pdf' },
             epub: { name: 'japanese-3000.epub', download: '3000-Japanese-Words-JLPT-Thai.epub', type: 'application/epub+zip' } },
    maxDownloads: 30
  },
  'spanish-3000': {
    id: 'spanish-3000', page: '/ebook-spanish',
    title: '3,000 คำศัพท์สเปน A1–C2',
    price: 4500,
    files: { pdf: { name: 'spanish-3000.pdf', download: '3000-Spanish-Words-Thai.pdf', type: 'application/pdf' },
             epub: { name: 'spanish-3000.epub', download: '3000-Spanish-Words-Thai.epub', type: 'application/epub+zip' } },
    maxDownloads: 30
  },
  'korean-3000': {
    id: 'korean-3000', page: '/ebook-korean',
    title: '3,000 คำศัพท์เกาหลี เตรียมสอบ TOPIK',
    price: 4500,
    files: { pdf: { name: 'korean-3000.pdf', download: '3000-Korean-Words-TOPIK-Thai.pdf', type: 'application/pdf' },
             epub: { name: 'korean-3000.epub', download: '3000-Korean-Words-TOPIK-Thai.epub', type: 'application/epub+zip' } },
    maxDownloads: 30
  },
  'sign-language': {
    id: 'sign-language', page: '/ebook-sign-language',
    title: 'ภาษามือ อ่านให้ถูก',
    price: 4500,
    files: { pdf: { name: 'sign-language.pdf', download: 'Sign-Language-Thai.pdf', type: 'application/pdf' },
             epub: { name: 'sign-language.epub', download: 'Sign-Language-Thai.epub', type: 'application/epub+zip' } },
    maxDownloads: 30
  },
  'braille': {
    id: 'braille', page: '/ebook-braille',
    title: 'อักษรเบรลล์ อ่านด้วยนิ้ว',
    price: 4500,
    files: { pdf: { name: 'braille.pdf', download: 'Braille-Thai.pdf', type: 'application/pdf' },
             epub: { name: 'braille.epub', download: 'Braille-Thai.epub', type: 'application/epub+zip' } },
    maxDownloads: 30
  },
  'morse-code': {
    id: 'morse-code', page: '/ebook-morse-code',
    title: 'รหัสมอร์ส จุดและขีด',
    price: 4500,
    files: { pdf: { name: 'morse-code.pdf', download: 'Morse-Code-Thai.pdf', type: 'application/pdf' },
             epub: { name: 'morse-code.epub', download: 'Morse-Code-Thai.epub', type: 'application/epub+zip' } },
    maxDownloads: 30
  },
  'phasa-lu': {
    id: 'phasa-lu', page: '/ebook-phasa-lu',
    title: 'ภาษาลู ซักรุก ละนุ',
    price: 4500,
    files: { pdf: { name: 'phasa-lu.pdf', download: 'Phasa-Lu-Thai.pdf', type: 'application/pdf' },
             epub: { name: 'phasa-lu.epub', download: 'Phasa-Lu-Thai.epub', type: 'application/epub+zip' } },
    maxDownloads: 30
  },
  // ---- bundles: one order unlocks every book inside (download with f=<bookId>.pdf|epub) ----
  'pack-lang': {
    id: 'pack-lang', page: '/ebook-pack', title: 'แพ็คภาษา (อังกฤษ ญี่ปุ่น สเปน เกาหลี)', price: 13900, files: {},
    bundle: ['english-2562', 'japanese-3000', 'spanish-3000', 'korean-3000'], maxDownloads: 120
  },
  'pack-comm': {
    id: 'pack-comm', page: '/ebook-pack', title: 'แพ็คภาษาสื่อสาร (ภาษามือ เบรลล์ มอร์ส ภาษาลู)', price: 13900, files: {},
    bundle: ['sign-language', 'braille', 'morse-code', 'phasa-lu'], maxDownloads: 120
  },
  'pack-all': {
    id: 'pack-all', page: '/ebook-pack', title: 'แพ็ครวมทุกเล่ม (8 เล่ม)', price: 24900, files: {},
    bundle: ['english-2562', 'japanese-3000', 'spanish-3000', 'korean-3000', 'sign-language', 'braille', 'morse-code', 'phasa-lu'], maxDownloads: 240
  }
};
export const PRODUCT = PRODUCTS['english-2562'];
export function product(id) { return PRODUCTS[id] || PRODUCT; }
// which file an order may download: f = 'pdf'|'epub' for a single book, '<bookId>.pdf|epub' for a bundle
export function orderFile(P, fk) {
  const m = /^(?:([a-z0-9-]+)\.)?(pdf|epub)$/.exec(String(fk || ''));
  if (!m) return null;
  if (P.bundle) { if (!m[1] || !P.bundle.includes(m[1])) return null; return PRODUCTS[m[1]].files[m[2]] || null; }
  if (m[1] && m[1] !== P.id) return null;
  return P.files[m[2]] || null;
}

let ready = null;
export async function edb(env) {
  const DB = await db(env);
  if (!DB) return null;
  if (!ready) {
    ready = DB.batch([
      DB.prepare(`CREATE TABLE IF NOT EXISTS ebook_orders (
        id TEXT PRIMARY KEY, k TEXT NOT NULL, product TEXT NOT NULL, email TEXT NOT NULL, name TEXT,
        amount INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', slip TEXT, note TEXT,
        downloads INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')),
        slip_at TEXT, decided_at TEXT, who TEXT)`),
      DB.prepare(`CREATE INDEX IF NOT EXISTS ebook_orders_status ON ebook_orders(status, created_at)`),
      DB.prepare(`CREATE TABLE IF NOT EXISTS ebook_files (name TEXT NOT NULL, part INTEGER NOT NULL, data BLOB NOT NULL, PRIMARY KEY (name, part))`)
    ]).catch(e => { ready = null; throw e; });
  }
  await ready;
  return DB;
}

export function rid(bytes) {
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
}

// ---- PromptPay (EMVCo QR) ----
function tlv(id, v) { return id + String(v.length).padStart(2, '0') + v; }
export function crc16(s) {
  let crc = 0xFFFF;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}
export function promptpayPayload(id, satang) {
  const digits = String(id || '').replace(/\D/g, '');
  let acct;
  if (digits.length === 10 && digits[0] === '0') acct = tlv('01', ('0066' + digits.slice(1)).padStart(13, '0'));
  else if (digits.length === 13) acct = tlv('02', digits);
  else if (digits.length === 15) acct = tlv('03', digits);   // e-wallet
  else return null;
  const amount = (satang / 100).toFixed(2);
  const body = tlv('00', '01') + tlv('01', '12') + tlv('29', tlv('00', 'A000000677010111') + acct) +
               tlv('53', '764') + tlv('54', amount) + tlv('58', 'TH') + '6304';
  return body + crc16(body);
}
export function maskId(id) {
  const d = String(id || '').replace(/\D/g, '');
  return d.length >= 4 ? d.slice(0, 3) + 'x'.repeat(Math.max(0, d.length - 6)) + d.slice(-3) : '';
}

// ---- shop payment config stored privately in D1 (set from /admin; keeps the PromptPay ID out of the public repo) ----
export function parseTLV(s) {
  const out = {}; let i = 0;
  while (i + 4 <= s.length) { const t = s.slice(i, i + 2), n = parseInt(s.slice(i + 2, i + 4), 10); if (isNaN(n)) break; out[t] = s.slice(i + 4, i + 4 + n); i += 4 + n; }
  return out;
}
export function idFromPayload(payload) {
  const p = String(payload || '').trim();
  if (!/^000201/.test(p) || crc16(p.slice(0, -4)) !== p.slice(-4).toUpperCase()) return '';
  const m = parseTLV(parseTLV(p)['29'] || '');
  if (m['00'] !== 'A000000677010111') return '';
  if (m['01']) return '0' + m['01'].replace(/^0*66/, '');   // phone 0066xxxxxxxxx → 0xxxxxxxxx
  return m['02'] || m['03'] || '';
}
export async function payConfig(env, DB) {
  if (promptpayPayload(env.PROMPTPAY_ID, 100)) return { id: env.PROMPTPAY_ID, name: env.PROMPTPAY_NAME || '', bank: env.PROMPTPAY_BANK || '' };
  if (!DB) return null;
  const r = await DB.prepare(`SELECT data FROM ebook_files WHERE name='pay-config' AND part=0`).first();
  if (!r) return null;
  try { const c = JSON.parse(new TextDecoder().decode(new Uint8Array(r.data))); return c.id ? c : null; } catch (e) { return null; }
}
