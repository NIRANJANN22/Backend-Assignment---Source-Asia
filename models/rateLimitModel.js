class RateLimitModel {
  constructor() {
    this.userRequests = new Map();
    // Rolling window size: 60 seconds
    this.WINDOW_SIZE_MS = 60 * 1000;
    this.MAX_REQUESTS_PER_WINDOW = 5;
  }

  cleanup() {
    const now = Date.now();
    for (const [userId, data] of this.userRequests.entries()) {
      if (now - data.windowStart > this.WINDOW_SIZE_MS) {
        this.userRequests.delete(userId);
      }
    }
  }

  checkAndUpdate(userId) {
    const now = Date.now();
    
    // Get or create user record
    let userData = this.userRequests.get(userId);
    
    if (!userData || (now - userData.windowStart) >= this.WINDOW_SIZE_MS) {
      // New window
      userData = {
        windowStart: now,
        acceptedCount: 0,
        rejectedCount: 0
      };
      this.userRequests.set(userId, userData);
    }
    
    // Check if under limit
    if (userData.acceptedCount < this.MAX_REQUESTS_PER_WINDOW) {
      // Accept request
      userData.acceptedCount++;
      this.userRequests.set(userId, userData);
      return { accepted: true, rejectedCount: userData.rejectedCount };
    } else {
      // Reject request
      userData.rejectedCount++;
      this.userRequests.set(userId, userData);
      return { accepted: false, rejectedCount: userData.rejectedCount };
    }
  }

  getStats(userId) {
    const now = Date.now();
    const userData = this.userRequests.get(userId);
    
    if (!userData || (now - userData.windowStart) >= this.WINDOW_SIZE_MS) {
      return {
        acceptedInCurrentWindow: 0,
        totalRejected: 0,
        windowRemainingMs: this.WINDOW_SIZE_MS
      };
    }
    
    const elapsed = now - userData.windowStart;
    const remaining = Math.max(0, this.WINDOW_SIZE_MS - elapsed);
    
    return {
      acceptedInCurrentWindow: userData.acceptedCount,
      totalRejected: userData.rejectedCount,
      windowRemainingMs: remaining
    };
  }

  getAllStats() {
    const stats = {};
    for (const [userId, data] of this.userRequests.entries()) {
      stats[userId] = this.getStats(userId);
    }
    return stats;
  }
}

export default RateLimitModel;