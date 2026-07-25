import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = getToken();
  if (!token) return res.status(500).json({ error: 'Blob storage not configured' });

  const filePath = req.query.path;
  if (!filePath || !Array.isArray(filePath) || filePath.length === 0) {
    return res.status(400).json({ error: 'File path required' });
  }

  const blobPath = `portfolio/images/${filePath.join('/')}`;

  try {
    const { get } = await import('@vercel/blob');
    const result = await get(blobPath, { ...getOpts(), access: 'private' });
    const blobMeta = (result as any).blob || result;

    const downloadUrl = blobMeta.downloadUrl || blobMeta.url;
    if (!downloadUrl) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const resp = await fetch(downloadUrl);
    if (!resp.ok) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const contentType = resp.headers.get('content-type') || blobMeta.contentType || 'image/webp';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const buffer = Buffer.from(await resp.arrayBuffer());
    return res.status(200).send(buffer);
  } catch {
    return res.status(404).json({ error: 'Image not found' });
  }
}
