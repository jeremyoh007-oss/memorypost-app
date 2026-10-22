/**
 * 추억 우체국 weather proxy (Cloudflare Worker).
 *   GET /weather?region=seoul  →  { temp, sky, max, min, pop, hourly[], ... }
 * Holds the 공공데이터포털 key as the secret KMA_SERVICE_KEY; caches each region for 1 hour.
 * No user data or location is received: only one of 17 시·도 ids.
 */
import { fetchKma } from './kma';
import { GRID } from './regions';

export interface Env {
  KMA_SERVICE_KEY: string;
  /** Optional comma-separated list of allowed origins for CORS (default "*"). */
  ALLOWED_ORIGINS?: string;
}

const TTL = 3600;

function cors(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS ?? '*').split(',').map((s) => s.trim());
  const allow = allowed.includes('*') ? '*' : allowed.includes(origin) ? origin : allowed[0] ?? '';
  return { 'access-control-allow-origin': allow, 'access-control-allow-methods': 'GET, OPTIONS', vary: 'origin' };
}

const json = (data: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const h = cors(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (req.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, h);
    if (url.pathname === '/health') return json({ ok: true }, 200, h);
    if (url.pathname !== '/weather') return json({ error: 'not_found' }, 404, h);

    const region = url.searchParams.get('region') ?? '';
    const grid = GRID[region];
    if (!grid) return json({ error: 'unknown_region', regions: Object.keys(GRID) }, 400, h);
    if (!env.KMA_SERVICE_KEY) return json({ error: 'not_configured' }, 500, h);

    // One cache entry per region per hour (KST hour bucket).
    const bucket = Math.floor(Date.now() / (TTL * 1000));
    const cacheKey = new Request(`https://weather-cache.internal/${region}/${bucket}`);
    const cache = caches.default;
    const hit = await cache.match(cacheKey);
    if (hit) {
      const body = await hit.text();
      return new Response(body, { status: 200, headers: { 'content-type': 'application/json; charset=utf-8', 'x-cache': 'HIT', 'cache-control': 'public, max-age=600', ...h } });
    }

    try {
      const data = await fetchKma(env.KMA_SERVICE_KEY, region, grid.nx, grid.ny);
      const body = JSON.stringify(data);
      ctx.waitUntil(cache.put(cacheKey, new Response(body, { headers: { 'content-type': 'application/json', 'cache-control': `public, max-age=${TTL}` } })));
      return new Response(body, { status: 200, headers: { 'content-type': 'application/json; charset=utf-8', 'x-cache': 'MISS', 'cache-control': 'public, max-age=600', ...h } });
    } catch (e) {
      // Never echo the upstream URL (it contains the key).
      console.error('kma_failed', region, e instanceof Error ? e.message : 'unknown');
      return json({ error: 'upstream_failed' }, 502, h);
    }
  },
} satisfies ExportedHandler<Env>;
