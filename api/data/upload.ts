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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = getToken();
  if (!token) return res.status(500).json({ error: 'Blob storage not configured' });

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
    const { filename, data: fileData, contentType } = req.body;
    if (!filename || !fileData) {
      return res.status(400).json({ error: 'filename and data required' });
    }

    const buffer = Buffer.from(fileData, 'base64');
    const ext = filename.split('.').pop() || 'webp';
    const justName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const blobPath = `portfolio/images/${justName}`;

    const blob = await put(blobPath, buffer, {
      ...getOpts(),
      contentType: contentType || 'image/webp',
      access: 'private',
    });

    return res.status(200).json({ url: `/api/data/image?file=${justName}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
