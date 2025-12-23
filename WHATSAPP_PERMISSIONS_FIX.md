# WhatsApp Token & Permissions Fix

## Common Errors

- **Error Code 10**: Missing `whatsapp_business_messaging` permission
- **Error Code 190**: Token expired or invalid
- **Error Code 131047**: Message outside 24-hour window

## 🔴 Common Problems

### Problem 1: Error Code 10 - Missing Permissions
```
(#10) Application does not have permission for this action
```
Your access token doesn't have the required `whatsapp_business_messaging` permission.

### Problem 2: Error Code 190 - Token Expired
```
Error validating access token: Session has expired
```
Your temporary token has expired (they last 24 hours). You need a new token.

## ✅ Solutions

### Solution 1: Generate System User Token (Recommended - Never Expires)

### Step 1: Go to Meta Business Manager

1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Select your business account
3. Go to **Settings** → **Users** → **System Users**

### Step 2: Create or Select a System User

1. If you don't have a System User, click **Add** → **Create New System User**
   - Name: `WhatsApp API User`
   - Role: **Admin** (or **Employee** with messaging permissions)
2. If you already have one, select it

### Step 3: Generate Access Token

1. Click on your System User
2. Click **Generate New Token**
3. Select your **App** (the one with WhatsApp product)
4. Select **Permissions**:
   - ✅ `whatsapp_business_messaging` (REQUIRED)
   - ✅ `whatsapp_business_management` (optional, for managing templates)
5. Click **Generate Token**
6. **IMPORTANT:** Copy the token immediately - you won't be able to see it again!

### Step 4: Update Your Environment Variables

**Important:** After updating the token, restart your dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Solution 2: Generate Temporary Token (Quick Test - Expires in 24 Hours)

Add the new token to your `.env.local`:

```env
WHATSAPP_ACCESS_TOKEN=your_new_token_here
```

**Important:** 
- Remove any quotes around the token
- Don't add spaces
- The token should start with `EAA...`

### Step 5: Restart Your Dev Server

```bash
# Stop your server (Ctrl+C)
# Then restart
npm run dev
```

## 🔍 Token Expiration Guide

**Temporary Tokens:**
- ✅ Quick to generate
- ✅ Good for testing
- ❌ Expire after 24 hours
- ❌ Need to regenerate frequently

**System User Tokens:**
- ✅ Never expire (unless revoked)
- ✅ More secure
- ✅ Better for production
- ⚠️ Requires Business Manager access

**If your token expired:**
1. Check the error message for expiration time
2. Generate a new token (temporary or system user)
3. Update `.env.local`
4. Restart dev server

## 🧪 Verify Permissions

After updating your token, test it:

```bash
npm run test:whatsapp
```

You should see:
```
✅ Token is valid!
✅ WhatsApp API connection successful!
```

## 📋 Required Permissions Checklist

Your access token MUST have:
- ✅ `whatsapp_business_messaging` - **REQUIRED** for sending messages

Optional but recommended:
- ✅ `whatsapp_business_management` - For managing templates
- ✅ `business_management` - For managing business settings

## 🐛 Still Getting Error Code 10?

1. **Double-check token format:**
   - No quotes: `EAA...` not `"EAA..."`
   - No spaces
   - Full token copied (very long string)

2. **Verify app has WhatsApp product:**
   - Go to your app dashboard
   - Check if WhatsApp product is added
   - If not, add it: **Add Product** → **WhatsApp**

3. **Check token expiration:**
   - Temporary tokens expire in 24 hours
   - System User tokens don't expire (unless revoked)

4. **Verify Phone Number ID:**
   - Make sure `WHATSAPP_PHONE_NUMBER_ID` matches your WhatsApp Business number
   - Find it in: **WhatsApp** → **API Setup** → **Phone number ID**

## 🔐 Security Best Practices

1. **Never commit tokens to Git**
   - Always use `.env.local` (already in `.gitignore`)

2. **Use System User tokens for production**
   - They don't expire
   - More secure than temporary tokens

3. **Rotate tokens regularly**
   - Generate new tokens every 90 days
   - Revoke old tokens when creating new ones

## 📚 Additional Resources

- [WhatsApp Cloud API Setup](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [System User Tokens](https://developers.facebook.com/docs/marketing-api/system-users)
- [WhatsApp Permissions](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/permissions)

---

**Quick Fix Summary:**
1. Go to Meta Business Manager → System Users
2. Generate new token with `whatsapp_business_messaging` permission
3. Update `WHATSAPP_ACCESS_TOKEN` in `.env.local`
4. Restart dev server

