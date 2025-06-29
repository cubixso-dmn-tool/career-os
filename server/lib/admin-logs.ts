import { storage } from '../simple-storage';
import { cache } from './cache';

export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum LogCategory {
  AUTH = 'authentication',
  USER_MGMT = 'user_management',
  SYSTEM = 'system',
  SECURITY = 'security',
  API = 'api',
  DATABASE = 'database',
  EMAIL = 'email',
  UPLOAD = 'upload',
  PAYMENT = 'payment',
  MODERATION = 'moderation'
}

export interface AdminLogEntry {
  id?: number;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  action: string;
  details: string;
  userId?: number;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  metadata?: any;
}

export interface LogQuery {
  level?: LogLevel;
  category?: LogCategory;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  search?: string;
}

export class AdminLogger {
  private static readonly LOG_RETENTION_DAYS = 90;
  private static readonly MAX_LOGS_PER_REQUEST = 1000;

  // Core logging method
  static async log(entry: Omit<AdminLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const logEntry: AdminLogEntry = {
      ...entry,
      timestamp: new Date()
    };

    try {
      // Store in database
      await this.storeLog(logEntry);
      
      // Log to console for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.category}: ${logEntry.action} - ${logEntry.details}`);
      }

      // Send critical alerts
      if (logEntry.level === LogLevel.CRITICAL) {
        await this.sendCriticalAlert(logEntry);
      }

      // Invalidate logs cache
      await cache.invalidatePattern('admin_logs:*');
    } catch (error) {
      console.error('Failed to store admin log:', error);
    }
  }

  // Authentication logs
  static async logAuth(action: string, details: string, userId?: number, userEmail?: string, metadata?: any): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      category: LogCategory.AUTH,
      action,
      details,
      userId,
      userEmail,
      metadata
    });
  }

  // User management logs
  static async logUserManagement(action: string, details: string, adminUserId: number, targetUserId?: number, metadata?: any): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      category: LogCategory.USER_MGMT,
      action,
      details,
      userId: adminUserId,
      metadata: { ...metadata, targetUserId }
    });
  }

  // Security incident logs
  static async logSecurity(action: string, details: string, level: LogLevel = LogLevel.WARNING, metadata?: any): Promise<void> {
    await this.log({
      level,
      category: LogCategory.SECURITY,
      action,
      details,
      metadata
    });
  }

  // System operation logs
  static async logSystem(action: string, details: string, level: LogLevel = LogLevel.INFO, metadata?: any): Promise<void> {
    await this.log({
      level,
      category: LogCategory.SYSTEM,
      action,
      details,
      metadata
    });
  }

  // API usage logs
  static async logAPI(action: string, details: string, userId?: number, metadata?: any): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      category: LogCategory.API,
      action,
      details,
      userId,
      metadata
    });
  }

  // Database operation logs
  static async logDatabase(action: string, details: string, level: LogLevel = LogLevel.INFO, metadata?: any): Promise<void> {
    await this.log({
      level,
      category: LogCategory.DATABASE,
      action,
      details,
      metadata
    });
  }

  // Email operation logs
  static async logEmail(action: string, details: string, level: LogLevel = LogLevel.INFO, metadata?: any): Promise<void> {
    await this.log({
      level,
      category: LogCategory.EMAIL,
      action,
      details,
      metadata
    });
  }

  // File upload logs
  static async logUpload(action: string, details: string, userId?: number, metadata?: any): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      category: LogCategory.UPLOAD,
      action,
      details,
      userId,
      metadata
    });
  }

  // Moderation logs
  static async logModeration(action: string, details: string, moderatorId: number, targetUserId?: number, metadata?: any): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      category: LogCategory.MODERATION,
      action,
      details,
      userId: moderatorId,
      metadata: { ...metadata, targetUserId }
    });
  }

  // Query logs with filtering and pagination
  static async queryLogs(query: LogQuery = {}): Promise<{ logs: AdminLogEntry[]; total: number }> {
    const cacheKey = `admin_logs:query:${JSON.stringify(query)}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // This would use actual database query in production
      const logs = await this.fetchLogsFromDatabase(query);
      const total = await this.countLogsFromDatabase(query);

      const result = { logs, total };
      
      // Cache for 5 minutes
      await cache.set(cacheKey, result, 300);
      
      return result;
    } catch (error) {
      console.error('Failed to query admin logs:', error);
      return { logs: [], total: 0 };
    }
  }

  // Get logs by user
  static async getLogsByUser(userId: number, limit: number = 100): Promise<AdminLogEntry[]> {
    return (await this.queryLogs({ userId, limit })).logs;
  }

  // Get recent logs
  static async getRecentLogs(limit: number = 50): Promise<AdminLogEntry[]> {
    return (await this.queryLogs({ limit })).logs;
  }

  // Get critical logs
  static async getCriticalLogs(hours: number = 24): Promise<AdminLogEntry[]> {
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    return (await this.queryLogs({ 
      level: LogLevel.CRITICAL, 
      startDate,
      limit: 1000 
    })).logs;
  }

  // Generate log summary report
  static async generateLogSummary(hours: number = 24): Promise<any> {
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    const logs = (await this.queryLogs({ startDate, limit: 10000 })).logs;

    const summary = {
      timeRange: `Last ${hours} hours`,
      totalLogs: logs.length,
      byLevel: this.countByField(logs, 'level'),
      byCategory: this.countByField(logs, 'category'),
      byUser: this.countByField(logs.filter(log => log.userId), 'userId'),
      criticalAlerts: logs.filter(log => log.level === LogLevel.CRITICAL).length,
      authAttempts: logs.filter(log => log.category === LogCategory.AUTH).length,
      securityIncidents: logs.filter(log => log.category === LogCategory.SECURITY).length
    };

    return summary;
  }

  // Clean up old logs
  static async cleanupOldLogs(): Promise<number> {
    const cutoffDate = new Date(Date.now() - this.LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    
    try {
      const deletedCount = await this.deleteLogsBeforeDate(cutoffDate);
      
      await this.logSystem(
        'LOG_CLEANUP',
        `Deleted ${deletedCount} logs older than ${this.LOG_RETENTION_DAYS} days`,
        LogLevel.INFO,
        { deletedCount, cutoffDate }
      );

      return deletedCount;
    } catch (error) {
      await this.logSystem(
        'LOG_CLEANUP_FAILED',
        `Failed to cleanup old logs: ${error}`,
        LogLevel.ERROR,
        { error: error.toString() }
      );
      
      return 0;
    }
  }

  // Middleware for automatic request logging
  static createLoggingMiddleware(category: LogCategory = LogCategory.API) {
    return (req: any, res: any, next: any) => {
      const startTime = Date.now();
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      req.requestId = requestId;

      // Log request
      const logRequest = async () => {
        try {
          await this.log({
            level: LogLevel.INFO,
            category,
            action: 'API_REQUEST',
            details: `${req.method} ${req.originalUrl}`,
            userId: req.user?.id,
            userEmail: req.user?.email,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            requestId,
            metadata: {
              method: req.method,
              url: req.originalUrl,
              query: req.query,
              responseTime: Date.now() - startTime,
              statusCode: res.statusCode
            }
          });
        } catch (error) {
          console.error('Failed to log request:', error);
        }
      };

      // Log response when finished
      res.on('finish', logRequest);
      
      next();
    };
  }

  // Private helper methods
  private static async storeLog(entry: AdminLogEntry): Promise<void> {
    // In production, this would insert into admin_logs table
    // For now, we'll simulate database storage
    console.log('Storing admin log:', entry);
  }

  private static async fetchLogsFromDatabase(query: LogQuery): Promise<AdminLogEntry[]> {
    // In production, this would query the admin_logs table
    // For now, return sample data for demonstration
    return [];
  }

  private static async countLogsFromDatabase(query: LogQuery): Promise<number> {
    // In production, this would count logs in admin_logs table
    return 0;
  }

  private static async deleteLogsBeforeDate(date: Date): Promise<number> {
    // In production, this would delete old logs from admin_logs table
    return 0;
  }

  private static countByField(logs: AdminLogEntry[], field: keyof AdminLogEntry): Record<string, number> {
    return logs.reduce((acc, log) => {
      const value = String(log[field] || 'unknown');
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static async sendCriticalAlert(entry: AdminLogEntry): Promise<void> {
    // In production, this would send alerts via email/SMS/Slack
    console.error('🚨 CRITICAL ALERT:', entry);
    
    // Send to admin email if configured
    if (process.env.ADMIN_EMAIL) {
      try {
        const EmailManager = (await import('./email')).EmailManager;
        await EmailManager.sendAdminNotification(
          `Critical Alert: ${entry.action}`,
          `Details: ${entry.details}\nTimestamp: ${entry.timestamp}\nUser: ${entry.userEmail || 'System'}`,
          'error'
        );
      } catch (error) {
        console.error('Failed to send critical alert email:', error);
      }
    }
  }
}

// Auto-cleanup scheduler (run daily)
if (process.env.NODE_ENV === 'production') {
  setInterval(async () => {
    try {
      await AdminLogger.cleanupOldLogs();
    } catch (error) {
      console.error('Auto-cleanup failed:', error);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours
}