# WhatsApp Test Webhook

## Purpose
A minimal webhook handler to test if WhatsApp messages (including emojis) are reaching the route at all.

## Location
`app/api/webhooks/whatsapp-test/route.ts`

## What It Does

### ✅ What It Does
- Returns 200 OK immediately
- Logs that the webhook was hit
- Logs request headers (Content-Type, Content-Length, etc.)
- Logs timestamp of request
- **NO parsing** - doesn't parse the request body
- **NO database** - doesn't save anything
- **NO processing** - just logs and returns

### ❌ What It Doesn't Do
- Doesn't parse `request.json()`
- Doesn't extract message data
- Doesn't save to database
- Doesn't process messages
- Doesn't verify signatures

## Usage

### Step 1: Update Webhook URL in Meta Dashboard

1. Go to Meta for Developers → Your App → WhatsApp → Configuration
2. Update webhook URL to:
   ```
   https://your-domain.com/api/webhooks/whatsapp-test
   ```
3. Save the webhook URL

### Step 2: Verify Webhook

Meta will send a GET request to verify the webhook:
- Check your server logs for: `[TEST WEBHOOK] GET request received`
- Should see: `✅ [TEST WEBHOOK] Webhook verified successfully`

### Step 3: Send Test Message

Send a WhatsApp message with emojis:
- Example: "Hello 😊👍🎉"
- Check your server logs for: `[TEST WEBHOOK] POST request received`

### Step 4: Check Logs

Look for these log entries:

```
================================================================================
🔔 [TEST WEBHOOK] POST request received at 2024-01-01T12:00:00.000Z
================================================================================
📋 Request Headers:
  Content-Type: application/json
  Content-Length: 1234
  User-Agent: Meta-Webhooks/1.0
  X-Hub-Signature-256: PRESENT
📋 Request URL: https://your-domain.com/api/webhooks/whatsapp-test
📋 Body size: 1234 bytes
✅ [TEST WEBHOOK] Returning 200 OK immediately
================================================================================
```

## What to Look For

### ✅ Success Indicators

1. **Webhook is being called**:
   - You see `[TEST WEBHOOK] POST request received` in logs
   - This means WhatsApp is successfully calling your webhook

2. **Messages with emojis are reaching the route**:
   - If you see POST requests, emoji messages are reaching the route
   - The issue is likely in parsing/processing, not delivery

3. **Request headers are present**:
   - Content-Type should be `application/json`
   - Content-Length should show the body size
   - X-Hub-Signature-256 should be PRESENT

### ❌ Failure Indicators

1. **No POST requests in logs**:
   - Webhook URL might be incorrect
   - Webhook might not be verified
   - WhatsApp might not be calling the route

2. **GET request fails**:
   - `WHATSAPP_WEBHOOK_TOKEN` might be incorrect
   - Webhook verification failed

3. **403 Forbidden**:
   - Token mismatch
   - Check `WHATSAPP_WEBHOOK_TOKEN` environment variable

## Testing Scenarios

### Test 1: Regular Text Message
Send: "Hello"
- Should see POST request in logs
- Content-Length should be small (~200-300 bytes)

### Test 2: Text with Emojis
Send: "Hello 😊👍🎉"
- Should see POST request in logs
- Content-Length should be larger (~400-500 bytes)
- This confirms emoji messages reach the route

### Test 3: Emoji-Only Message
Send: "😊👍🎉"
- Should see POST request in logs
- Content-Length should be medium (~300-400 bytes)

### Test 4: Multiple Messages
Send several messages in quick succession
- Should see multiple POST requests
- Each should log separately

## Next Steps

### If Webhook is Being Called ✅

If you see POST requests in logs:
1. ✅ Messages are reaching the route
2. ✅ Issue is likely in parsing/processing
3. ✅ Check the main webhook handler (`/api/webhooks/whatsapp`)
4. ✅ Review `extractMessageData()` function
5. ✅ Check database insert logic

### If Webhook is NOT Being Called ❌

If you DON'T see POST requests:
1. ❌ Webhook URL might be incorrect
2. ❌ Webhook might not be verified
3. ❌ Check Meta dashboard webhook configuration
4. ❌ Verify `WHATSAPP_WEBHOOK_TOKEN` is set correctly
5. ❌ Check server is accessible from internet

## Comparison with Main Webhook

| Feature | Test Webhook | Main Webhook |
|---------|-------------|--------------|
| Returns 200 OK | ✅ Immediately | ✅ Immediately |
| Logs request | ✅ Basic info | ✅ Detailed |
| Parses body | ❌ No | ✅ Yes |
| Saves to DB | ❌ No | ✅ Yes |
| Processes messages | ❌ No | ✅ Yes |
| Verifies signature | ❌ No | ✅ Yes |

## Environment Variables Required

```env
WHATSAPP_WEBHOOK_TOKEN=your_webhook_verification_token
```

## Cleanup

Once you've confirmed messages are reaching the route:
1. Switch back to main webhook URL: `/api/webhooks/whatsapp`
2. Delete or keep test webhook for future debugging
3. Test webhook can be left in place (it's harmless)

## Troubleshooting

### No Logs Appearing

1. Check server is running
2. Check logs are being output (console.log)
3. Check webhook URL is correct
4. Check Meta dashboard shows webhook as "Verified"

### 403 Forbidden

1. Check `WHATSAPP_WEBHOOK_TOKEN` matches Meta dashboard
2. Verify token in Meta dashboard → WhatsApp → Configuration
3. Ensure token is set in environment variables

### 500 Error

1. Check `WHATSAPP_WEBHOOK_TOKEN` is set
2. Check server logs for error details
3. Verify Node.js runtime is available

## Notes

- This webhook is **read-only** - it doesn't modify anything
- Safe to leave running alongside main webhook
- Can be used for debugging anytime
- Minimal performance impact (just logging)

