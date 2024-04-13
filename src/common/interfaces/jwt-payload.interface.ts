export interface JwtPayload {
  id: string; // User ID
  iat: number; // Unix timestamp (issued at)
  exp: number; // Unix timestamp (expiration)
}
