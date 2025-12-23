# WhatsApp Cloud API Setup Guide

This guide will help you set up WhatsApp notifications for LASTTE using the official WhatsApp Cloud API.

## 📋 Prerequisites

- Meta (Facebook) Developer Account
- Meta Business Account
- WhatsApp Business Account (or test number)

## 🔧 Setup Steps

### 1. Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** as the app type
4. Fill in app details:
   - **App Name:** LASTTE Notifications
   - **App Contact Email:** your-email@example.com
5. Click **"Create App"**

### 2. Add WhatsApp Product

1. In your app dashboard, click **"Add Product"**
2. Find **"WhatsApp"** and click **"Set Up"**
3. Follow the setup wizard

### 3. Get Your Credentials

You'll need two important values:

#### Phone Number ID
1. In the WhatsApp product section, go to **"API Setup"**
2. Copy your **Phone Number ID** (looks like: `123456789012345`)

#### Access Token
1. In the **"API Setup"** section, find **"Temporary access token"**
2. For production, create a **System User** and generate a permanent token:
   - Go to **Business Settings** → **Users** → **System Users**
   - Create a new system user
   - Generate a token with `whatsapp_business_messaging` permission
   - Copy the **Access Token**

### 4. Get Your WhatsApp Phone Number

1. In the WhatsApp product section, you'll see your **WhatsApp Business Phone Number**
2. This is the number that will send messages
3. For testing, you can use Meta's test numbers

### 5. Add Environment Variables

Add these to your `.env.local` file:

```env
# WhatsApp Cloud API Configuration
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_ADMIN_PHONE=+1234567890
```

**Important:**
- `WHATSAPP_PHONE_NUMBER_ID`: Your Phone Number ID from Meta
- `WHATSAPP_ACCESS_TOKEN`: Your access token (permanent token for production)
- `WHATSAPP_ADMIN_PHONE`: The phone number where you want to receive notifications (include country code with +)

### 6. Add to Vercel (Production)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all three WhatsApp variables:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_ADMIN_PHONE`
4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**

## 📱 How It Works

### Automatic Notifications

When a new lead is submitted through the contact form:

1. Lead is saved to the database
2. A WhatsApp message is automatically sent to the admin phone number
3. The message includes:
   - Lead name
   - Email
   - Phone number
   - Business name (if provided)
   - Message content (truncated if too long)
   - Link to view in admin dashboard

### Message Format

```
🆕 New Lead Received

Name: John Doe
Email: john@example.com
Phone: +1234567890
Business: Acme Corp

Message:
I need help with my website...

View in dashboard: https://lastte.vercel.app/admin/leads
```

## 🧪 Testing

### 1. Test with Meta Test Numbers

Meta provides test phone numbers for development:

1. Go to **WhatsApp** → **API Setup** in your Meta app
2. Find **"To"** field in the test section
3. Use the test number provided (e.g., `+1234567890`)
4. Send a test message

### 2. Test Lead Submission

1. Submit a test lead through your contact form
2. Check your WhatsApp for the notification
3. Verify all information is correct

### 3. Check Logs

If notifications aren't working:

1. Check server logs for WhatsApp API errors
2. Verify environment variables are set correctly
3. Ensure your access token has the right permissions

## 🔒 Security Best Practices

1. **Never commit tokens to Git**
   - Always use environment variables
   - Add `.env.local` to `.gitignore`

2. **Use Permanent Tokens for Production**
   - Temporary tokens expire after 24 hours
   - Create System User tokens for production

3. **Rotate Tokens Regularly**
   - Change access tokens periodically
   - Revoke old tokens when creating new ones

4. **Limit Access**
   - Only grant necessary permissions
   - Use separate tokens for different environments

## 📊 WhatsApp Business Policy

### Important Limits

1. **24-Hour Window:**
   - You can only send template messages to users who haven't messaged you in 24 hours
   - For users within the 24-hour window, you can send free-form messages

2. **Template Messages:**
   - Must be pre-approved by Meta
   - Required for initiating conversations
   - Submit templates via Meta Business Manager

3. **Message Quality:**
   - Maintain high-quality messaging
   - Poor quality can reduce your messaging limits

### Daily Limits

- **Tier 1:** 1,000 conversations/day
- **Tier 2:** 10,000 conversations/day
- **Tier 3:** 100,000+ conversations/day

Limits increase based on your quality rating.

## 🐛 Troubleshooting

### Error: "Invalid phone number"
- Ensure phone number includes country code (e.g., `+1234567890`)
- Remove spaces, dashes, and parentheses
- Format: `+[country code][number]`

### Error: "Invalid access token"
- Check if token has expired (temporary tokens last 24 hours)
- Verify token has `whatsapp_business_messaging` permission
- Regenerate token if needed

### Error: "Phone number not registered"
- The recipient phone number must have WhatsApp installed
- For testing, use Meta's test numbers
- Ensure the number is in international format

### Notifications Not Sending
1. Check environment variables are set
2. Verify `WHATSAPP_ADMIN_PHONE` is correct
3. Check server logs for API errors
4. Ensure access token is valid

## 📚 Additional Resources

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Getting Started Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Template Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)
- [Webhooks Setup](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/webhooks)

## 🚀 Next Steps

After setup, you can:

1. **Create Custom Templates:**
   - Design message templates in Meta Business Manager
   - Get them approved by Meta
   - Use `sendWhatsAppTemplate()` function

2. **Add More Notification Types:**
   - Lead status updates
   - Case study published
   - Insight published
   - Custom admin alerts

3. **Set Up Webhooks:**
   - Receive incoming messages
   - Handle message status updates
   - Build two-way communication

## ✅ Verification Checklist

- [ ] Meta app created
- [ ] WhatsApp product added
- [ ] Phone Number ID obtained
- [ ] Access Token generated (permanent for production)
- [ ] Environment variables added to `.env.local`
- [ ] Environment variables added to Vercel
- [ ] Test notification sent successfully
- [ ] Lead submission triggers notification

---

**Note:** WhatsApp Cloud API requires a Meta Business Account. For personal projects, consider using alternative services or WhatsApp Business API providers.

