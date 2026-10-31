// Counts KeySwap downloads, then serves the file as usual.
import { db, bump } from '../_lib/db.js';

export async function onRequestGet(ctx) {
  const { request, env, params } = ctx;
  const res = await env.ASSETS.fetch(request);
  const ua = request.headers.get('user-agent') || '';
  const name = (Array.isArray(params.path) ? params.path.join('/') : String(params.path || '')).toLowerCase();
  if (res.ok && /^[a-z0-9\-_.]{1,60}$/.test(name) && !/bot|crawl|spider|preview/i.test(ua) && !request.headers.get('range')) {
    ctx.waitUntil(db(env).then(DB => DB && bump(DB, 'dl:' + name)).catch(() => {}));
  }
  return res;
}
