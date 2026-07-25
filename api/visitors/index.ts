import type { VercelRequest, VercelResponse } from '@vercel/node';

const BLOB_KEY = 'portfolio/visitors.json';

function getToken(): string | null {
  return process.env.PORTFOLIO_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || null;
}

function getOpts(): Record<string, string> {
  const opts: Record<string, string> = {};
  const token = getToken();
  const storeId = process.env.PORTFOLIO_STORE_ID || null;
  if (token) opts.token = token;
  if (storeId) opts.storeId = storeId;
  return opts;
}

async function readBlob<T = any>(key: string, opts: Record<string, string>): Promise<T | null> {
  try {
    const { get } = await import('@vercel/blob');
    const result = await get(key, { ...opts, access: 'private' });
    const blobMeta = (result as any).blob || result;
    if (blobMeta.url) {
      const resp = await fetch(blobMeta.url);
      return await resp.json();
    }
    if (result.stream) {
      const text = await new Response(result.stream).text();
      return JSON.parse(text);
    }
    return null;
  } catch {
    return null;
  }
}

async function loadVisitors() {
  const opts = getOpts();
  if (!opts.token) return [];
  const data = await readBlob<{ page: string; timestamp: string }[]>(BLOB_KEY, opts);
  return data || [];
}

async function saveVisitors(visitors: { page: string; timestamp: string }[]) {
  const { put } = await import('@vercel/blob');
  await put(BLOB_KEY, JSON.stringify(visitors), {
    ...getOpts(),
    contentType: 'application/json',
    access: 'private',
    allowOverwrite: true,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = getToken();

  if (req.method === 'POST') {
    if (!token) return res.status(200).json({ ok: true });
    const { page } = req.body || {};
    if (!page) return res.status(400).json({ error: 'page required' });
    const visitors = await loadVisitors();
    visitors.push({ page, timestamp: new Date().toISOString() });
    if (visitors.length > 1000) visitors.splice(0, visitors.length - 1000);
    await saveVisitors(visitors);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    if (!token) {
      return res.status(200).json({
        totalVisitors: 0,
        todayVisitors: 0,
        thisWeek: 0,
        thisMonth: 0,
        topPages: [],
        dailyVisits: [],
      });
    }
    const visitors = await loadVisitors();
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
    const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);

    const pageCounts: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};
    let todayVisitors = 0;
    let thisWeek = 0;
    let thisMonth = 0;

    for (const v of visitors) {
      const d = v.timestamp.slice(0, 10);
      pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
      dailyCounts[d] = (dailyCounts[d] || 0) + 1;
      if (d === today) todayVisitors++;
      if (d >= weekAgo) thisWeek++;
      if (d >= monthAgo) thisMonth++;
    }

    return res.status(200).json({
      totalVisitors: visitors.length,
      todayVisitors,
      thisWeek,
      thisMonth,
      topPages: Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).map(([page, count]) => ({ page, count })),
      dailyVisits: Object.entries(dailyCounts).sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count })),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
