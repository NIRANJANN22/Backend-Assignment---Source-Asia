import rateLimitModel from '../models/rateLimitModel.js';

// Singleton instance
const rateLimiter = new rateLimitModel();

// POST /request
export const handleRequest = (req, res) => {
  const { user_id, payload } = req.body;
  
  // Validate input
  if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
    return res.status(400).json({
      error: 'user_id is required and must be non-empty string'
    });
  }
  
  if (payload === undefined) {
    return res.status(400).json({
      error: 'payload is required'
    });
  }
  
  // Check rate limit
  const result = rateLimiter.checkAndUpdate(user_id);
  
  if (!result.accepted) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Maximum 5 requests per minute allowed',
      user_id: user_id,
      rejected_count_in_window: result.rejectedCount,
      retry_after_seconds: 60
    });
  }
  
  // Success response (201 Created as documented)
  return res.status(201).json({
    status: 'accepted',
    user_id: user_id,
    timestamp: new Date().toISOString(),
    request_id: Math.random().toString(36).substring(7)
  });
};

// GET /stats
export const getStats = (req, res) => {
  const allStats = rateLimiter.getAllStats();
  
  // Calculate global totals
  let totalAccepted = 0;
  let totalRejected = 0;
  
  for (const userId in allStats) {
    totalAccepted += allStats[userId].acceptedInCurrentWindow;
    totalRejected += allStats[userId].totalRejected;
  }
  
  return res.json({
    per_user: allStats,
    global: {
      total_accepted_current_window: totalAccepted,
      total_rejected_all_time: totalRejected,
      note: "Rejected counts are cumulative (all-time per window tracking)"
    },
    window_configuration: {
      window_size_seconds: 60,
      max_requests_per_window: 5,
      window_type: "rolling window (1 minute)"
    }
  });
};

// Optional: Cleanup interval (every minute)
setInterval(() => {
  rateLimiter.cleanup();
}, 60000);