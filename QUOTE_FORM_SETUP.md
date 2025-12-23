# Request a Quote Form - Setup & Testing Guide

## ✅ What Was Implemented

**Stack:** Next.js 14 (Pages Router)

**Features:**
- ✅ "Request a Quote" form on Home page
- ✅ Zod server-side validation
- ✅ Saves to Lead table with status NEW
- ✅ Success message + 10-second disable after submit
- ✅ Honeypot field for spam protection
- ✅ In-memory rate limiting (3 submissions per 15 minutes per IP)

## 📁 Files Created/Modified

### New Files:
1. **`src/components/QuoteForm.tsx`** - Quote form component
2. **`QUOTE_FORM_SETUP.md`** - This guide

### Modified Files:
- **`pages/index.tsx`** - Added QuoteForm component
- **`pages/api/leads/index.ts`** - Updated to handle both GET (admin) and POST (form)
- **`package.json`** - Added `zod` dependency

## 🚀 Installation

Install Zod:
```bash
npm install zod
```

## 🧪 How to Test Locally

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Form Submission
1. Navigate to `http://localhost:3000`
2. Scroll to the "Request a Quote" section (after pricing tiers)
3. Fill out the form:
   - Name: *Required*
   - Email: *Required* (must be valid email)
   - Phone: *Required*
   - Business Name: Optional
   - Budget Range: Optional
   - Project Details: Optional
4. Click "Submit Request"
5. **Expected:** Success message appears, form disables for 10 seconds

### 3. Test Validation
1. Try submitting with empty required fields
2. **Expected:** Error messages appear under fields
3. Try invalid email format
4. **Expected:** "Invalid email format" error

### 4. Test Honeypot (Spam Protection)
1. Open browser DevTools
2. Find the hidden "website" field
3. Set a value: `document.querySelector('[name="website"]').value = "spam"`
4. Submit form
5. **Expected:** Form appears to succeed but no lead is created (silent fail)

### 5. Test Rate Limiting
1. Submit the form 3 times quickly
2. **Expected:** First 3 succeed
3. Try 4th submission immediately
4. **Expected:** "Too many requests" error (429 status)
5. Wait 15 minutes or restart server to reset

### 6. Verify Database
```bash
npm run prisma:studio
```
- Open Prisma Studio
- Check "leads" table
- Verify new leads have status "NEW"

## 🌐 Testing on Vercel

### 1. Deploy to Vercel
```bash
vercel --prod
```

### 2. Test Form
1. Visit your production URL
2. Submit the form
3. Check Vercel function logs for any errors

### 3. Verify Rate Limiting Works
- Rate limiting is in-memory, so it resets on each serverless function cold start
- For production, consider using Redis or Vercel Edge Config for persistent rate limiting

## 📊 API Endpoint Details

### POST `/api/leads`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "business": "Acme Corp",
  "budget": "$10,000 - $20,000",
  "message": "I need a web application",
  "website": "" // Honeypot - must be empty
}
```

**Success Response (201):**
```json
{
  "message": "Lead created successfully",
  "id": "clx123..."
}
```

**Error Responses:**
- `400` - Validation failed
- `429` - Rate limit exceeded
- `500` - Server error

### GET `/api/leads` (Admin Only)

Requires authentication. Returns all leads.

## 🔒 Security Features

### ✅ Implemented

1. **Zod Validation:**
   - Server-side validation (required)
   - Email format validation
   - String length limits
   - Type checking

2. **Honeypot Field:**
   - Hidden "website" field
   - Bots that fill it are silently rejected
   - Real users won't see or fill it

3. **Rate Limiting:**
   - 3 submissions per 15 minutes per IP
   - In-memory storage (resets on server restart)
   - Returns 429 status when exceeded

4. **Input Sanitization:**
   - Zod validates and sanitizes input
   - Prevents injection attacks
   - Enforces data types

### 🔐 Security Recommendations

1. **Production Rate Limiting:**
   - Use Redis or Vercel Edge Config
   - Persists across serverless function restarts
   - Better for distributed systems

2. **CSRF Protection:**
   - Next.js has built-in CSRF protection
   - Ensure SameSite cookies are set

3. **Additional Spam Protection:**
   - Consider reCAPTCHA v3
   - Add time-based validation (form must take > 3 seconds)
   - Monitor for suspicious patterns

4. **Input Validation:**
   - Current: Basic validation
   - Consider: Phone number format validation
   - Consider: Email domain validation

## 📝 Prisma Usage

The form uses Prisma to create leads:

```typescript
const lead = await prisma.lead.create({
  data: {
    name: data.name,
    email: data.email,
    phone: data.phone,
    business: data.business || null,
    budget: data.budget || null,
    message: data.message || null,
    status: LeadStatus.NEW, // Always NEW for form submissions
  },
});
```

## 🐛 Troubleshooting

**Form not submitting:**
- Check browser console for errors
- Verify API route exists at `/api/leads`
- Check network tab for response

**"Validation failed" error:**
- Check all required fields are filled
- Verify email format is correct
- Check field length limits

**Rate limit not working:**
- In-memory rate limiting resets on server restart
- For production, use persistent storage (Redis)

**Leads not appearing in database:**
- Verify database connection
- Check Prisma migrations are run
- Check server logs for errors

## 📈 Next Steps

1. **Add Email Notifications:**
   - Send email when new lead is created
   - Use services like SendGrid, Resend, or AWS SES

2. **Admin Dashboard:**
   - View leads at `/admin/leads`
   - Update lead status
   - Add notes/comments

3. **Form Analytics:**
   - Track form submissions
   - Monitor conversion rates
   - A/B test form variations

4. **Enhanced Validation:**
   - Phone number format validation
   - Business name suggestions
   - Budget range dropdown

