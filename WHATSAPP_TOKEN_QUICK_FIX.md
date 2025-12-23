# WhatsApp Token Quick Fix Guide

## 🔴 Current Issue: Token Expired (Error Code 190)

Your token expired at: **Monday, 22-Dec-25 10:00:00 PST**

## ✅ Step-by-Step Fix

### Option 1: Temporary Token (Quick - Expires in 24 hours)

1. **Go to:** https://developers.facebook.com/
2. **Click:** "My Apps" → Select your app ("Last Kwechete")
3. **Navigate:** WhatsApp → API Setup
4. **Find:** "Temporary access token" section
5. **Click:** "Generate Token" button
6. **Copy** the token (starts with `EAA...`)
7. **Open:** `.env.local` file
8. **Update:** 
   ```env
   WHATSAPP_ACCESS_TOKEN=your_new_token_here
   ```
   (Replace `your_new_token_here` with the actual token, no quotes)
9. **Save** the file
10. **Restart** your dev server:
    ```bash
    # Press Ctrl+C to stop
    npm run dev
    ```
11. **Test:**
    ```bash
    npm run test:whatsapp-send
    ```

### Option 2: System User Token (Recommended - Never Expires)

1. **Go to:** https://business.facebook.com/
2. **Navigate:** Settings → Users → System Users
3. **Create System User** (if you don't have one):
   - Click "Add" → "Create New System User"
   - Name: `WhatsApp API User`
   - Role: Admin
4. **Select** the System User
5. **Click:** "Generate New Token"
6. **Select:**
   - Your App: "Last Kwechete" (or your app name)
   - Permissions: ✅ `whatsapp_business_messaging` (REQUIRED)
7. **Click:** "Generate Token"
8. **IMPORTANT:** Copy the token immediately (you won't see it again!)
9. **Update:** `.env.local` file with the new token
10. **Restart** dev server
11. **Test:** `npm run test:whatsapp-send`

## 🧪 Verify It Works

After updating the token, run:

```bash
npm run test:whatsapp-send
```

**Success looks like:**
```
✅ Message sent successfully!
   Message ID: wamid.xxxxx
📱 Check your WhatsApp for the notification.
```

**If you still see errors:**
- Make sure you copied the FULL token (very long string)
- No quotes around the token in `.env.local`
- No spaces before/after the token
- Restarted the dev server after updating

## 📝 Token Format Checklist

✅ Token starts with `EAA...`  
✅ Token is 200+ characters long  
✅ No quotes: `EAA...` not `"EAA..."`  
✅ No spaces before or after  
✅ Updated in `.env.local` file  
✅ Dev server restarted after update  

## 🔄 Token Expiration

- **Temporary tokens:** Expire after 24 hours
- **System User tokens:** Never expire (unless revoked)

For production, always use System User tokens!

---

**Quick Links:**
- [Meta Developers](https://developers.facebook.com/)
- [Meta Business Manager](https://business.facebook.com/)
- [WhatsApp API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)

