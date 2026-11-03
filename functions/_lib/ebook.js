// ใดๆภาษา.com — ebook store helpers (orders, PromptPay QR payload, private file storage in D1)
// Needs: D1 binding DB, env PROMPTPAY_ID (เบอร์มือถือ 10 หลัก หรือเลขบัตรประชาชน 13 หลัก ที่ผูก PromptPay)
import { db } from './db.js';

export const PRODUCT = {
  id: 'english-2562',
  title: '2,562 คำศัพท์อังกฤษที่ใช้บ่อย',
  price: 14900,                       // satang (฿149.00)
  files: { pdf: { name: 'english-2562.pdf', download: '2562-English-Words-Thai.pdf', type: 'application/pdf' },
           epub: { name: 'english-2562.epub', download: '2562-English-Words-Thai.epub', type: 'application/epub+zip' } },
  maxDownloads: 30
};

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
function crc16(s) {
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
