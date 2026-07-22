import { requireAuth, getUploadsStore, getMimeType, notFound, badRequest, unauthorized, json, initBlobs } from './_lib';

export const handler = async (event: any) => {
  initBlobs(event);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: {}, body: 'Method Not Allowed' };
  }

  const auth = requireAuth(event);
  if (!auth) return unauthorized();

  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return badRequest('Invalid JSON');
  }

  const { fileName, mimeType, base64 } = body;
  if (!base64 || !fileName) {
    return badRequest('fileName and base64 are required');
  }

  const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
  const buffer = Buffer.from(cleanBase64, 'base64');

  if (buffer.length === 0) return badRequest('Empty file');
  if (buffer.length > 50 * 1024 * 1024) return badRequest('File too large (max 50MB)');

  const store = getUploadsStore();
  const key = `${crypto.randomUUID()}-${fileName}`;
  await store.set(key, buffer, {
    metadata: { contentType: mimeType || getMimeType(fileName) },
  });

  return json({ url: `/uploads/${key}` }, 201);
};
