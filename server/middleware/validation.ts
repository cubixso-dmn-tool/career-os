import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove potentially malicious scripts and HTML
      return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (value && typeof value === 'object') {
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
}

// Rate limiting by IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    const record = rateLimitStore.get(ip);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({ 
        error: "Too many requests",
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }
    
    record.count++;
    next();
  };
}

// SQL injection protection for query parameters
export function validateSqlInjection(req: Request, res: Response, next: NextFunction) {
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/i,
    /(--|\/\*|\*\/|xp_|sp_)/i,
    /(\b(OR|AND)\b.*=.*)/i,
    /(SCRIPT|IFRAME|OBJECT|EMBED|FORM)/i
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return sqlInjectionPatterns.some(pattern => pattern.test(value));
    }
    if (Array.isArray(value)) {
      return value.some(checkValue);
    }
    if (value && typeof value === 'object') {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  if (checkValue(req.query) || checkValue(req.body) || checkValue(req.params)) {
    return res.status(400).json({ error: "Invalid input detected" });
  }

  next();
}

// Schema validation wrapper
export function validateSchema(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      next(error);
    }
  };
}

// File upload validation
export function validateFileUpload(allowedTypes: string[], maxSize: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    // Check file type
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: "Invalid file type", 
        allowed: allowedTypes 
      });
    }

    // Check file size
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        error: "File too large", 
        maxSize: `${maxSize / (1024 * 1024)}MB` 
      });
    }

    next();
  };
}

// CORS security headers
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
}