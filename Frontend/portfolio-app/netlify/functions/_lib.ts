import { getStore, connectLambda } from '@netlify/blobs';
import type { Context } from '@netlify/functions';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const DATA_STORE = 'portfolio-data';

export function initBlobs(event: any) {
  if (event) {
    try { connectLambda(event); } catch {}
  }
}

export const KEYS = {
  profile: 'profile',
  SOCIAL_LINKS: 'social-links',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  PROJECTS: 'projects',
  CERTIFICATIONS: 'certifications',
  BLOG_POSTS: 'blog-posts',
  BLOG_COMMENTS: 'blog-comments',
  TESTIMONIALS: 'testimonials',
  REVIEWS: 'reviews',
  MESSAGES: 'contact-messages',
  VISITORS: 'visitors-log',
  settings: 'settings',
  ADMIN_AUTH: 'auth:admin',
} as const;

export function getDataStore() {
  return getStore({ name: DATA_STORE });
}

export async function getArray<T>(key: string): Promise<T[]> {
  const store = getDataStore();
  const data = await store.get(key, { type: 'json' });
  return Array.isArray(data) ? data : [];
}

export async function setArray<T extends { id: number | string }>(key: string, items: T[]): Promise<T[]> {
  const store = getDataStore();
  await store.setJSON(key, items);
  return items;
}

export async function getObject<T>(key: string): Promise<T | null> {
  const store = getDataStore();
  return await store.get(key, { type: 'json' });
}

export async function setObject<T>(key: string, value: T): Promise<void> {
  const store = getDataStore();
  await store.setJSON(key, value);
}

export function nextId(items: { id: number }[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map(i => i.id)) + 1;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET environment variable is required');
}

export function signToken(username: string, adminId: number): string {
  return jwt.sign(
    { sub: username, adminId, role: 'Admin' },
    JWT_SECRET!,
    { expiresIn: '60m', issuer: 'PortfolioAPI', audience: 'PortfolioClient' }
  );
}

export function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!, {
      issuer: 'PortfolioAPI',
      audience: 'PortfolioClient',
    }) as jwt.JwtPayload;
  } catch {
    return null;
  }
}

export function requireAuth(event: { headers: Record<string, string | undefined> }): jwt.JwtPayload | null {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return verifyToken(token);
}

export interface FunctionResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  isBase64Encoded?: boolean;
}

const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || '').split(',').filter(Boolean);

function getCorsHeaders(origin?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };
  if (ALLOWED_ORIGINS.length === 0 || (origin && ALLOWED_ORIGINS.includes(origin))) {
    headers['Access-Control-Allow-Origin'] = origin || '*';
  }
  return headers;
}

export function json(data: unknown, status = 200, origin?: string): FunctionResponse {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) },
    body: JSON.stringify(data),
  };
}

export function text(content: string, status = 200, contentType = 'text/plain', origin?: string): FunctionResponse {
  return {
    statusCode: status,
    headers: { 'Content-Type': contentType, ...getCorsHeaders(origin) },
    body: content,
  };
}

export function binary(data: Buffer, status = 200, contentType: string, origin?: string): FunctionResponse {
  return {
    statusCode: status,
    headers: { 'Content-Type': contentType, ...getCorsHeaders(origin) },
    body: data.toString('base64'),
    isBase64Encoded: true,
  };
}

export function notFound(message = 'Not Found', origin?: string): FunctionResponse {
  return json({ error: message }, 404, origin);
}

export function unauthorized(message = 'Unauthorized', origin?: string): FunctionResponse {
  return json({ error: message }, 401, origin);
}

export function badRequest(message: string, origin?: string): FunctionResponse {
  return json({ error: message }, 400, origin);
}

export function serverError(message: string, origin?: string): FunctionResponse {
  return json({ error: message }, 500, origin);
}

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, hash] = stored.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex') === hash);
    });
  });
}

export function uuid(): string {
  return crypto.randomUUID();
}