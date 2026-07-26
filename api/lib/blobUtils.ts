export function getToken(): string | null {
  return process.env.PORTFOLIO_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || null;
}

export function getOpts(): Record<string, string> {
  const opts: Record<string, string> = {};
  const token = getToken();
  const storeId = process.env.PORTFOLIO_STORE_ID || null;
  if (token) opts.token = token;
  if (storeId) opts.storeId = storeId;
  return opts;
}

interface BlobMeta {
  downloadUrl?: string;
  url?: string;
}

function extractBlobMeta(result: any): BlobMeta {
  const blob = result?.blob;
  return blob || result || {};
}

export async function readBlob<T = unknown>(key: string, opts: Record<string, string>): Promise<T | null> {
  const { get } = await import('@vercel/blob');
  const result = await get(key, { ...opts, access: 'private' });
  if (!result) return null;
  const blobMeta = extractBlobMeta(result);

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

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Unknown error';
}
