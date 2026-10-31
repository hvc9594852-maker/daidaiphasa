// GET  /api/admin?days=30   → stats + entries (admin only)
// POST /api/admin {id, status:'new'|'done'|'hidden'}  → update an entry
import { json, db, isAdmin, askLogin, today } from '../_lib/db.js';

export async function onRequestGet({ request, env }) {
  if (!isAdmin(request, env)) return askLogin();
  const DB = await db(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  const days = Math.min(365, Math.max(1, parseInt(new URL(request.url).searchParams.get('days') || '30', 10) || 30));
  const since = new Date(Date.now() + 7 * 3600e3 - (days - 1) * 864e5).toISOString().slice(0, 10);
  const old = new Date(Date.now() + 7 * 3600e3 - 2 * 864e5).toISOString().slice(0, 10);
  await DB.prepare(`DELETE FROM counts WHERE k LIKE 'v:%' AND day < ?1`).bind(old).run();
  const [daily, totals, entries] = await DB.batch([
    DB.prepare(`SELECT day, k, n FROM counts WHERE day >= ?1 AND k NOT LIKE 'v:%' AND (k='visitors' OR k LIKE 'page:%') ORDER BY day`).bind(since),
    DB.prepare(`SELECT k, SUM(n) AS n FROM counts WHERE day >= ?1 AND k NOT LIKE 'v:%' GROUP BY k ORDER BY n DESC`).bind(since),
    DB.prepare(`SELECT id, kind, data, status, created_at FROM entries WHERE status != 'hidden' ORDER BY id DESC LIMIT 500`)
  ]);
  return json(200, {
    today: today(), since, days,
    daily: daily.results, totals: totals.results,
    entries: entries.results.map(e => Object.assign(e, { data: JSON.parse(e.data || '{}') }))
  });
}

export async function onRequestPost({ request, env }) {
  if (!isAdmin(request, env)) return askLogin();
  const DB = await db(env).catch(() => null);
  if (!DB) return json(503, { error: 'storage not configured' });
  let b; try { b = await request.json(); } catch (e) { return json(400, { error: 'json' }); }
  if (!['new', 'done', 'hidden'].includes(b.status)) return json(400, { error: 'status' });
  await DB.prepare(`UPDATE entries SET status=?1 WHERE id=?2`).bind(b.status, Number(b.id) || 0).run();
  return json(200, { ok: true });
}
