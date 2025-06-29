import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-key-please-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-please-change-in-production';

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
  roles: string[];
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class JWTManager {
  private static readonly ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
  private static readonly REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
  private static readonly SESSION_PREFIX = 'sess_';

  // Generate unique session ID
  static generateSessionId(): string {
    return this.SESSION_PREFIX + crypto.randomBytes(32).toString('hex');
  }

  // Create access token
  static createAccessToken(payload: Omit<JWTPayload, 'sessionId'>, sessionId: string): string {
    const tokenPayload: JWTPayload = {
      ...payload,
      sessionId,
    };

    return jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: 'careeros-platform',
      audience: 'careeros-users'
    });
  }

  // Create refresh token
  static createRefreshToken(userId: number, sessionId: string): string {
    return jwt.sign(
      { 
        userId, 
        sessionId,
        type: 'refresh'
      }, 
      JWT_REFRESH_SECRET, 
      {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
        issuer: 'careeros-platform',
        audience: 'careeros-users'
      }
    );
  }

  // Create token pair
  static createTokenPair(user: any, roles: string[]): TokenPair {
    const sessionId = this.generateSessionId();
    
    const accessToken = this.createAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      roles
    }, sessionId);

    const refreshToken = this.createRefreshToken(user.id, sessionId);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 // 15 minutes in seconds
    };
  }

  // Verify access token
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'careeros-platform',
        audience: 'careeros-users'
      }) as JWTPayload;
      
      return decoded;
    } catch (error) {
      console.error('Access token verification failed:', error);
      return null;
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): { userId: number; sessionId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'careeros-platform',
        audience: 'careeros-users'
      }) as any;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return {
        userId: decoded.userId,
        sessionId: decoded.sessionId
      };
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  // Extract token from Authorization header
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  // Generate API key for third-party integrations
  static generateApiKey(userId: number): string {
    const payload = {
      userId,
      type: 'api_key',
      generated: Date.now()
    };
    
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1y', // API keys last 1 year
      issuer: 'careeros-platform',
      audience: 'careeros-api'
    });
  }

  // Verify API key
  static verifyApiKey(apiKey: string): { userId: number } | null {
    try {
      const decoded = jwt.verify(apiKey, JWT_SECRET, {
        issuer: 'careeros-platform',
        audience: 'careeros-api'
      }) as any;
      
      if (decoded.type !== 'api_key') {
        throw new Error('Invalid API key type');
      }

      return { userId: decoded.userId };
    } catch (error) {
      console.error('API key verification failed:', error);
      return null;
    }
  }
}

// JWT Authentication middleware
export function jwtAuthMiddleware(req: any, res: any, next: any) {
  const token = JWTManager.extractTokenFromHeader(req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const payload = JWTManager.verifyAccessToken(token);
  
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach user data to request
  req.user = payload;
  req.sessionId = payload.sessionId;
  
  next();
}

// Optional JWT middleware (doesn't require authentication)
export function optionalJwtAuthMiddleware(req: any, res: any, next: any) {
  const token = JWTManager.extractTokenFromHeader(req.headers.authorization);
  
  if (token) {
    const payload = JWTManager.verifyAccessToken(token);
    if (payload) {
      req.user = payload;
      req.sessionId = payload.sessionId;
    }
  }
  
  next();
}