import { Request } from 'express';

// Type guard to safely access user from request
export function getUserFromRequest(req: Request) {
  if (!req.isAuthenticated() || !req.user) {
    return null;
  }
  return req.user;
}