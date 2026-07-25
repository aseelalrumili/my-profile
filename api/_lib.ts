export function getBlobToken(): string | null {
  return process.env.PORTFOLIO_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || null;
}

export function getBlobStoreId(): string | null {
  return process.env.PORTFOLIO_STORE_ID || null;
}

export function getBlobOpts(): Record<string, string> {
  const opts: Record<string, string> = {};
  const token = getBlobToken();
  const storeId = getBlobStoreId();
  if (token) opts.token = token;
  if (storeId) opts.storeId = storeId;
  return opts;
}
