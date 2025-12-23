# Webhook Verification Fix

## ❌ Error Message

"The callback URL or verify token couldn't be validated. Please verify the provided information or try again later."

## 🔍 Root Cause

The `WHATSAPP_WEBHOOK_TOKEN` environment variable is not set, so when Meta tries to verify the webhook, your server can't match the token.

## ✅ Solution

### Step 1: Add Token to `.env.local`

Open your `.env.local` file and add:

```env
WHATSAPP_WEBHOOK_TOKEN=41b14dca5e94627100beacd15ea9136471b1fefb82186872687f6053dfcb7823
```

**Important:** This must be the EXACT same token you entered in Meta's webhook configuration.

### Step 2: Restart Dev Server (if running locally)

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 3: Add Token to Vercel (for production)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key:** `WHATSAPP_WEBHOOK_TOKEN`
   - **Value:** `41b14dca5e94627100beacd15ea9136471b1fefb82186872687f6053dfcb7823`
   - **Environments:** Production, Preview, Development
4. Click **Save**
5. **Redeploy** your application (or it will update on next deploy)

### Step 4: Verify Webhook Again

1. Go back to Meta → WhatsApp → Configuration → Webhook
2. Make sure:
   - **Callback URL:** `https://lastte.com/api/webhooks/whatsapp`
   - **Verify Token:** `41b14dca5e94627100beacd15ea9136471b1fefb82186872687f6053dfcb7823`
3. Click **"Verify and save"** again

### Step 5: Check Server Logs

When you click "Verify and save", Meta sends a GET request. Check your server logs for:

```
✅ Webhook verified successfully
```

If you see this, verification worked!

## 🧪 Testing the Endpoint

You can test the endpoint manually:

```bash
# Test GET request (verification)
curl "https://lastte.com/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=41b14dca5e94627100beacd15ea9136471b1fefb82186872687f6053dfcb7823&hub.challenge=test123"

# Should return: test123
```

## 🔍 Additional Checks

### Check 1: Endpoint is Accessible

Make sure `https://lastte.com/api/webhooks/whatsapp` is accessible:

- Should return 200 status for GET requests
- Should not return 404 or 500 errors

### Check 2: Token Matches Exactly

- Token in `.env.local` must match token in Meta
- No extra spaces or quotes
- Case-sensitive

### Check 3: Server is Running

- For local: Dev server must be running
- For production: App must be deployed to Vercel

## 📊 Verification Flow

1. **Meta sends GET request:**

   ```
   GET /api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=RANDOM_STRING
   ```

2. **Your server checks:**

   - Is `hub.mode` = "subscribe"? ✅
   - Does `hub.verify_token` match `WHATSAPP_WEBHOOK_TOKEN`? ✅
   - If both true, return `hub.challenge` value

3. **Meta verifies:**
   - If it receives the challenge value back, verification succeeds ✅

## 🐛 Still Not Working?

### Check Server Logs

Look for:

- `❌ Webhook verification failed` - Token mismatch
- `WHATSAPP_WEBHOOK_TOKEN is not set` - Environment variable missing
- `500 Internal Server Error` - Server error

### Common Issues

1. **Token mismatch:**

   - Check `.env.local` has the token
   - Check Vercel has the token (for production)
   - Make sure no extra spaces/quotes

2. **Endpoint not accessible:**

   - Check if `https://lastte.com/api/webhooks/whatsapp` loads
   - Check Vercel deployment is live
   - Check domain DNS is correct

3. **Server not responding:**
   - Check if dev server is running (local)
   - Check Vercel deployment status (production)
   - Check server logs for errors

## ✅ Success Indicators

After fixing, you should see:

- ✅ Meta shows webhook as "Verified"
- ✅ Server logs show: `✅ Webhook verified successfully`
- ✅ You can subscribe to webhook fields
- ✅ Incoming messages appear in logs

---

**Quick Fix Summary:**

1. Add `WHATSAPP_WEBHOOK_TOKEN` to `.env.local`
2. Add same token to Vercel environment variables
3. Restart/redeploy
4. Click "Verify and save" in Meta again
