import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getToken, getOpts, readBlob, getErrorMessage } from '../lib/blobUtils';

const BLOB_KEY = 'portfolio/data.json';

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
    const maxId = reviews.length ? Math.max(...reviews.map((r: { id?: number }) => r.id || 0)) : 0;

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
  } catch (err: unknown) {
    return res.status(500).json({ error: getErrorMessage(err) || 'Failed to submit review' });
  }
}
