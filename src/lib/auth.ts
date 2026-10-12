import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be at least 32 characters');
  return new TextEncoder().encode(value);
};

export type DiscordUser = { sub: string; username: string; name: string; avatar: string };

export async function makeToken(payload: Record<string, unknown>, kind: 'user'|'admin') {
  return new SignJWT({ ...payload, kind }).setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt().setExpirationTime(kind === 'admin' ? '8h' : '7d').sign(secret());
}

export async function readToken(token: string | undefined, kind: 'user'|'admin') {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.kind !== kind) return null;
    return payload as Record<string, unknown>;
  } catch { return null; }
}

export async function currentUser(): Promise<DiscordUser | null> {
  const token = cookies().get('dx_session')?.value;
  const p = await readToken(token, 'user');
  if (!p || typeof p.sub !== 'string' || typeof p.username !== 'string') return null;
  return { sub: p.sub, username: p.username, name: String(p.name || p.username), avatar: String(p.avatar || '') };
}

export async function isAdmin() {
  const p = await readToken(cookies().get('dx_admin')?.value, 'admin');
  return Boolean(p && p.admin === true);
}
