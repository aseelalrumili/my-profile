import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getToken, getOpts, readBlob, getErrorMessage } from '../lib/blobUtils';

const BLOB_KEY = 'portfolio/data.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = getToken();

  if (req.method === 'GET') {
    if (!token) return res.status(200).json(null);
    try {
      const data = await readBlob(BLOB_KEY, getOpts());
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
      const { put } = await import('@vercel/blob');
      const opts = getOpts();
      let current: Record<string, unknown> | null = null;
      let readFailed = false;
      try {
        current = await readBlob(BLOB_KEY, opts);
      } catch {
        readFailed = true;
      }

      if (current === null && readFailed) {
        return res.status(500).json({ error: 'Failed to read current data. Write aborted to prevent data loss.' });
      }

      const update = req.body;
      const merged = current ? { ...current, ...update } : update;

      await put(BLOB_KEY, JSON.stringify(merged), {
        ...opts,
        contentType: 'application/json',
        access: 'private',
        allowOverwrite: true,
      });

      return res.status(200).json(merged);
    } catch (err: unknown) {
      return res.status(500).json({ error: getErrorMessage(err) || 'Failed to update data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
