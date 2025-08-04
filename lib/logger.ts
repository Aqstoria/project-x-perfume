export interface LogLevel {
  DEBUG: "debug";
  INFO: "info";
  WARN: "warn";
  ERROR: "error";
  FATAL: "fatal";
}

export interface LogContext {
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  requestId?: string;
  [key: string]: unknown;
}

class Logger {

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : "";
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage("debug", message, context);
    console.debug(formattedMessage);
  }

  info(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage("info", message, context);
    console.info(formattedMessage);
  }

  warn(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage("warn", message, context);
    console.warn(formattedMessage);
  }

  error(message: string, error?: Error, context?: LogContext) {
    const formattedMessage = this.formatMessage("error", message, context);
    console.error(formattedMessage, error);
  }

  fatal(message: string, error?: Error, context?: LogContext) {
    const formattedMessage = this.formatMessage("fatal", message, context);
    console.error(formattedMessage, error);
  }

  // Specialized logging methods
  logUserAction(userId: string, action: string, entity?: string, entityId?: string, details?: Record<string, unknown>) {
    this.info(`User action: ${action}`, {
      userId,
      action,
      entity: entity || "unknown",
      entityId: entityId || "unknown",
      details: details || null,
    });
  }

  logOrderEvent(orderId: string, event: string, userId?: string, details?: Record<string, unknown>) {
    this.info(`Order event: ${event}`, {
      orderId,
      event,
      userId: userId || "unknown",
      details: details || null,
    });
  }

  logPricingCalculation(customerId: string, productId: string, result: Record<string, unknown>) {
    this.debug("Pricing calculation", {
      customerId,
      productId,
      result,
    });
  }

  logSecurityEvent(event: string, error: Error) {
    const errorInfo = new Error(`Security event: ${event} - ${error.message}`);
    if (error.stack) {
      errorInfo.stack = error.stack;
    }
    this.error(errorInfo.message);
  }

  logDatabaseQuery(query: string, duration: number, success: boolean) {
    if (duration > 1000) {
      this.warn("Slow database query", {
        query,
        duration,
        success,
      });
    } else {
      this.debug("Database query", {
        query,
        duration,
        success,
      });
    }
  }

  // Performance monitoring
  logPerformance(operation: string, duration: number, context?: LogContext) {
    if (duration > 5000) {
      this.error(`Slow operation: ${operation} took ${duration}ms`, undefined);
    } else if (duration > 1000) {
      this.warn(`Slow operation: ${operation} took ${duration}ms`);
    } else {
      this.debug(`Operation: ${operation} took ${duration}ms`, context);
    }
  }

  logSlowOperation(operation: string, duration: number, context?: Record<string, unknown>) {
    this.warn(`Slow operation: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...context,
    });
  }
}

export const logger = new Logger();

// Export for convenience
export default logger;
