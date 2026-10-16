// ใดๆภาษา.com — Claude helper for the real site (Netlify Function)
// Needs the environment variable ANTHROPIC_API_KEY (Netlify → Site configuration → Environment variables).
// Only four fixed tasks are allowed, so the key can't be used as a general chatbot.
const TASKS = {
  th2en:   t => 'แปลข้อความภาษาไทยต่อไปนี้เป็นภาษาอังกฤษแบบสั้นและง่าย ใช้เฉพาะตัวอักษร a-z และช่องว่าง ตอบเฉพาะคำแปล ไม่ต้องอธิบาย:\n' + t,
  th2eo:   t => 'แปลข้อความภาษาไทยต่อไปนี้เป็นภาษาเอสเปรันโตที่ถูกไวยากรณ์และเป็นธรรมชาติ ตอบเฉพาะคำแปลภาษาเอสเปรันโต ไม่ต้องอธิบาย:\n' + t,
  eo2th:   t => 'แปลข้อความภาษาเอสเปรันโตต่อไปนี้เป็นภาษาไทยที่อ่านเป็นธรรมชาติ ตอบเฉพาะคำแปลภาษาไทย ไม่ต้องอธิบาย:\n' + t,
  th2rtgs: t => 'ถอดเสียงข้อความภาษาไทยต่อไปนี้เป็นอักษรโรมันตามหลักราชบัณฑิตยสถาน (RTGS) ตอบเฉพาะผลลัพธ์บรรทัดเดียว ไม่ต้องอธิบาย:\n' + t,
  en2th:   t => 'เขียนคำอ่านภาษาไทยของข้อความภาษาอังกฤษต่อไปนี้ ตามหลักเกณฑ์การทับศัพท์ของราชบัณฑิตยสถาน ตอบเฉพาะคำอ่านภาษาไทยบรรทัดเดียว ไม่ต้องอธิบาย:\n' + t
};
const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-5-5';
const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method' });
  let body = {};
  try { body = await req.json(); } catch (e) { return json(400, { error: 'json' }); }
  const key = process.env.ANTHROPIC_API_KEY;
  if (body.ping) return json(200, { ok: !!key });
  if (!key) return json(503, { error: 'not configured' });
  const make = TASKS[body.task];
  const text = String(body.text || '').slice(0, 500).trim();
  if (!make || !text) return json(400, { error: 'task' });
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 300, messages: [{ role: 'user', content: make(text) }] })
  });
  if (r.status === 429) return json(429, { error: 'rate' });
  if (!r.ok) return json(502, { error: 'upstream ' + r.status });
  const data = await r.json();
  const out = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('').trim();
  return json(200, { text: out });
};
