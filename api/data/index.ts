import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBlobToken, getBlobOpts } from '../_lib';

const BLOB_KEY = 'portfolio/data.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = getBlobToken();

  if (req.method === 'GET') {
    if (!token) return res.status(200).json(null);
    try {
      const { get } = await import('@vercel/blob');
      const blob = await get(BLOB_KEY, getBlobOpts());
      const data = JSON.parse(await blob.text());
      return res.status(200).json(data);
    } catch {
      return res.status(200).json(null);
    }
  }

  if (req.method === 'PUT') {
    if (!token) return res.status(500).json({ error: 'Blob storage not configured' });

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const jwtModule = await import('jsonwebtoken');
    const jwt = jwtModule.default;
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return res.status(500).json({ error: 'Server configuration error' });

    const tokenStr = authHeader.split(' ')[1];
    try {
      jwt.verify(tokenStr, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    try {
      const { get, put } = await import('@vercel/blob');
      const opts = getBlobOpts();
      let current: Record<string, unknown> = {};
      try {
        const blob = await get(BLOB_KEY, opts);
        current = JSON.parse(await blob.text());
      } catch {}

      const update = req.body;
      const merged = { ...current, ...update };

      await put(BLOB_KEY, JSON.stringify(merged), {
        ...opts,
        contentType: 'application/json',
        access: 'public',
      });

      return res.status(200).json(merged);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to update data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
