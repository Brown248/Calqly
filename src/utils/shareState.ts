const SHARED_STATE_PARAM = 's';

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

export function encodeSharedState(data: Record<string, unknown>): string {
  return toBase64Url(JSON.stringify(data));
}

export function decodeSharedState<T>(encoded: string): T | null {
  try {
    return JSON.parse(fromBase64Url(encoded)) as T;
  } catch {
    return null;
  }
}

export function readSharedStateFromUrl<T>(): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const encoded = new URLSearchParams(window.location.search).get(SHARED_STATE_PARAM);
  return encoded ? decodeSharedState<T>(encoded) : null;
}

export function buildSharedUrl(data: Record<string, unknown>): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);
  url.searchParams.set(SHARED_STATE_PARAM, encodeSharedState(data));

  return url.toString();
}
