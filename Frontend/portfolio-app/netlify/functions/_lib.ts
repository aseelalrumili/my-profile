import { getStore, connectLambda } from '@netlify/blobs';
import type { Context } from '@netlify/functions';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Store names
const DATA_STORE = 'portfolio-data';
const UPLOADS_STORE = 'portfolio-uploads';

// Must be called once per request before using getStore in Lambda mode
export function initBlobs(event: any) {
  if (event) {
    try { connectLambda(event); } catch {}
  }
}

// Data keys
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
  MESSAGES: 'contact-messages',
  VISITORS: 'visitors-log',
  settings: 'settings',
  ADMIN_AUTH: 'auth:admin',
} as const;

// Get the portfolio data store
export function getDataStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name: DATA_STORE });
  }
  return getStore({ name: DATA_STORE });
}

// Get the uploads store
export function getUploadsStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name: UPLOADS_STORE });
  }
  return getStore({ name: UPLOADS_STORE });
}

// Generic CRUD helpers for array-based entities
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

// JWT helpers
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production';

export function signToken(username: string, adminId: number): string {
  return jwt.sign(
    { sub: username, adminId, role: 'Admin' },
    JWT_SECRET,
    { expiresIn: '60m', issuer: 'PortfolioAPI', audience: 'PortfolioClient' }
  );
}

export function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
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

// HTTP response helpers
export interface FunctionResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  isBase64Encoded?: boolean;
}

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export function json(data: unknown, status = 200): FunctionResponse {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(data),
  };
}

export function text(content: string, status = 200, contentType = 'text/plain'): FunctionResponse {
  return {
    statusCode: status,
    headers: { 'Content-Type': contentType, ...corsHeaders },
    body: content,
  };
}

export function binary(data: Buffer, status = 200, contentType: string): FunctionResponse {
  return {
    statusCode: status,
    headers: { 'Content-Type': contentType, ...corsHeaders },
    body: data.toString('base64'),
    isBase64Encoded: true,
  };
}

export function redirect(location: string, status = 302): FunctionResponse {
  return {
    statusCode: status,
    headers: { Location: location, ...corsHeaders },
    body: '',
  };
}

export function notFound(message = 'Not Found'): FunctionResponse {
  return json({ error: message }, 404);
}

export function unauthorized(message = 'Unauthorized'): FunctionResponse {
  return json({ error: message }, 401);
}

export function badRequest(message: string): FunctionResponse {
  return json({ error: message }, 400);
}

export function serverError(message: string): FunctionResponse {
  return json({ error: message }, 500);
}

// Parse multipart/form-data
export interface MultipartField {
  name: string;
  value?: string;
  filename?: string;
  contentType?: string;
  data?: Buffer;
}

export function parseMultipart(contentType: string, body: string, isBase64: boolean): MultipartField[] {
  const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
  if (!boundaryMatch) return [];

  const boundary = boundaryMatch[1];
  const rawBody = isBase64 ? Buffer.from(body, 'base64') : Buffer.from(body, 'utf-8');
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const parts: MultipartField[] = [];

  let start = rawBody.indexOf(boundaryBuffer) + boundaryBuffer.length + 2; // skip \r\n

  while (start < rawBody.length) {
    const nextBoundary = rawBody.indexOf(boundaryBuffer, start);
    if (nextBoundary === -1) break;

    const partData = rawBody.subarray(start, nextBoundary - 2); // -2 for \r\n before boundary
    const headerEnd = partData.indexOf('\r\n\r\n');
    if (headerEnd === -1) { start = nextBoundary + boundaryBuffer.length + 2; continue; }

    const headerStr = partData.subarray(0, headerEnd).toString('utf-8');
    const content = partData.subarray(headerEnd + 4);

    const nameMatch = headerStr.match(/name="([^"]+)"/);
    const filenameMatch = headerStr.match(/filename="([^"]+)"/);
    const contentTypeMatch = headerStr.match(/Content-Type:\s*(.+)/i);

    const field: MultipartField = {
      name: nameMatch?.[1] || '',
      filename: filenameMatch?.[1],
      contentType: contentTypeMatch?.[1]?.trim(),
      value: filenameMatch ? undefined : content.toString('utf-8'),
      data: filenameMatch ? content : undefined,
    };

    parts.push(field);
    start = nextBoundary + boundaryBuffer.length + 2;
  }

  return parts;
}

// Generate UUID (simple version for IDs)
export function uuid(): string {
  return crypto.randomUUID();
}

// Hash password using bcrypt-like approach (we'll use a simple hash since bcrypt needs native bindings)
// In production on Netlify, use crypto.scrypt
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

// MIME type detection from extension
export function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';
  const types: Record<string, string> = {
    'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
    'gif': 'image/gif', 'webp': 'image/webp', 'svg': 'image/svg+xml',
    'pdf': 'application/pdf', 'json': 'application/json',
    'glb': 'model/gltf-binary', 'gltf': 'model/gltf+json',
    'obj': 'model/obj', 'fbx': 'model/fbx',
    'mp4': 'video/mp4', 'webm': 'video/webm',
  };
  return types[ext] || 'application/octet-stream';
}