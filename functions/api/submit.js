// POST /api/submit  {kind:'reports'|'submissions', item:{...}, hp:''}
// Stores word reports, site feedback and new-word submissions in D1.
import { json, db, who } from '../_lib/db.js';
const KINDS = new Set(['reports', 'submissions']);

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (e) { return json(400, { error: 'json' }); }
  if (body.hp) return json(200, { ok: true });                    // honeypot: pretend success
  const kind = String(body.kind || '');
  if (!KINDS.has(kind)) return json(400, { error: 'kind' });
  const item = body.item && typeof body.item === 'object' ? body.item : null;
  if (!item) return json(400, { error: 'item' });
  const clean = {};
  for (const [k, v] of Object.entries(item).slice(0, 12)) {
    if (!/^[a-z_]{1,20}$/i.test(k)) continue;
    clean[k] = typeof v === 'boolean' ? v : String(v == null ? '' : v).slice(0, 2000);
  }
  const DB = await db(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  const w = await who(request);
  const recent = await DB.prepare(`SELECT COUNT(*) AS c FROM entries WHERE who=?1 AND created_at > datetime('now','-10 minutes')`).bind(w).first();
  if (recent && recent.c >= 8) return json(429, { error: 'too many' });
  await DB.prepare(`INSERT INTO entries(kind,data,who) VALUES(?1,?2,?3)`).bind(kind, JSON.stringify(clean), w).run();
  return json(200, { ok: true });
}
