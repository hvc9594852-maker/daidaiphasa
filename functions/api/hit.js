// POST /api/hit  {k:'page:/braille' | 'tool:braille' | ...}  — anonymous daily counters
import { json, db, bump, who } from '../_lib/db.js';
const OK = /^(page|tool|ev):[a-z0-9\-\/_.]{1,60}$/;

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (e) { try { body = JSON.parse(await request.text()); } catch (e2) { return json(400, { error: 'json' }); } }
  const keys = (Array.isArray(body.k) ? body.k : [body.k]).map(String).filter(k => OK.test(k)).slice(0, 5);
  if (!keys.length) return json(400, { error: 'key' });
  const ua = request.headers.get('user-agent') || '';
  if (/bot|crawl|spider|slurp|preview|headless/i.test(ua)) return json(200, { ok: true, skipped: 'bot' });
  const DB = await db(env).catch(() => null);
  if (!DB) return json(200, { ok: false });
  for (const k of keys) await bump(DB, k);
  if (keys.some(k => k.startsWith('page:'))) {
    // unique visitors per day: count first page view of each anonymous fingerprint
    const w = await who(request);
    const r = await DB.prepare(`INSERT OR IGNORE INTO counts(day,k,n) VALUES(?1,?2,1)`).bind(new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10), 'v:' + w).run();
    if (r.meta && r.meta.changes) await bump(DB, 'visitors');
  }
  return json(200, { ok: true });
}
