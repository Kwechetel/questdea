# WhatsApp System User Token Setup Guide

## 🎯 Why System User Tokens?

- ✅ **Never expire** (unless manually revoked)
- ✅ **More secure** than temporary tokens
- ✅ **Production-ready** - no need to regenerate every 24 hours
- ✅ **Better for automation** - reliable for long-term use

## 📋 Step-by-Step Setup

### Step 1: Access Meta Business Manager

1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Log in with your Facebook account
3. Select your **Business Account** (or create one if needed)

### Step 2: Navigate to System Users

1. Click **Settings** (gear icon) in the left sidebar
2. Click **Users** in the left menu
3. Click **System Users** tab

### Step 3: Create a System User

1. Click **Add** button (top right)
2. Select **Create New System User**
3. Fill in:
   - **Name:** `WhatsApp API User` (or any name you prefer)
   - **Role:** Select **Admin** (or **Employee** if you want limited access)
4. Click **Create System User**

### Step 4: Generate Access Token

1. Find your newly created System User in the list
2. Click on the **System User** name
3. Click **Generate New Token** button
4. Select your **App**:
   - Choose "Last Kwechete" (or your app name)
   - Make sure it's the app with WhatsApp product enabled
5. Select **Permissions**:
   - ✅ **`whatsapp_business_messaging`** (REQUIRED - for sending messages)
   - ✅ **`whatsapp_business_management`** (Optional - for managing templates)
6. Click **Generate Token**
7. **⚠️ IMPORTANT:** Copy the token immediately - you won't be able to see it again!
   - The token will look like: `EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx...`
   - It's very long (200+ characters)

### Step 5: Update Your Environment Variables

1. Open your `.env.local` file
2. Find the line: `WHATSAPP_ACCESS_TOKEN=...`
3. Replace it with your new System User token:
   ```env
   WHATSAPP_ACCESS_TOKEN=your_system_user_token_here
   ```
4. **Important:**
   - No quotes around the token
   - No spaces before or after
   - Just: `WHATSAPP_ACCESS_TOKEN=EAA...`
5. Save the file (Ctrl+S)

### Step 6: Verify the Token

Run the check command:

```bash
npm run check:token
```

You should see:
```
✅ Token is VALID!
🎉 Your token is working correctly!
```

### Step 7: Test Sending Messages

```bash
npm run test:whatsapp-send
```

You should see:
```
✅ Message sent successfully!
```

## 🔐 Security Best Practices

1. **Never share your token:**
   - Don't commit it to Git
   - Don't share it in screenshots
   - Keep it in `.env.local` only (already in `.gitignore`)

2. **Rotate tokens periodically:**
   - Generate new tokens every 90 days
   - Revoke old tokens when creating new ones
   - Update `.env.local` with the new token

3. **Use separate tokens for different environments:**
   - Development: One token
   - Production: Different token
   - Staging: Another token

4. **Limit permissions:**
   - Only grant `whatsapp_business_messaging` if you only need to send messages
   - Add `whatsapp_business_management` only if you need to manage templates

## 🚀 For Vercel Production

When deploying to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key:** `WHATSAPP_ACCESS_TOKEN`
   - **Value:** Your System User token
   - **Environments:** Production, Preview, Development
4. Click **Save**
5. Redeploy your application

## 🔄 Token Management

### Viewing Active Tokens

1. Go to Meta Business Manager
2. Settings → Users → System Users
3. Click on your System User
4. You'll see a list of active tokens (but not the actual token values)

### Revoking a Token

1. Go to System Users
2. Click on your System User
3. Find the token you want to revoke
4. Click **Revoke** or **Delete**
5. Update `.env.local` with a new token

### Regenerating a Token

1. Follow Step 4 above (Generate Access Token)
2. The old token will remain valid until you revoke it
3. You can have multiple active tokens

## 🐛 Troubleshooting

### Error: "Permission denied" (Code 10)

- Make sure you selected `whatsapp_business_messaging` permission
- Regenerate the token with the correct permissions

### Error: "Invalid token" (Code 190)

- Check if you copied the full token (should be 200+ characters)
- Make sure there are no extra spaces or quotes in `.env.local`
- Verify the token hasn't been revoked in Business Manager

### Token Not Working After Update

1. Make sure you saved `.env.local`
2. Restart your dev server
3. Run `npm run check:token` to verify

## 📊 Token Comparison

| Feature | Temporary Token | System User Token |
|---------|-----------------|-------------------|
| Expiration | 24 hours | Never (unless revoked) |
| Setup Time | 1 minute | 5 minutes |
| Production Ready | ❌ No | ✅ Yes |
| Security | Medium | High |
| Best For | Testing | Production |

## ✅ Checklist

- [ ] Created System User in Meta Business Manager
- [ ] Generated token with `whatsapp_business_messaging` permission
- [ ] Copied token (full 200+ character string)
- [ ] Updated `WHATSAPP_ACCESS_TOKEN` in `.env.local`
- [ ] Saved `.env.local` file
- [ ] Verified token with `npm run check:token`
- [ ] Tested sending with `npm run test:whatsapp-send`
- [ ] Added token to Vercel environment variables (for production)

## 🎉 You're All Set!

Once you've completed these steps, your WhatsApp notifications will work reliably in production without needing to regenerate tokens every 24 hours.

---

**Quick Links:**
- [Meta Business Manager](https://business.facebook.com/)
- [System Users Documentation](https://developers.facebook.com/docs/marketing-api/system-users)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)

