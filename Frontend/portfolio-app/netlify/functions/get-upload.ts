import { getUploadsStore, binary, notFound, getMimeType, initBlobs } from './_lib';

export const handler = async (event: any) => {
  initBlobs(event);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: {}, body: 'Method Not Allowed' };
  }

  const path = event.path || '';
  const segments = path.split('/').filter(Boolean);
  const key = segments[segments.length - 1];

  if (!key) {
    return notFound('No file key provided');
  }

  try {
    const store = getUploadsStore();
    const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });

    if (!result?.data) {
      return notFound('File not found');
    }

    const contentType = result.metadata?.contentType || getMimeType(key);
    return binary(Buffer.from(result.data), 200, contentType);
  } catch {
    return notFound('File not found');
  }
};
