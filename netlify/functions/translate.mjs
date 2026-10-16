// ใดๆภาษา.com — free-tier translation for every browser (Safari, Firefox, phones)
// Uses Azure AI Translator, free tier F0. Set in Netlify → Environment variables:
//   AZURE_TRANSLATOR_KEY     (Keys and Endpoint → KEY 1)
//   AZURE_TRANSLATOR_REGION  (Location/Region, e.g. southeastasia)
// Only Thai → English is allowed here (that is what the sign-language tool needs).
const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method' });
  let body = {};
  try { body = await req.json(); } catch (e) { return json(400, { error: 'json' }); }
  const key = process.env.AZURE_TRANSLATOR_KEY, region = process.env.AZURE_TRANSLATOR_REGION;
  if (body.ping) return json(200, { ok: !!(key && region) });
  if (!key || !region) return json(503, { error: 'not configured' });
  const text = String(body.text || '').slice(0, 500).trim();
  if (!text) return json(400, { error: 'text' });
  const r = await fetch('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=th&to=en', {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': key, 'Ocp-Apim-Subscription-Region': region, 'Content-Type': 'application/json' },
    body: JSON.stringify([{ Text: text }])
  });
  if (r.status === 429 || r.status === 403) return json(429, { error: 'quota' });
  if (!r.ok) return json(502, { error: 'upstream ' + r.status });
  const data = await r.json();
  const out = (((data || [])[0] || {}).translations || [])[0];
  return json(200, { text: out ? out.text : '' });
};
