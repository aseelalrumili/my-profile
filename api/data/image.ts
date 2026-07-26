import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getToken, getOpts } from '../lib/blobUtils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = getToken();
  if (!token) return res.status(500).json({ error: 'Blob storage not configured' });

  const { file } = req.query;
  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'file query parameter required' });
  }

  const blobPath = `portfolio/images/${file}`;

  try {
    const { get } = await import('@vercel/blob');
    const result = await get(blobPath, { ...getOpts(), access: 'private' });
    if (!result) return res.status(404).json({ error: 'Image not found' });
    const blobMeta = (result as any).blob || result;

    const downloadUrl = blobMeta.downloadUrl || blobMeta.url;
    if (!downloadUrl) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const resp = await fetch(downloadUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (!resp.ok) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const ext = file.split('.').pop()?.toLowerCase() || 'webp';
    const mimeMap: Record<string, string> = {
      png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
      webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
    };
    const contentType = resp.headers.get('content-type') || mimeMap[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const buffer = Buffer.from(await resp.arrayBuffer());
    return res.status(200).send(buffer);
  } catch {
    return res.status(404).json({ error: 'Image not found' });
  }
}
