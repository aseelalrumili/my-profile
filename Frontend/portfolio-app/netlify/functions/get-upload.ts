import type { Context } from '@netlify/functions';
import { getUploadsStore, binary, notFound, getMimeType } from './_lib';

export const handler = async (event: any, context: any) => {
  // Handle CORS preflight
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

  // Only GET allowed
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: {}, body: 'Method Not Allowed' };
  }

  // Extract key from path: /uploads/<key> or /get-upload/<key>
  const path = event.path || '';
  const segments = path.split('/').filter(Boolean);
  const key = segments[segments.length - 1];

  if (!key) {
    return notFound('No file key provided');
  }

  try {
    const store = getUploadsStore();
    const data = await store.get(key);
    
    if (!data) {
      return notFound('File not found');
    }

    const contentType = getMimeType(key);
    return binary(data, 200, contentType);
  } catch (err) {
    return notFound('File not found');
  }
};
