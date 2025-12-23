# WhatsApp Webhook Emoji Audit Report

## Executive Summary
The webhook handler has several potential points where emoji payloads could be dropped or corrupted. This audit identifies 6 critical issues and provides fixes.

---

## Critical Issues Identified

### 1. **Body Parsing & UTF-8 Encoding** ⚠️ CRITICAL
**Location**: Line 63 - Signature verification
**Issue**: 
- `JSON.stringify(req.body)` is used for signature verification AFTER Next.js has already parsed the body
- If Next.js parsed the body with incorrect encoding, emojis may already be lost
- The raw body buffer is not preserved for signature verification

**Impact**: 
- Emojis could be lost during Next.js body parsing if Content-Type headers are incorrect
- Signature verification uses a potentially corrupted body string

**Fix Required**: 
- Access raw body BEFORE Next.js parsing
- Preserve UTF-8 encoding explicitly
- Verify signature against raw body, not parsed JSON

---

### 2. **No Explicit Body Parser Configuration** ⚠️ HIGH
**Location**: Missing API route config
**Issue**:
- No `export const config` to disable body parsing
- Next.js default body parser may not handle UTF-8 correctly for large payloads
- No explicit size limits configured

**Impact**:
- Body parser may truncate or corrupt payloads with emojis
- Default 1MB limit might be exceeded with emoji-rich messages
- No control over how body is parsed

**Fix Required**:
- Add explicit API route configuration
- Configure body parser with UTF-8 support
- Set appropriate size limits

---

### 3. **Early 200 OK Response** ⚠️ MEDIUM
**Location**: Line 96
**Issue**:
- Returns 200 OK immediately after starting async processing
- If processing fails silently, errors are masked
- WhatsApp won't retry if 200 is returned

**Impact**:
- Processing errors (including emoji loss) are not reported to WhatsApp
- No retry mechanism if emojis are lost during processing
- Errors are logged but webhook appears successful

**Fix Required**:
- Process messages BEFORE returning 200 OK
- Only return 200 after successful processing
- Return 500 if processing fails (WhatsApp will retry)

---

### 4. **No Raw Body Access** ⚠️ CRITICAL
**Location**: Entire handler
**Issue**:
- Handler only accesses `req.body` (already parsed by Next.js)
- No access to raw request body buffer
- Cannot verify original UTF-8 encoding

**Impact**:
- Cannot verify if emojis were received correctly
- Cannot debug encoding issues
- Signature verification uses potentially corrupted data

**Fix Required**:
- Access raw body buffer before parsing
- Log raw body hex to verify UTF-8 encoding
- Use raw body for signature verification

---

### 5. **JSON.stringify Encoding Assumptions** ⚠️ MEDIUM
**Location**: Line 63, 127
**Issue**:
- `JSON.stringify()` assumes UTF-8 but doesn't guarantee it
- No explicit encoding specification
- Could lose emojis if system default encoding is different

**Impact**:
- Emojis might be corrupted during string conversion
- Signature verification might fail due to encoding mismatch
- Logging might show corrupted emojis

**Fix Required**:
- Use explicit UTF-8 encoding
- Verify string encoding before processing
- Use Buffer operations for encoding verification

---

### 6. **No Request Size Limits** ⚠️ LOW
**Location**: Missing config
**Issue**:
- No explicit body size limit configuration
- Default Next.js limits might truncate large payloads
- Emoji-rich messages might exceed limits

**Impact**:
- Large messages with emojis might be truncated
- No error if truncation occurs
- Silent data loss

**Fix Required**:
- Configure appropriate body size limits
- Handle payload size errors explicitly
- Log warnings for large payloads

---

## Recommended Fixes

### Fix 1: Add API Route Configuration
```typescript
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    responseLimit: false,
  },
};
```

### Fix 2: Access Raw Body for Signature Verification
```typescript
// Need to disable body parser to access raw body
export const config = {
  api: {
    bodyParser: false, // Disable to access raw body
  },
};

// Then manually parse with UTF-8
const rawBody = await getRawBody(req);
const bodyString = rawBody.toString('utf8');
const body = JSON.parse(bodyString);
```

### Fix 3: Process Before Returning 200
```typescript
// Process all messages FIRST
await Promise.all(/* process messages */);

// Only return 200 after successful processing
return res.status(200).send("OK");
```

### Fix 4: Explicit UTF-8 Handling
```typescript
// Ensure UTF-8 encoding throughout
const text = Buffer.from(message.text?.body || '', 'utf8').toString('utf8');
```

---

## Testing Recommendations

1. **Send test message with emojis** and check:
   - Server logs for raw body hex encoding
   - Signature verification success
   - Database record contains emojis
   - API response contains emojis

2. **Monitor for**:
   - Body parsing errors
   - Signature verification failures
   - Encoding warnings
   - Truncated payloads

---

## Priority Fix Order

1. **CRITICAL**: Fix raw body access and UTF-8 handling
2. **HIGH**: Add API route configuration
3. **MEDIUM**: Fix early 200 OK response
4. **LOW**: Add request size limits

