# WhatsApp Access Token Setup Guide

## 🔑 Getting Your Access Token

The error "Invalid OAuth access token - Cannot parse access token" means your access token is either:
- Not set correctly
- Expired (if using temporary token)
- Missing required permissions
- Incorrectly formatted

## 📋 Step-by-Step: Get Your Access Token

### Option 1: Temporary Token (For Testing)

1. **Go to Your Meta App Dashboard**
   - Visit [developers.facebook.com](https://developers.facebook.com)
   - Select your app

2. **Navigate to WhatsApp Product**
   - In the left sidebar, click **"WhatsApp"**
   - Go to **"API Setup"** tab

3. **Get Temporary Token**
   - Scroll to **"Temporary access token"** section
   - Click **"Generate token"** or copy the existing token
   - ⚠️ **Note:** This token expires in 24 hours

4. **Copy the Token**
   - It should look like: `EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - It's a long string (usually 200+ characters)

### Option 2: Permanent Token (For Production) - Recommended

1. **Create a System User**
   - Go to **Business Settings** → **Users** → **System Users**
   - Click **"Add"** → **"Create New System User"**
   - Name it (e.g., "LASTTE WhatsApp Bot")
   - Click **"Create System User"**

2. **Assign Assets**
   - Click **"Assign Assets"**
   - Select your app
   - Select permissions: **"WhatsApp Business Management"** and **"WhatsApp Business Messaging"**
   - Click **"Save Changes"**

3. **Generate Token**
   - Click on your System User
   - Click **"Generate New Token"**
   - Select your app
   - Select permissions: **`whatsapp_business_messaging`** and **`whatsapp_business_management`**
   - Choose token expiration (60 days recommended, or never expire for production)
   - Click **"Generate Token"**

4. **Copy the Token**
   - ⚠️ **IMPORTANT:** Copy it immediately - you won't see it again!
   - It should look like: `EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🔧 Setting Up Environment Variables

### Local Development (`.env.local`)

```env
# WhatsApp Cloud API Configuration
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_ADMIN_PHONE=+1234567890
```

**Important:**
- `WHATSAPP_PHONE_NUMBER_ID`: Found in WhatsApp → API Setup (looks like: `123456789012345`)
- `WHATSAPP_ACCESS_TOKEN`: The token you just generated (long string starting with `EAA`)
- `WHATSAPP_ADMIN_PHONE`: Your phone number with country code (e.g., `+1234567890`)

### Vercel Production

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add each variable:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_ADMIN_PHONE`
4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**

## ✅ Verify Your Token

### Check Token Format

Your token should:
- Start with `EAA` (for most tokens)
- Be 200+ characters long
- Not have any spaces or line breaks
- Be a single continuous string

### Test Your Token

You can test if your token works by making a simple API call:

```bash
curl -X GET "https://graph.facebook.com/v21.0/me?access_token=YOUR_TOKEN_HERE"
```

If it returns your app info, the token is valid.

## 🐛 Common Issues

### Error: "Invalid OAuth access token - Cannot parse access token"

**Causes:**
1. Token not set in environment variables
2. Token has expired (temporary tokens expire in 24 hours)
3. Token has spaces or line breaks
4. Token is missing required permissions

**Solutions:**
1. Check `.env.local` file exists and has the token
2. Regenerate token if it's expired
3. Remove any spaces/line breaks from token
4. Ensure token has `whatsapp_business_messaging` permission

### Error: "Token format is wrong"

**Solution:**
- Make sure token is on a single line
- No quotes around the token in `.env.local`
- No spaces before or after the token

### Token Works Locally But Not on Vercel

**Solution:**
- Make sure you added the token to Vercel environment variables
- Redeploy your app after adding variables
- Check that variables are set for the correct environment

## 🔄 Token Refresh

### Temporary Tokens
- Expire after 24 hours
- Need to be regenerated daily
- Good for testing only

### Permanent Tokens
- Can be set to never expire
- Best for production
- Can be revoked and regenerated if needed

## 📝 Quick Checklist

- [ ] Meta app created
- [ ] WhatsApp product added to app
- [ ] System User created (for permanent token)
- [ ] Token generated with correct permissions
- [ ] Token copied (saved securely)
- [ ] Token added to `.env.local`
- [ ] Token added to Vercel environment variables
- [ ] Phone Number ID obtained
- [ ] Admin phone number set
- [ ] Test notification sent successfully

## 🔒 Security Reminders

1. **Never commit tokens to Git**
   - `.env.local` should be in `.gitignore`
   - Never push tokens to GitHub

2. **Rotate tokens regularly**
   - Change tokens every 60-90 days
   - Revoke old tokens when creating new ones

3. **Use different tokens for different environments**
   - Development token
   - Production token
   - Never mix them

## 🆘 Still Having Issues?

If you're still getting the error:

1. **Double-check your token:**
   ```bash
   # In your terminal, check if token is set
   echo $WHATSAPP_ACCESS_TOKEN
   ```

2. **Verify token in code:**
   - Add a temporary log to see if token is being read
   - Check for any whitespace or formatting issues

3. **Test with curl:**
   ```bash
   curl -X GET "https://graph.facebook.com/v21.0/me?access_token=YOUR_TOKEN"
   ```

4. **Check Meta App Dashboard:**
   - Verify token hasn't expired
   - Check token permissions
   - Regenerate if needed

---

**Need Help?** Check the [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api) or Meta's support.

