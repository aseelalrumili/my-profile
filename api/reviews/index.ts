import type { VercelRequest, VercelResponse } from '@vercel/node';

const BLOB_KEY = 'portfolio/data.json';

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
  const { get } = await import('@vercel/blob');
  const result = await get(key, { ...opts, access: 'private' });
  if (!result) return null;
  const blobMeta = (result as any).blob || result;

  if (blobMeta.downloadUrl) {
    const resp = await fetch(blobMeta.downloadUrl);
    if (resp.ok) return await resp.json();
  }
  if (blobMeta.url) {
    const resp = await fetch(blobMeta.url);
    if (resp.ok) return await resp.json();
  }
  if ((result as any).stream) {
    const text = await new Response((result as any).stream).text();
    return JSON.parse(text);
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getToken();
  if (!token) return res.status(500).json({ error: 'Storage not configured' });

  const { name, rating, comment, avatarUrl } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (name.length > 50) {
    return res.status(400).json({ error: 'Name must be 50 characters or less' });
  }
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  if (comment.length > 500) {
    return res.status(400).json({ error: 'Comment must be 500 characters or less' });
  }

  try {
    const opts = getOpts();
    let current: Record<string, unknown> = {};
    try {
      const existing = await readBlob(BLOB_KEY, opts);
      if (existing && typeof existing === 'object') {
        current = existing as Record<string, unknown>;
      }
    } catch {
      return res.status(500).json({ error: 'Failed to read current data' });
    }

    const reviews = Array.isArray(current.reviews) ? current.reviews : [];
    const maxId = reviews.length ? Math.max(...reviews.map((r: any) => r.id || 0)) : 0;

    const newReview = {
      id: maxId + 1,
      name: name.trim(),
      rating: Math.round(rating),
      comment: comment.trim(),
      avatarUrl: avatarUrl || '',
      isApproved: false,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    current.reviews = reviews;

    const { put } = await import('@vercel/blob');
    await put(BLOB_KEY, JSON.stringify(current), {
      ...opts,
      contentType: 'application/json',
      access: 'private',
      allowOverwrite: true,
    });

    return res.status(200).json({ success: true, review: newReview });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit review' });
  }
}
