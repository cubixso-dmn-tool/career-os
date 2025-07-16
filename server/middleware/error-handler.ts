import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AdminLogger } from '../lib/admin-logs.js';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

class GlobalErrorHandler {
  static handleZodError(error: ZodError): { statusCode: number; message: string; errors: any[] } {
    return {
      statusCode: 400,
      message: "Validation error",
      errors: error.errors,
    };
  }

  static handleDatabaseError(error: any): { statusCode: number; message: string } {
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      return {
        statusCode: 409,
        message: "A record with this information already exists",
      };
    }
    
    if (error.code === '23503') { // PostgreSQL foreign key constraint violation
      return {
        statusCode: 400,
        message: "Invalid reference to related data",
      };
    }

    if (error.code === '23502') { // PostgreSQL not-null constraint violation
      return {
        statusCode: 400,
        message: "Required field is missing",
      };
    }

    return {
      statusCode: 500,
      message: "Database operation failed",
    };
  }

  static handleRedisError(error: any): { statusCode: number; message: string } {
    // For Redis errors, log but don't fail the request
    console.log('Cache unavailable, continuing without caching');
    return {
      statusCode: 200,
      message: "Operation completed (cache unavailable)",
    };
  }

  static handleAuthError(error: any): { statusCode: number; message: string } {
    if (error.message?.includes('token')) {
      return {
        statusCode: 401,
        message: "Invalid authentication token",
      };
    }

    if (error.message?.includes('password')) {
      return {
        statusCode: 401,
        message: "Invalid credentials",
      };
    }

    return {
      statusCode: 401,
      message: "Authentication failed",
    };
  }

  static middleware() {
    return (error: AppError, req: Request, res: Response, next: NextFunction) => {
      // Log error for monitoring
      AdminLogger.logSystem(
        "ERROR_HANDLED",
        `${error.name}: ${error.message}`,
        undefined,
        {
          url: req.url,
          method: req.method,
          userAgent: req.get('User-Agent'),
          stack: error.stack?.substring(0, 500), // Truncate stack trace
        }
      );

      // Handle specific error types
      if (error instanceof ZodError) {
        const handledError = this.handleZodError(error);
        return res.status(handledError.statusCode).json(handledError);
      }

      // Database errors
      if (error.message?.includes('database') || error.code) {
        const handledError = this.handleDatabaseError(error);
        return res.status(handledError.statusCode).json(handledError);
      }

      // Redis connection errors
      if (error.message?.includes('ECONNREFUSED') && error.message?.includes('6379')) {
        const handledError = this.handleRedisError(error);
        return res.status(200).json({ message: "Operation completed successfully" });
      }

      // Authentication errors
      if (error.statusCode === 401 || error.message?.includes('auth')) {
        const handledError = this.handleAuthError(error);
        return res.status(handledError.statusCode).json(handledError);
      }

      // Default error handling
      const statusCode = error.statusCode || 500;
      const message = error.isOperational 
        ? error.message 
        : 'An unexpected error occurred';

      // Don't expose internal errors in production
      const response = process.env.NODE_ENV === 'production' 
        ? { message }
        : { message, stack: error.stack };

      res.status(statusCode).json(response);
    };
  }

  static asyncWrapper(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static notFoundHandler() {
    return (req: Request, res: Response) => {
      res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
      });
    };
  }
}

export default GlobalErrorHandler;