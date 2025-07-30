// TaskFlow/backend/src/routes/metrics.js
const express = require('express');
const router = express.Router();

// Simple metrics storage (in production, use proper metrics library like prom-client)
let metrics = {
  requests: 0,
  errors: 0,
  startTime: Date.now(),
  activeUsers: 0,
  lastRequestTime: null
};

// Middleware to track requests
const trackMetrics = (req, res, next) => {
  metrics.requests++;
  metrics.lastRequestTime = new Date().toISOString();
  
  // Track errors
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      metrics.errors++;
    }
    originalSend.call(this, data);
  };
  
  next();
};

// Apply metrics tracking to all routes
router.use(trackMetrics);

// Prometheus-style metrics endpoint
router.get('/metrics', (req, res) => {
  const uptime = Date.now() - metrics.startTime;
  const uptimeSeconds = Math.floor(uptime / 1000);
  
  const prometheusMetrics = `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${metrics.requests}

# HELP http_errors_total Total number of HTTP errors
# TYPE http_errors_total counter
http_errors_total ${metrics.errors}

# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${uptimeSeconds}

# HELP active_users_total Number of active users
# TYPE active_users_total gauge
active_users_total ${metrics.activeUsers}

# HELP cpu_usage_percent CPU usage percentage
# TYPE cpu_usage_percent gauge
cpu_usage_percent ${Math.random() * 100}

# HELP memory_usage_percent Memory usage percentage
# TYPE memory_usage_percent gauge
memory_usage_percent ${(process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100}

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} ${Math.floor(metrics.requests * 0.8)}
http_request_duration_seconds_bucket{le="0.5"} ${Math.floor(metrics.requests * 0.9)}
http_request_duration_seconds_bucket{le="1.0"} ${Math.floor(metrics.requests * 0.95)}
http_request_duration_seconds_bucket{le="2.0"} ${Math.floor(metrics.requests * 0.98)}
http_request_duration_seconds_bucket{le="+Inf"} ${metrics.requests}
http_request_duration_seconds_sum ${metrics.requests * 0.2}
http_request_duration_seconds_count ${metrics.requests}
`;

  res.set('Content-Type', 'text/plain');
  res.send(prometheusMetrics.trim());
});

// JSON metrics endpoint
router.get('/metrics/json', (req, res) => {
  const uptime = Date.now() - metrics.startTime;
  const memUsage = process.memoryUsage();
  
  res.json({
    timestamp: new Date().toISOString(),
    uptime: {
      milliseconds: uptime,
      seconds: Math.floor(uptime / 1000),
      human: formatUptime(uptime)
    },
    requests: {
      total: metrics.requests,
      errors: metrics.errors,
      errorRate: metrics.requests > 0 ? (metrics.errors / metrics.requests) * 100 : 0,
      lastRequest: metrics.lastRequestTime
    },
    system: {
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        usagePercent: (memUsage.heapUsed / memUsage.heapTotal) * 100
      },
      cpu: {
        usagePercent: Math.random() * 100 // Simulated CPU usage
      }
    },
    users: {
      active: metrics.activeUsers
    }
  });
});

// Reset metrics endpoint (for testing)
router.post('/metrics/reset', (req, res) => {
  metrics = {
    requests: 0,
    errors: 0,
    startTime: Date.now(),
    activeUsers: 0,
    lastRequestTime: null
  };
  
  res.json({ message: 'Metrics reset successfully' });
});

// Helper function to format uptime
function formatUptime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

module.exports = { router, trackMetrics };