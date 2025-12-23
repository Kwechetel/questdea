// Rate limiting for authentication endpoints
const loginAttempts = new Map<
  string,
  { count: number; resetTime: number; lockedUntil?: number }
>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes lockout after max attempts

export function getClientIP(req: any): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : req.socket?.remoteAddress || "unknown";
  return ip;
}

export function checkLoginRateLimit(
  identifier: string
): { allowed: boolean; remaining: number; lockedUntil?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  // Check if account is locked
  if (record?.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      lockedUntil: record.lockedUntil,
    };
  }

  // Reset if window expired or no record exists
  if (!record || now > record.resetTime) {
    loginAttempts.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  // Check if max attempts reached
  if (record.count >= MAX_ATTEMPTS) {
    // Lock the account
    const lockedUntil = now + LOCKOUT_MS;
    loginAttempts.set(identifier, {
      ...record,
      lockedUntil,
    });
    return {
      allowed: false,
      remaining: 0,
      lockedUntil,
    };
  }

  // Increment attempt count
  record.count++;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.count,
  };
}

export function resetLoginAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

// Clean up old entries periodically (optional, prevents memory leak)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of loginAttempts.entries()) {
      if (now > value.resetTime && (!value.lockedUntil || now > value.lockedUntil)) {
        loginAttempts.delete(key);
      }
    }
  }, 60 * 60 * 1000); // Clean up every hour
}

