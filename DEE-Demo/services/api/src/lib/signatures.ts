import crypto from 'crypto';

export function verifyGitHubSignature(secret: string, payload: Buffer, signatureHeader: string | undefined): boolean {
  if (!signatureHeader) return false;
  const sig = Buffer.from(signatureHeader.replace('sha256=', ''), 'hex');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const digest = Buffer.from(hmac.digest('hex'), 'hex');
  if (sig.length !== digest.length) return false;
  return crypto.timingSafeEqual(sig, digest);
}


