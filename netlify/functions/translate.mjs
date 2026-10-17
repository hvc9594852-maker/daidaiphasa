// ใดๆภาษา.com — free-tier translation for every browser (Safari, Firefox, phones)
// Uses Azure AI Translator, free tier F0. Set in Netlify → Environment variables:
//   AZURE_TRANSLATOR_KEY     (Keys and Endpoint → KEY 1)
//   AZURE_TRANSLATOR_REGION  (Location/Region, e.g. southeastasia)
// Body: {text, from?, to?}. Default th → en (sign-language tool). Only the languages below are allowed.
const LANGS = new Set(['th','en','zh-Hans','ja','ko','fr','de','es','it','pt','ru','vi','id','ms','lo','km','my','ar','hi','nl','tr']);
const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method' });
  let body = {};
  try { body = await req.json(); } catch (e) { return json(400, { error: 'json' }); }
  const key = process.env.AZURE_TRANSLATOR_KEY, region = process.env.AZURE_TRANSLATOR_REGION;
  if (body.ping) return json(200, { ok: !!(key && region) });
  if (!key || !region) return json(503, { error: 'not configured' });
  const text = String(body.text || '').slice(0, 1000).trim();
  if (!text) return json(400, { error: 'text' });
  const hasFrom = 'from' in body, hasTo = 'to' in body;
  const from = hasFrom ? String(body.from || '') : 'th';
  const to = hasTo ? String(body.to || '') : 'en';
  if (!LANGS.has(to) || (from && !LANGS.has(from))) return json(400, { error: 'language' });
  const qs = 'api-version=3.0&to=' + encodeURIComponent(to) + (from ? '&from=' + encodeURIComponent(from) : '');
  const r = await fetch('https://api.cognitive.microsofttranslator.com/translate?' + qs, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': key, 'Ocp-Apim-Subscription-Region': region, 'Content-Type': 'application/json' },
    body: JSON.stringify([{ Text: text }])
  });
  if (r.status === 429 || r.status === 403) return json(429, { error: 'quota' });
  if (!r.ok) return json(502, { error: 'upstream ' + r.status });
  const data = await r.json();
  const first = (data || [])[0] || {};
  const out = (first.translations || [])[0];
  return json(200, { text: out ? out.text : '', detected: first.detectedLanguage ? first.detectedLanguage.language : (from || null) });
};
