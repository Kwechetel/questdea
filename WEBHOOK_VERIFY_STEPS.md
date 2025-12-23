# Webhook Verification - Final Steps

## ✅ Current Status

Your webhook configuration looks correct:
- ✅ Callback URL: `https://lastte.com/api/webhooks/whatsapp`
- ✅ Verify Token: Entered (masked)

## 🔧 Before Clicking "Verify and Save"

### Step 1: Add Token to Vercel (CRITICAL!)

Since you're using `https://lastte.com`, this is your production environment. The token MUST be in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key:** `WHATSAPP_WEBHOOK_TOKEN`
   - **Value:** `41b14dca5e94627100beacd15ea9136471b1fefb82186872687f6053dfcb7823`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
6. Click **Save**
7. **Redeploy** your application (or wait for next auto-deploy)

**Why this is critical:** Meta will send the verification request to `https://lastte.com`, which is your Vercel deployment. The token must be available there!

### Step 2: Verify Endpoint is Accessible

Test if your endpoint is live:

```bash
# Test the endpoint
curl "https://lastte.com/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=41b14dca5e94627100beacd15ea9136471b1fefb82186872687f6053dfcb7823&hub.challenge=test123"
```

**Expected response:** `test123`

If you get an error, the endpoint isn't accessible or the token doesn't match.

## 🚀 Click "Verify and Save"

1. Click the blue **"Verify and save"** button in Meta
2. Meta will send a GET request to your webhook endpoint
3. Your server should respond with the challenge value
4. Meta will mark the webhook as "Verified" ✅

## 📊 Check Verification Status

### In Meta:
- The webhook section should show "Verified" status
- No error messages

### In Vercel Logs:
1. Go to Vercel Dashboard → Your Project → **Functions** tab
2. Look for recent invocations of `/api/webhooks/whatsapp`
3. Check the logs for:
   ```
   ✅ Webhook verified successfully
   ```

### If Verification Fails:

Check Vercel logs for errors:
- `❌ Webhook verification failed` - Token mismatch
- `WHATSAPP_WEBHOOK_TOKEN is not set` - Token not in Vercel
- `500 Internal Server Error` - Server error

## ✅ After Successful Verification

1. **Subscribe to Webhook Fields:**
   - Click **"Manage"** next to the webhook section
   - Check ✅ `messages` (required)
   - Check ✅ `message_status` (optional)
   - Click **Save**

2. **Test with a Real Message:**
   - Send a message to your WhatsApp number: **+263 77 359 9291**
   - Check Vercel function logs
   - You should see: `📥 Webhook POST received`
   - Check your admin dashboard - conversation should appear

## 🔍 Troubleshooting

### Issue: Verification Still Fails

**Check 1: Token in Vercel**
- Go to Vercel → Settings → Environment Variables
- Verify `WHATSAPP_WEBHOOK_TOKEN` exists
- Value matches exactly (no spaces, no quotes)

**Check 2: Endpoint Accessibility**
- Visit: `https://lastte.com/api/webhooks/whatsapp` in browser
- Should not return 404
- Should handle GET requests

**Check 3: Vercel Deployment**
- Make sure latest code is deployed
- Check deployment status in Vercel
- Redeploy if needed

**Check 4: Function Logs**
- Go to Vercel → Functions → `/api/webhooks/whatsapp`
- Check recent invocations
- Look for error messages

### Issue: Webhook Verified But No Messages

1. **Check Webhook Subscription:**
   - Make sure `messages` field is subscribed
   - Go to Webhook → Manage → Check `messages`

2. **Test with Real Message:**
   - Send message to +263 77 359 9291
   - Check Vercel logs for webhook POST

3. **Check Database:**
   - Make sure Prisma migration is run
   - Check if messages table exists

## 📋 Quick Checklist

Before clicking "Verify and save":
- [ ] Token added to `.env.local`
- [ ] Token added to Vercel environment variables
- [ ] Vercel deployment is live
- [ ] Endpoint is accessible at `https://lastte.com/api/webhooks/whatsapp`

After clicking "Verify and save":
- [ ] Meta shows webhook as "Verified"
- [ ] Vercel logs show: `✅ Webhook verified successfully`
- [ ] Subscribed to `messages` field
- [ ] Tested with real message

---

**Next Step:** Add the token to Vercel, then click "Verify and save"!

