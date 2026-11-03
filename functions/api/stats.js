// GET /api/stats — public KeySwap download total, counted up to last midnight (Bangkok time).
// The number changes once a day at 00:00, so it is cached until then.
import { json, db, today } from '../_lib/db.js';

export async function onRequestGet({ env }) {
  const DB = await db(env).catch(() => null);
  if (!DB) return json(200, { downloads: null });
  const day = today();
  const r = await DB.prepare(`SELECT
      SUM(CASE WHEN k='dl:keyswap-windows.exe' THEN n ELSE 0 END) AS win,
      SUM(CASE WHEN k='dl:keyswap-mac.zip' THEN n ELSE 0 END) AS mac
    FROM counts WHERE day < ?1 AND k LIKE 'dl:keyswap-%'`).bind(day).first();
  const win = (r && r.win) || 0, mac = (r && r.mac) || 0;
  // seconds until next Bangkok midnight
  const now = Date.now() + 7 * 3600e3, next = Math.ceil(now / 864e5) * 864e5;
  const ttl = Math.max(60, Math.floor((next - now) / 1000));
  return json(200, { downloads: win + mac, windows: win, mac, asOf: day }, { 'cache-control': 'public, max-age=' + ttl });
}
