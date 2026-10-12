import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

function key() {
  const raw = process.env.WEBHOOK_ENCRYPTION_KEY || '';
  if (!/^[a-fA-F0-9]{64}$/.test(raw)) throw new Error('WEBHOOK_ENCRYPTION_KEY must be 64 hexadecimal characters');
  return Buffer.from(raw, 'hex');
}
export function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return [iv.toString('hex'), cipher.getAuthTag().toString('hex'), data.toString('hex')].join(':');
}
export function decrypt(value: string) {
  const [ivHex, tagHex, dataHex] = value.split(':');
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
}
export function safeAnswer(s: unknown) {
  return String(s ?? '').replace(/@everyone/gi, '@\u200beveryone').replace(/@here/gi, '@\u200bhere')
    .replace(/<@&(\d+)>/g, '@role-$1');
}
export function validWebhook(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && (u.hostname === 'discord.com' || u.hostname === 'discordapp.com') &&
      /^\/api\/webhooks\/\d+\/[\w.-]+/.test(u.pathname);
  } catch { return false; }
}
