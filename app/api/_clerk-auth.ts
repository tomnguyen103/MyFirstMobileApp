function decodeBase64Url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  return atob(pad === 2 ? b64 + "==" : pad === 3 ? b64 + "=" : b64);
}

function clerkJwksUrl(): string {
  const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const encoded = key.replace(/^pk_(test|live)_/, "");
  const frontendApi = decodeBase64Url(encoded).replace(/\$$/, "");
  return `https://${frontendApi}/.well-known/jwks.json`;
}

/**
 * Verifies a Clerk RS256 session JWT from an Authorization: Bearer header.
 * Returns the verified subject (Clerk user id), or null on any failure.
 */
export async function verifyClerkJwt(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;

  let header: { kid?: string };
  let payload: { sub?: string; exp?: number };
  try {
    header = JSON.parse(decodeBase64Url(headerB64));
    payload = JSON.parse(decodeBase64Url(payloadB64));
  } catch {
    return null;
  }

  if (!payload.sub) return null;
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;

  const jwksRes = await fetch(clerkJwksUrl());
  if (!jwksRes.ok) return null;

  const jwksPayload = await jwksRes.json();
  if (typeof jwksPayload !== "object" || jwksPayload === null || !Array.isArray(jwksPayload.keys)) return null;
  const keys: (JsonWebKey & { kid?: string })[] = jwksPayload.keys;
  if (!header.kid) return null;
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;

  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sig = Uint8Array.from(decodeBase64Url(sigB64), (c) => c.charCodeAt(0));
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, sig, data);

  return valid ? payload.sub : null;
}
