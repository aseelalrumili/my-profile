import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get, put } from '@vercel/blob';
import { verifyToken } from '../auth/verify';

const BLOB_KEY = 'portfolio/data.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return res.status(200).json(null);
    }
    try {
      const blob = await get(BLOB_KEY, { token });
      const data = JSON.parse(await blob.text());
      return res.status(200).json(data);
    } catch {
      return res.status(200).json(null);
    }
  }

  if (req.method === 'PUT') {
    const email = verifyToken(req, res);
    if (!email) return;

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Blob storage not configured' });
    }

    try {
      let current: Record<string, unknown> = {};
      try {
        const blob = await get(BLOB_KEY, { token });
        current = JSON.parse(await blob.text());
      } catch {}

      const update = req.body;
      const merged = { ...current, ...update };

      await put(BLOB_KEY, JSON.stringify(merged), {
        contentType: 'application/json',
        access: 'public',
        token,
      });

      return res.status(200).json(merged);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to update data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
