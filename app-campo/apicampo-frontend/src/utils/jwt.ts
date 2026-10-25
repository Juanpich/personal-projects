/**
 * Decodifica el payload de un JWT sin verificar la firma. Esto es
 * intencional: la verificación real la hace el backend en cada request
 * (TokenProvider.validateToken). Acá solo lo usamos para leer el rol y
 * mostrar/ocultar botones en la UI — nunca para decidir si algo está
 * permitido de verdad.
 */
export interface JwtPayload {
  sub?: string; // username
  auth?: string; // roles separados por coma, ver TokenProvider.AUTHORITIES_KEY
  exp?: number; // unix timestamp (segundos)
  iat?: number;
  [key: string]: unknown;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function rolesFromToken(token: string | null): string[] {
  if (!token) return [];
  const payload = decodeJwtPayload(token);
  if (!payload?.auth) return [];
  return payload.auth
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
}
