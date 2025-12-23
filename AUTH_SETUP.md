# Authentication Setup Guide

## What Was Implemented

✅ **NextAuth.js (Auth.js v5)** with:
- Credentials provider (email/password)
- JWT-based sessions (30-day expiration)
- Role-based access control (ADMIN/CLIENT)
- Protected admin routes via middleware
- Login page at `/login`
- Admin leads page at `/admin/leads`

## Files Created

1. **`pages/api/auth/[...nextauth].ts`** - NextAuth API route with credentials provider
2. **`pages/login.tsx`** - Login page with form
3. **`pages/admin/leads.tsx`** - Protected admin page to view leads
4. **`pages/api/leads/index.ts`** - API endpoint to fetch leads (admin only)
5. **`middleware.ts`** - Route protection middleware
6. **`types/next-auth.d.ts`** - TypeScript definitions for NextAuth

## Updated Files

- **`pages/_app.tsx`** - Added SessionProvider wrapper
- **`package.json`** - Added `next-auth` and `@auth/prisma-adapter` dependencies

## Installation

1. **Install dependencies:**
   ```bash
   npm install next-auth@beta @auth/prisma-adapter
   ```

2. **Add environment variables to `.env`:**
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

   Generate a secret:
   ```bash
   openssl rand -base64 32
   ```

## How to Test

### 1. Setup Database & Seed Admin User

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed admin user
npm run prisma:seed
```

This creates:
- **Email:** `admin@lastte.com`
- **Password:** `ChangeMe123!`

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test Authentication Flow

1. **Try accessing protected route:**
   - Navigate to `http://localhost:3000/admin/leads`
   - Should redirect to `/login`

2. **Login:**
   - Go to `http://localhost:3000/login`
   - Enter: `admin@lastte.com` / `ChangeMe123!`
   - Should redirect to `/admin/leads`

3. **Verify protection:**
   - Logout (if you add logout button)
   - Try accessing `/admin/leads` directly
   - Should redirect to login

### 4. Test API Endpoint

```bash
# Get session cookie first by logging in via browser
# Then test API:
curl http://localhost:3000/api/leads \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

## Security Notes

### ✅ Implemented

1. **Password Hashing:**
   - Uses `bcrypt` with salt rounds (10)
   - Passwords never stored in plain text

2. **JWT Sessions:**
   - Tokens stored in httpOnly cookies (automatic with NextAuth)
   - 30-day expiration
   - Includes role in token for authorization

3. **Route Protection:**
   - Middleware checks authentication before allowing access
   - Role-based access control (ADMIN only for `/admin/*`)
   - Automatic redirect to login for unauthorized users

4. **API Protection:**
   - Server-side session verification
   - Role checking on API routes
   - Returns 401/403 for unauthorized requests

### 🔒 Recommended Additions

1. **Rate Limiting:**
   ```bash
   npm install express-rate-limit
   ```
   - Add to login endpoint (max 5 attempts per 15 minutes)
   - Add to API routes (prevent abuse)

2. **CSRF Protection:**
   - NextAuth handles this automatically
   - Ensure `NEXTAUTH_URL` matches your domain

3. **Password Requirements:**
   - Add validation: min 8 chars, uppercase, lowercase, number
   - Consider adding password strength meter

4. **Session Security:**
   - Consider shorter session expiration for production (e.g., 24 hours)
   - Add "Remember me" option with longer expiration
   - Implement session refresh tokens

5. **Additional Security Headers:**
   ```typescript
   // In next.config.js
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           { key: 'X-Frame-Options', value: 'DENY' },
           { key: 'X-Content-Type-Options', value: 'nosniff' },
           { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
         ],
       },
     ];
   },
   ```

6. **Environment Variables:**
   - Never commit `.env` to git
   - Use different secrets for dev/staging/production
   - Rotate `NEXTAUTH_SECRET` periodically

7. **Logging & Monitoring:**
   - Log failed login attempts
   - Monitor for suspicious activity
   - Set up alerts for multiple failed attempts

8. **HTTPS:**
   - Always use HTTPS in production
   - Ensures cookies are transmitted securely
   - Required for httpOnly cookies in production

## API Usage Examples

### Client-Side (React Components)

```typescript
import { useSession, signIn, signOut } from "next-auth/react";

// Get session
const { data: session, status } = useSession();

// Sign in
await signIn("credentials", {
  email: "admin@lastte.com",
  password: "password",
  redirect: false,
});

// Sign out
await signOut({ redirect: true, callbackUrl: "/" });
```

### Server-Side (API Routes)

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (session.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  // Your protected logic here
}
```

## Troubleshooting

**Issue:** "NEXTAUTH_SECRET is not set"
- **Solution:** Add `NEXTAUTH_SECRET` to your `.env` file

**Issue:** Redirect loop on login
- **Solution:** Check `NEXTAUTH_URL` matches your actual URL

**Issue:** "Invalid credentials" but password is correct
- **Solution:** Ensure database is seeded and user exists

**Issue:** Middleware not protecting routes
- **Solution:** Check `middleware.ts` is in root directory and `config.matcher` is correct

