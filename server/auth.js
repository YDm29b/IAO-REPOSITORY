import crypto from 'crypto';

const IS_PROD = process.env.NODE_ENV === 'production';

// Dev Default Fallbacks
const DEV_ADMIN_USER = 'admin';
const DEV_ADMIN_PASS = 'iao_admin_2026_pass';
const DEV_JWT_SECRET = 'iao_secret_jwt_key_2026_default_secret_string';

// Read Environment Secrets
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || DEV_ADMIN_USER;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEV_ADMIN_PASS;
export const JWT_SECRET = process.env.JWT_SECRET || DEV_JWT_SECRET;

// Perform Startup Security Audit
export function auditSecurityConfig() {
  if (IS_PROD) {
    if (ADMIN_PASSWORD === DEV_ADMIN_PASS) {
      console.error('\n❌ CRITICAL SECURITY ERROR: ADMIN_PASSWORD environment variable is using insecure default in production!');
      throw new Error('SECURITY VIOLATION: ADMIN_PASSWORD environment variable must be set in production.');
    }
    if (JWT_SECRET === DEV_JWT_SECRET) {
      console.error('\n❌ CRITICAL SECURITY ERROR: JWT_SECRET environment variable is using insecure default in production!');
      throw new Error('SECURITY VIOLATION: JWT_SECRET environment variable must be set in production.');
    }
  } else {
    console.log('[SECURITY AUDIT] Running in development mode. Admin Auth active.');
  }
}

// Call startup security check
auditSecurityConfig();

// Verify Admin Login Credentials
export function checkAdminCredentials(username, password) {
  if (!username || !password) return false;

  const userBuf = Buffer.from(username.trim());
  const expectedUserBuf = Buffer.from(ADMIN_USERNAME);

  const passBuf = Buffer.from(password);
  const expectedPassBuf = Buffer.from(ADMIN_PASSWORD);

  if (userBuf.length !== expectedUserBuf.length || passBuf.length !== expectedPassBuf.length) {
    return false;
  }

  const userMatch = crypto.timingSafeEqual(userBuf, expectedUserBuf);
  const passMatch = crypto.timingSafeEqual(passBuf, expectedPassBuf);
  return userMatch && passMatch;
}

// Token Signing (HMAC-SHA256 Token)
export function generateAdminToken(username) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    role: 'ADMIN',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
  })).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

// Token Verification
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return decoded;
  } catch (err) {
    return null;
  }
}

// Express Auth Middleware
export function adminAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAdminToken(token);

  if (!decoded || decoded.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin token.' });
  }

  req.adminUser = decoded;
  next();
}
