// /admin — password-protected dashboard (ADMIN_PASSWORD). Serves admin-app.html after login.
import { isAdmin, askLogin } from './_lib/db.js';
export async function onRequestGet({ request, env }) {
  if (!env.ADMIN_PASSWORD) return new Response('ยังไม่ได้ตั้ง ADMIN_PASSWORD ใน Cloudflare Pages → Settings → Variables and Secrets', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  if (!isAdmin(request, env)) return askLogin();
  const r = await env.ASSETS.fetch(new URL('/admin-app', request.url));
  const h = new Headers(r.headers); h.set('cache-control', 'no-store'); h.set('x-robots-tag', 'noindex');
  return new Response(r.body, { status: r.status, headers: h });
}
