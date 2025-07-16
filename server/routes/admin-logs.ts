import { Router } from "express";
import { AdminLogger, LogLevel, LogCategory } from "../lib/admin-logs.js";
import { cacheMiddleware } from "../lib/cache.js";

const router = Router();

// Simple auth check middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Admin role check (simplified for now)
const requireAdmin = (req: any, res: any, next: any) => {
  // This would check user roles in production
  if (!req.user || req.user.username !== 'admin_test') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Get admin logs with filtering and pagination
router.get("/", requireAuth, requireAdmin, cacheMiddleware(60), async (req, res) => {
  try {
    const {
      level,
      category,
      userId,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
      search
    } = req.query;

    const query = {
      level: level as LogLevel,
      category: category as LogCategory,
      userId: userId ? parseInt(userId as string) : undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: Math.min(parseInt(limit as string), 1000),
      offset: parseInt(offset as string),
      search: search as string
    };

    const result = await AdminLogger.queryLogs(query);

    await AdminLogger.logAPI(
      "ADMIN_LOGS_ACCESSED",
      `Admin viewed logs with filters: ${JSON.stringify(query)}`,
      req.user?.id,
      { query, resultCount: result.logs.length }
    );

    res.json(result);
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    res.status(500).json({ error: "Failed to fetch admin logs" });
  }
});

// Get log summary for dashboard
router.get("/summary", requireAuth, requireAdmin, cacheMiddleware(300), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const summary = await AdminLogger.generateLogSummary(hours);

    await AdminLogger.logAPI(
      "ADMIN_LOGS_SUMMARY_ACCESSED",
      `Admin viewed log summary for ${hours} hours`,
      req.user?.id,
      { hours }
    );

    res.json(summary);
  } catch (error) {
    console.error("Error generating log summary:", error);
    res.status(500).json({ error: "Failed to generate log summary" });
  }
});

// Get logs by specific user
router.get("/user/:userId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 100;

    const logs = await AdminLogger.getLogsByUser(userId, limit);

    await AdminLogger.logAPI(
      "USER_LOGS_ACCESSED",
      `Admin viewed logs for user ${userId}`,
      req.user?.id,
      { targetUserId: userId, resultCount: logs.length }
    );

    res.json({ logs, userId, count: logs.length });
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).json({ error: "Failed to fetch user logs" });
  }
});

// Get recent critical logs
router.get("/critical", requireAuth, requireAdmin, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const logs = await AdminLogger.getCriticalLogs(hours);

    await AdminLogger.logAPI(
      "CRITICAL_LOGS_ACCESSED",
      `Admin viewed critical logs for ${hours} hours`,
      req.user?.id,
      { hours, criticalCount: logs.length }
    );

    res.json({ logs, hours, count: logs.length });
  } catch (error) {
    console.error("Error fetching critical logs:", error);
    res.status(500).json({ error: "Failed to fetch critical logs" });
  }
});

// Cleanup old logs (manual trigger)
router.post("/cleanup", requireAuth, requireAdmin, async (req, res) => {
  try {
    const deletedCount = await AdminLogger.cleanupOldLogs();

    await AdminLogger.logSystem(
      "MANUAL_LOG_CLEANUP",
      `Admin manually triggered log cleanup, deleted ${deletedCount} old logs`,
      LogLevel.INFO,
      { adminUserId: req.user?.id, deletedCount }
    );

    res.json({ 
      message: "Log cleanup completed", 
      deletedCount 
    });
  } catch (error) {
    console.error("Error during log cleanup:", error);
    res.status(500).json({ error: "Log cleanup failed" });
  }
});

// Get authentication logs (specific category)
router.get("/auth", requireAuth, requireAdmin, cacheMiddleware(180), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const result = await AdminLogger.queryLogs({
      category: LogCategory.AUTH,
      startDate,
      limit: 500
    });

    res.json({
      logs: result.logs,
      timeRange: `Last ${hours} hours`,
      count: result.logs.length,
      total: result.total
    });
  } catch (error) {
    console.error("Error fetching auth logs:", error);
    res.status(500).json({ error: "Failed to fetch authentication logs" });
  }
});

// Get security logs (specific category)
router.get("/security", requireAuth, requireAdmin, cacheMiddleware(180), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const result = await AdminLogger.queryLogs({
      category: LogCategory.SECURITY,
      startDate,
      limit: 500
    });

    res.json({
      logs: result.logs,
      timeRange: `Last ${hours} hours`,
      count: result.logs.length,
      total: result.total
    });
  } catch (error) {
    console.error("Error fetching security logs:", error);
    res.status(500).json({ error: "Failed to fetch security logs" });
  }
});

// Export log data for external analysis
router.get("/export", requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      format = 'json',
      startDate,
      endDate,
      category,
      level
    } = req.query;

    const query = {
      category: category as LogCategory,
      level: level as LogLevel,
      startDate: startDate ? new Date(startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Default: last 7 days
      endDate: endDate ? new Date(endDate as string) : new Date(),
      limit: 10000 // Large limit for export
    };

    const result = await AdminLogger.queryLogs(query);

    await AdminLogger.logSystem(
      "LOGS_EXPORTED",
      `Admin exported ${result.logs.length} logs in ${format} format`,
      LogLevel.INFO,
      { adminUserId: req.user?.id, exportQuery: query, format }
    );

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = 'Timestamp,Level,Category,Action,Details,User ID,Email,IP Address\n';
      const csvRows = result.logs.map(log => [
        log.timestamp.toISOString(),
        log.level,
        log.category,
        log.action,
        `"${log.details.replace(/"/g, '""')}"`, // Escape quotes
        log.userId || '',
        log.userEmail || '',
        log.ipAddress || ''
      ].join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="admin-logs-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvHeaders + csvRows);
    } else {
      // Default to JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="admin-logs-${new Date().toISOString().split('T')[0]}.json"`);
      res.json({
        exportedAt: new Date().toISOString(),
        query,
        totalLogs: result.total,
        exportedLogs: result.logs.length,
        logs: result.logs
      });
    }
  } catch (error) {
    console.error("Error exporting logs:", error);
    res.status(500).json({ error: "Failed to export logs" });
  }
});

// Get available log categories and levels
router.get("/metadata", requireAuth, requireAdmin, (req, res) => {
  res.json({
    levels: Object.values(LogLevel),
    categories: Object.values(LogCategory),
    retentionDays: 90,
    maxLogsPerRequest: 1000
  });
});

export default router;