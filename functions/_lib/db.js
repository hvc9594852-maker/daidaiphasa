// ใดๆภาษา.com — shared helpers for the backend (Cloudflare Pages Functions + D1)
// Needs a D1 database bound as DB (Pages project → Settings → Bindings → D1 database → variable name DB).
// Tables are created automatically on first use.
export const json = (status, obj, extra) => new Response(JSON.stringify(obj), {
  status, headers: Object.assign({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, extra || {})
});

let ready = null;
export function db(env) {
  if (!env.DB) return null;
  if (!ready) {
    ready = env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kind TEXT NOT NULL,
        data TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        who TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`),
      env.DB.prepare(`CREATE INDEX IF NOT EXISTS entries_kind ON entries(kind, created_at)`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS counts (
        day TEXT NOT NULL,
        k TEXT NOT NULL,
        n INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (day, k)
      )`)
    ]).catch(e => { ready = null; throw e; });
  }
  return ready.then(() => env.DB);
}

// Bangkok date, e.g. 2026-11-01
export function today() {
  return new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
}

// one-way, per-day visitor fingerprint (no raw IP is stored)
export async function who(request) {
  const ip = request.headers.get('cf-connecting-ip') || '';
  const ua = request.headers.get('user-agent') || '';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(today() + '|' + ip + '|' + ua));
  return Array.from(new Uint8Array(buf).slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function bump(DB, k, by) {
  await DB.prepare(`INSERT INTO counts(day,k,n) VALUES(?1,?2,?3) ON CONFLICT(day,k) DO UPDATE SET n=n+?3`)
    .bind(today(), k, by || 1).run();
}

// Basic auth for /admin. Set ADMIN_PASSWORD (type: Secret) in the Pages project. Any user name works.
export function isAdmin(request, env) {
  const pass = env.ADMIN_PASSWORD;
  if (!pass) return false;
  const h = request.headers.get('authorization') || '';
  if (!h.startsWith('Basic ')) return false;
  let dec = '';
  try { dec = atob(h.slice(6)); } catch (e) { return false; }
  const given = dec.slice(dec.indexOf(':') + 1);
  if (given.length !== pass.length) return false;
  let diff = 0;
  for (let i = 0; i < pass.length; i++) diff |= given.charCodeAt(i) ^ pass.charCodeAt(i);
  return diff === 0;
}
export const askLogin = () => new Response('ต้องเข้าสู่ระบบ', {
  status: 401, headers: { 'www-authenticate': 'Basic realm="daidaiphasa admin", charset="UTF-8"', 'cache-control': 'no-store' }
});
