import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list, get } from '@vercel/blob';
import { verifyToken } from '../auth/verify';

const BLOB_KEY = 'portfolio/data.json';
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const blob = await get(BLOB_KEY, { token: BLOB_TOKEN });
    const data = JSON.parse(await blob.text());
    return res.status(200).json(data);
  } catch {
    return res.status(200).json(null);
  }
}
