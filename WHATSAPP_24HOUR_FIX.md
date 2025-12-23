# WhatsApp 24-Hour Window Fix

## 🔴 The Problem

Your WhatsApp notifications are being sent successfully (you see `✅ WhatsApp notification sent successfully` in logs), but you're not receiving them. This is due to **WhatsApp's 24-hour messaging window restriction**.

## 📋 What is the 24-Hour Window?

WhatsApp Business API has strict rules:

1. **Free-form text messages** can only be sent to users who have messaged your business number in the **last 24 hours**
2. **Template messages** can be sent anytime, but must be pre-approved by Meta

## ✅ Solution Options

### Option 1: Message Your Business Number First (Quick Fix)

1. Open WhatsApp on your phone (`+263713147736`)
2. Send a message to your business WhatsApp number: **+263 77 359 9291**
3. This opens a 24-hour window
4. Now notifications will work for the next 24 hours
5. You'll need to message again after 24 hours to keep it active

**Note:** This is a temporary solution for testing. For production, use Option 2.

### Option 2: Use Template Messages (Production Solution)

Template messages can be sent anytime, but require:
1. Creating a message template in Meta Business Manager
2. Getting it approved by Meta (usually takes 24-48 hours)
3. Using the template name in your code

#### Steps to Create a Template:

1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Navigate to **WhatsApp** → **Message Templates**
3. Click **Create Template**
4. Choose **Transactional** (for notifications)
5. Fill in:
   - **Name:** `new_lead_notification` (no spaces, lowercase)
   - **Category:** Utility
   - **Language:** English
   - **Body:** 
     ```
     🆕 New Lead Received

     Name: {{1}}
     Email: {{2}}
     Phone: {{3}}
     {{4}}

     View in dashboard: {{5}}
     ```
6. Submit for approval
7. Once approved, update your code to use `sendWhatsAppTemplate()` instead of `sendWhatsAppMessage()`

### Option 3: Use WhatsApp Business App (Alternative)

If you don't want to deal with templates, you could:
1. Use the regular WhatsApp Business app
2. Set up automated replies
3. Use a service like Twilio WhatsApp API (paid)

## 🧪 Testing

After messaging your business number:

1. Submit a test lead through `/contact`
2. Check your WhatsApp
3. You should receive the notification within seconds

## 📝 Current Status

- ✅ WhatsApp API is configured correctly
- ✅ Messages are being sent successfully
- ❌ Messages are blocked by 24-hour window restriction
- ✅ Solution: Message business number first OR use templates

## 🔧 Code Changes Needed for Templates

If you want to use template messages, you'll need to:

1. Create and approve a template in Meta Business Manager
2. Update `pages/api/leads/index.ts` to use `sendWhatsAppTemplate()` instead of `sendWhatsAppMessage()`

Example:
```typescript
// Instead of:
sendWhatsAppMessage(adminPhoneNumber, formatLeadNotification(lead))

// Use:
sendWhatsAppTemplate(
  adminPhoneNumber,
  "new_lead_notification", // Your approved template name
  "en",
  [
    lead.name,
    lead.email,
    lead.phone || "N/A",
    lead.business || "N/A",
    `${process.env.NEXTAUTH_URL}/admin/leads`
  ]
)
```

## 🚀 Recommended Approach

For **development/testing**: Use Option 1 (message business number first)

For **production**: Use Option 2 (template messages) - more reliable and doesn't require manual messaging

---

**Your Business WhatsApp Number:** +263 77 359 9291  
**Your Admin Phone:** +263713147736

Send a test message from your admin phone to the business number to open the 24-hour window!

