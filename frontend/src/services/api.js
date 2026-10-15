// ============================================================
// API client for the PawCare Flask backend (SQLite database).
// Set VITE_API_URL in a .env file to point somewhere else.
// ============================================================
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export async function request(path, { method = 'GET', body, params, withHeaders = false } = {}) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')).toString()
    : '';
  let res;
  try {
    res = await fetch(`${API_URL}${path}${query}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}. Is "python3 app.py" running?`);
  }
  if (res.status === 204) return withHeaders ? { data: null, headers: res.headers } : null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return withHeaders ? { data, headers: res.headers } : data;
}

// SQLite stores "2026-01-15 10:00:00" (UTC) -> ISO string the browser parses correctly
export const toIso = (ts) => (ts && !ts.includes('T') ? ts.replace(' ', 'T') + 'Z' : ts || null);

// Upload one image file (multipart) -> returns the public URL stored in PET.images
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  let res;
  try {
    res = await fetch(`${API_URL}/uploads`, { method: 'POST', body: fd });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}. Is "python3 app.py" running?`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}
