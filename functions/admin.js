// /admin — dashboard behind a password (ADMIN_PASSWORD). Shows a login form, then serves admin-app.html.
import { isAdmin, checkPassword, loginCookie } from './_lib/db.js';

const page = (msg) => new Response(`<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>เข้าสู่ระบบหลังบ้าน</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Sarabun:wght@300;400;600&display=swap">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F4F1EA;font-family:Sarabun,system-ui,sans-serif;color:#111}
form{background:#fff;border-radius:28px;padding:34px 30px;width:min(360px,88vw);box-shadow:0 20px 60px rgba(17,17,17,.08)}
h1{font-family:'Chakra Petch',sans-serif;font-size:24px;margin:0 0 4px}h1 span{color:#FF5A1F}
p{margin:0 0 20px;color:#6B675E;font-size:15px}
input{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:13px 16px;border-radius:14px;border:1.5px solid #E2DDD2;margin-bottom:14px}
input:focus{outline:none;border-color:#FF5A1F}
button{width:100%;font:inherit;font-weight:600;font-size:17px;border:0;border-radius:999px;padding:13px;background:#111;color:#fff;cursor:pointer}
.e{color:#C2410C;font-weight:600;margin:-4px 0 12px}</style></head><body>
<form method="post" action="/admin"><h1>หลังบ้าน <span>ใดๆภาษา</span></h1><p>ใส่รหัสผ่านหลังบ้าน</p>
${msg ? '<div class="e">' + msg + '</div>' : ''}<input type="password" name="password" autocomplete="current-password" autofocus required placeholder="รหัสผ่าน">
<button>เข้าสู่ระบบ</button></form></body></html>`, { status: msg ? 401 : 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });

export async function onRequestGet({ request, env }) {
  if (!env.ADMIN_PASSWORD) return new Response('ยังไม่ได้ตั้ง ADMIN_PASSWORD ใน Cloudflare Pages → Settings → Variables and Secrets', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  if (!(await isAdmin(request, env))) return page('');
  const r = await env.ASSETS.fetch(new URL('/admin-app', request.url));
  const h = new Headers(r.headers); h.set('cache-control', 'no-store'); h.set('x-robots-tag', 'noindex');
  return new Response(r.body, { status: r.status, headers: h });
}

export async function onRequestPost({ request, env }) {
  let pw = '';
  try { pw = (await request.formData()).get('password') || ''; } catch (e) {}
  if (!checkPassword(env, pw)) { await new Promise(r => setTimeout(r, 800)); return page('รหัสผ่านไม่ถูกต้อง'); }
  return new Response(null, { status: 303, headers: { location: '/admin', 'set-cookie': await loginCookie(env), 'cache-control': 'no-store' } });
}
