// POST /api/hit  {k:['page:/braille' | 'tool:braille' | ...], ref, utm, ret}  — anonymous daily counters + recent-visit log
// No names, IPs or cookies are stored: country/city come from Cloudflare's IP lookup, the visitor id is a hash that changes every day.
import { json, db, bump, who, today, isAdmin } from '../_lib/db.js';
const OK = /^(page|tool|ev):[a-z0-9\-\/_.]{1,60}$/;

function source(ref, utm) {
  const h = String(utm || ref || '').toLowerCase();
  if (!h) return 'direct';
  const map = [[/google\./, 'google'], [/bing\.|msn\./, 'bing'], [/yahoo\./, 'yahoo'], [/duckduckgo/, 'duckduckgo'],
    [/facebook|fb\.|fb$|messenger/, 'facebook'], [/instagram/, 'instagram'], [/line\.me|^line$|liff/, 'line'],
    [/t\.co$|twitter|^x\.com$|^x$/, 'x'], [/tiktok/, 'tiktok'], [/youtube|youtu\.be/, 'youtube'], [/pantip/, 'pantip'],
    [/reddit/, 'reddit'], [/shopee/, 'shopee'], [/chatgpt|openai/, 'chatgpt'], [/claude\.ai/, 'claude'], [/perplexity/, 'perplexity']];
  for (const [re, name] of map) if (re.test(h)) return name;
  return h.replace(/^www\./, '').replace(/[^a-z0-9.\-]/g, '').slice(0, 40) || 'other';
}
function device(ua) {
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  if (/mobi|iphone|android/i.test(ua)) return 'mobile';
  return 'desktop';
}

let visitsReady = null;
async function visitsTable(DB) {
  if (!visitsReady) visitsReady = DB.prepare(`CREATE TABLE IF NOT EXISTS visits (
      ts TEXT NOT NULL DEFAULT (datetime('now')), vid TEXT, page TEXT, country TEXT, city TEXT, src TEXT, device TEXT, ret INTEGER)`).run()
    .then(() => DB.prepare(`CREATE INDEX IF NOT EXISTS visits_ts ON visits(ts)`).run())
    .catch(e => { visitsReady = null; throw e; });
  return visitsReady;
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (e) { try { body = JSON.parse(await request.text()); } catch (e2) { return json(400, { error: 'json' }); } }
  const keys = (Array.isArray(body.k) ? body.k : [body.k]).map(String).filter(k => OK.test(k)).slice(0, 5);
  if (!keys.length) return json(400, { error: 'key' });
  const ua = request.headers.get('user-agent') || '';
  if (/bot|crawl|spider|slurp|preview|headless|lighthouse/i.test(ua)) return json(200, { ok: true, skipped: 'bot' });
  // don't count the owner: logged-in admin, or a browser marked with ?notrack=1
  if (/(?:^|;\s*)dd_notrack=1/.test(request.headers.get('cookie') || '') || await isAdmin(request, env)) return json(200, { ok: true, skipped: 'owner' });
  const DB = await db(env).catch(() => null);
  if (!DB) return json(200, { ok: false });
  for (const k of keys) await bump(DB, k);
  const page = keys.find(k => k.startsWith('page:'));
  if (page) {
    const cf = request.cf || {};
    const country = String(cf.country || request.headers.get('cf-ipcountry') || 'XX').toUpperCase().slice(0, 2);
    const city = String(cf.city || '').slice(0, 40);
    const src = source(String(body.ref || '').slice(0, 80), String(body.utm || '').slice(0, 30));
    const dev = device(ua), ret = body.ret ? 1 : 0;
    const w = await who(request);
    // first page of the day for this anonymous visitor → per-visitor breakdowns
    const r = await DB.prepare(`INSERT OR IGNORE INTO counts(day,k,n) VALUES(?1,?2,1)`).bind(today(), 'v:' + w).run();
    if (r.meta && r.meta.changes) {
      for (const k of ['visitors', 'c:' + country, 'src:' + src, 'dev:' + dev, ret ? 'vis:ret' : 'vis:new', city ? 'city:' + country + '|' + city : null]) if (k) await bump(DB, k);
    }
    try {
      await visitsTable(DB);
      await DB.prepare(`INSERT INTO visits(vid,page,country,city,src,device,ret) VALUES(?1,?2,?3,?4,?5,?6,?7)`)
        .bind(w.slice(0, 6), page.slice(5), country, city, src, dev, ret).run();
      if (Math.random() < 0.02) await DB.prepare(`DELETE FROM visits WHERE ts < datetime('now','-30 days')`).run();
    } catch (e) {}
  }
  return json(200, { ok: true });
}
