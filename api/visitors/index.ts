import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, get } from '@vercel/blob';

const BLOB_KEY = 'portfolio/visitors.json';

async function loadVisitors(token: string) {
  try {
    const blob = await get(BLOB_KEY, { token });
    return JSON.parse(await blob.text()) as { page: string; timestamp: string }[];
  } catch {
    return [];
  }
}

async function saveVisitors(visitors: { page: string; timestamp: string }[], token: string) {
  await put(BLOB_KEY, JSON.stringify(visitors), {
    contentType: 'application/json',
    access: 'public',
    token,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'POST') {
    if (!token) return res.status(200).json({ ok: true });
    const { page } = req.body || {};
    if (!page) return res.status(400).json({ error: 'page required' });
    const visitors = await loadVisitors(token);
    visitors.push({ page, timestamp: new Date().toISOString() });
    if (visitors.length > 1000) visitors.splice(0, visitors.length - 1000);
    await saveVisitors(visitors, token);
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
    const visitors = await loadVisitors(token);
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
