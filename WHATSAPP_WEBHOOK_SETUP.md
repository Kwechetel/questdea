# WhatsApp Webhook Setup Guide

## 🎯 Overview

To enable two-way chat, you need to configure a webhook that allows WhatsApp to send incoming messages to your server.

## 📋 Prerequisites

1. ✅ WhatsApp Cloud API already set up
2. ✅ Access token with `whatsapp_business_messaging` permission
3. ✅ Your app deployed and accessible via HTTPS (for production)

## 🔧 Step-by-Step Setup

### Step 1: Generate Webhook Token

Generate a secure random token for webhook verification:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated token.

### Step 2: Add Environment Variables

Add to your `.env.local`:

```env
# WhatsApp Webhook Configuration
WHATSAPP_WEBHOOK_TOKEN=your_generated_token_here
WHATSAPP_APP_SECRET=your_app_secret_from_meta
```

**Where to find App Secret:**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your app
3. Go to **Settings** → **Basic**
4. Find **App Secret** → Click **Show**
5. Copy the secret

### Step 3: Deploy Your App

The webhook endpoint is at: `/api/webhooks/whatsapp`

**For local testing:**
- Use ngrok or similar tool to expose localhost
- URL: `https://your-ngrok-url.ngrok.io/api/webhooks/whatsapp`

**For production:**
- Deploy to Vercel
- URL: `https://yourdomain.com/api/webhooks/whatsapp`

### Step 4: Configure Webhook in Meta

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your app → **WhatsApp** → **Configuration**
3. Scroll to **Webhook** section
4. Click **Edit**
5. Enter:
   - **Callback URL:** `https://yourdomain.com/api/webhooks/whatsapp`
   - **Verify Token:** (same as `WHATSAPP_WEBHOOK_TOKEN` in `.env.local`)
6. Click **Verify and Save**

### Step 5: Subscribe to Webhook Fields

After verification, subscribe to webhook fields:

1. In the **Webhook** section, click **Manage**
2. Check the following fields:
   - ✅ `messages` - For incoming messages
   - ✅ `message_status` - For delivery receipts (optional)
3. Click **Save**

## 🧪 Testing

### Test Webhook Verification

1. Meta will send a GET request to verify your webhook
2. Your endpoint should return the `hub.challenge` value
3. Check your server logs for: `✅ Webhook verified successfully`

### Test Incoming Messages

1. Send a message to your business WhatsApp number
2. Check your server logs for: `📨 New message from +1234567890: Hello`
3. Check your database - message should be saved
4. Check admin dashboard - conversation should appear

## 🔍 Troubleshooting

### Webhook Verification Fails

- **Check token match:** Verify `WHATSAPP_WEBHOOK_TOKEN` matches what you entered in Meta
- **Check endpoint:** Make sure URL is correct and accessible
- **Check logs:** Look for error messages in server logs

### Messages Not Received

- **Check webhook subscription:** Make sure `messages` field is subscribed
- **Check server logs:** Look for webhook POST requests
- **Check database:** Verify messages are being saved
- **Check phone number format:** Ensure client's number is in international format

### Signature Verification Fails

- **Check App Secret:** Make sure `WHATSAPP_APP_SECRET` is correct
- **Check signature header:** Meta sends `x-hub-signature-256` header
- **Note:** Signature verification is optional but recommended for security

## 🔒 Security Best Practices

1. **Use HTTPS:** Webhooks only work with HTTPS URLs
2. **Verify Signatures:** Always verify webhook signatures in production
3. **Use Strong Tokens:** Generate secure random tokens
4. **Keep Secrets Safe:** Never commit tokens/secrets to Git
5. **Rate Limiting:** Consider adding rate limiting to webhook endpoint

## 📊 Webhook Payload Structure

### Incoming Message

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "changes": [
        {
          "field": "messages",
          "value": {
            "messages": [
              {
                "from": "1234567890",
                "id": "wamid.xxx",
                "timestamp": "1234567890",
                "type": "text",
                "text": {
                  "body": "Hello!"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Message Status Update

```json
{
  "statuses": [
    {
      "id": "wamid.xxx",
      "status": "delivered",
      "timestamp": "1234567890"
    }
  ]
}
```

## 🚀 Next Steps

After webhook is configured:

1. ✅ Test with a real message
2. ✅ Check admin chat interface
3. ✅ Verify messages are saved to database
4. ✅ Test sending responses from admin dashboard

## 📚 Resources

- [WhatsApp Webhooks Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Webhook Verification](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification)

---

**Quick Checklist:**
- [ ] Generated webhook token
- [ ] Added environment variables
- [ ] Deployed app (or set up ngrok for local)
- [ ] Configured webhook in Meta
- [ ] Subscribed to `messages` field
- [ ] Tested webhook verification
- [ ] Tested incoming message
- [ ] Verified message in database

