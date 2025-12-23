# WhatsApp Webhook Debugging Guide

## 🔍 How to Debug Webhook Issues

### Step 1: Check Webhook Configuration

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your app → **WhatsApp** → **Configuration**
3. Check **Webhook** section:
   - ✅ Is webhook URL set?
   - ✅ Is verify token set?
   - ✅ Are webhook fields subscribed? (messages, message_status)

### Step 2: Test Webhook Verification

The webhook endpoint should respond to GET requests for verification.

**Test locally with ngrok:**
```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose localhost
ngrok http 3000

# Use the ngrok URL in Meta webhook configuration
# Example: https://abc123.ngrok.io/api/webhooks/whatsapp
```

**Check server logs when Meta verifies:**
- Should see: `✅ Webhook verified successfully`

### Step 3: Check Server Logs

When a message is sent to your WhatsApp number, check your server logs for:

```
📥 Webhook POST received
✅ Valid WhatsApp webhook payload
📨 Handling messages...
📨 Processing incoming message: {...}
✅ Message saved to database: [id]
```

### Step 4: Common Issues

#### Issue 1: Webhook Not Receiving Messages

**Symptoms:**
- No logs when message is sent
- Conversations list is empty

**Solutions:**
1. **Check webhook URL is accessible:**
   - Must be HTTPS (not HTTP)
   - Must be publicly accessible (not localhost)
   - Use ngrok for local testing

2. **Check webhook is subscribed:**
   - Go to Meta → WhatsApp → Configuration → Webhook
   - Make sure `messages` field is checked

3. **Check webhook verification:**
   - Meta sends GET request to verify
   - Your endpoint must return the challenge value
   - Check logs for verification success

#### Issue 2: Messages Received But Not Saved

**Symptoms:**
- See webhook logs but no database entries
- Conversations list is empty

**Solutions:**
1. **Check Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Check database connection:**
   - Verify DATABASE_URL is correct
   - Check database is accessible

3. **Check logs for errors:**
   - Look for `❌ Error saving message to database`

#### Issue 3: Webhook Verification Fails

**Symptoms:**
- Meta shows webhook as "not verified"
- GET request returns 403

**Solutions:**
1. **Check verify token matches:**
   - `.env.local`: `WHATSAPP_WEBHOOK_TOKEN=...`
   - Meta webhook config: Same token

2. **Check endpoint returns challenge:**
   - Must return the `hub.challenge` value
   - Must return 200 status

### Step 5: Manual Testing

#### Test Webhook Endpoint Directly

```bash
# Test GET (verification)
curl "http://localhost:3000/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test123"

# Should return: test123
```

#### Test with Sample Payload

```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "changes": [{
        "field": "messages",
        "value": {
          "messages": [{
            "from": "+1234567890",
            "id": "test123",
            "timestamp": "1234567890",
            "type": "text",
            "text": {"body": "Test message"}
          }]
        }
      }]
    }]
  }'
```

### Step 6: Production Setup

For production (Vercel):

1. **Set environment variables in Vercel:**
   - `WHATSAPP_WEBHOOK_TOKEN`
   - `WHATSAPP_APP_SECRET`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`

2. **Update webhook URL:**
   - Use your production domain
   - Example: `https://yourdomain.com/api/webhooks/whatsapp`

3. **Verify webhook:**
   - Meta will send GET request
   - Check Vercel logs for verification

### Step 7: Enable Debug Logging

The webhook endpoint now logs:
- ✅ All incoming requests
- ✅ Webhook verification
- ✅ Message processing
- ✅ Database saves
- ❌ Any errors

Check your server console/terminal for these logs.

## 🧪 Quick Test Checklist

- [ ] Webhook URL is set in Meta
- [ ] Verify token matches in Meta and .env.local
- [ ] Webhook is subscribed to `messages` field
- [ ] Webhook endpoint is accessible (HTTPS)
- [ ] Prisma Client is regenerated
- [ ] Database migration is run
- [ ] Server logs show webhook POST requests
- [ ] Messages are being saved to database

## 📞 Still Not Working?

1. **Check Meta Webhook Logs:**
   - Go to Meta → WhatsApp → Configuration → Webhook
   - Click "View webhook logs"
   - See what Meta is sending

2. **Check Your Server Logs:**
   - Look for webhook POST requests
   - Check for errors
   - Verify message processing

3. **Test Webhook Manually:**
   - Use curl or Postman
   - Send test payload
   - Check response

4. **Verify Database:**
   ```bash
   npx prisma studio
   # Check whatsapp_messages table
   ```

---

**Remember:** Webhooks require HTTPS in production. Use ngrok for local testing.

