import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req: VercelRequest, res: VercelResponse): string | null {
  if (!JWT_SECRET) {
    res.status(500).json({ error: 'Server configuration error' });
    return null;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    return decoded.username;
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}
