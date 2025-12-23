# Vercel Blob Image Upload Setup

This guide will help you set up Vercel Blob storage for uploading team member images.

## 📋 Prerequisites

- Vercel account
- Project deployed on Vercel (or local development)

## 🔧 Setup Steps

### 1. Install Dependencies

The required packages are already installed:
- `@vercel/blob` - Vercel Blob storage client
- `formidable` - File upload handling
- `@types/formidable` - TypeScript types

### 2. Get Your Blob Storage Token

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to **Settings** → **Storage**
4. Click **Create Database** or **Create Store** → Select **Blob**
5. After creating, you'll see a **BLOB_READ_WRITE_TOKEN**
6. Copy this token

### 3. Add Environment Variable

#### For Local Development:

Add to your `.env.local` file:
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### For Vercel Production:

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your blob token (from step 2)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**

### 4. Restart Your Development Server

After adding the environment variable:
```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

## 🎯 Usage

### Uploading Team Member Images

1. Go to `/admin/team-members/new` or edit an existing team member
2. In the **Profile Picture** section:
   - Click **Upload Image** button
   - Select an image file (JPEG, PNG, WebP, or GIF)
   - Maximum file size: 5MB
   - The image will be uploaded to Vercel Blob automatically
   - You'll see a preview of the uploaded image

### Alternative: Using Image URL

You can still paste a direct image URL if you prefer:
- Paste the URL in the "Or enter image URL" field
- This is useful for images already hosted elsewhere

## 📁 File Structure

- **Upload API**: `pages/api/upload/team-member-image.ts`
- **Team Member Form**: `pages/admin/team-members/[id].tsx`

## 🔒 Security

- ✅ Admin-only access (requires authentication)
- ✅ File type validation (images only)
- ✅ File size limit (5MB)
- ✅ Secure token-based authentication

## 🐛 Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not configured"

**Solution**: Make sure you've added the token to your environment variables and restarted your dev server.

### Error: "Invalid file type"

**Solution**: Only image files are allowed (JPEG, PNG, WebP, GIF).

### Error: "File size exceeds 5MB limit"

**Solution**: Compress your image or use a smaller file. You can use online tools like [TinyPNG](https://tinypng.com/) to compress images.

### Upload fails silently

**Solution**: 
1. Check browser console for errors
2. Check server logs
3. Verify `BLOB_READ_WRITE_TOKEN` is set correctly
4. Ensure you're logged in as an admin

## 📝 Notes

- Images are stored in the `team-members/` folder in your Vercel Blob storage
- Uploaded images are publicly accessible
- The upload happens immediately when you select a file
- You can replace an image by uploading a new one

## 🚀 Next Steps

After setup, you can:
- Upload images for all team members
- Images will automatically appear on the `/about` page
- No need to host images elsewhere!

