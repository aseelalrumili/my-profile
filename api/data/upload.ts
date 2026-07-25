import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { verifyToken } from '../auth/verify';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const email = verifyToken(req, res);
  if (!email) return;

  try {
    const { filename, data: fileData, contentType } = req.body;
    if (!filename || !fileData) {
      return res.status(400).json({ error: 'filename and data required' });
    }

    const buffer = Buffer.from(fileData, 'base64');
    const ext = filename.split('.').pop() || 'webp';
    const uniqueName = `portfolio/images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(uniqueName, buffer, {
      contentType: contentType || 'image/webp',
      access: 'public',
      token: BLOB_TOKEN,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
