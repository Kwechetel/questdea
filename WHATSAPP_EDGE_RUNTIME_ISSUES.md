# Why Edge Runtime Fails with UTF-8 Emoji Payloads

## Executive Summary
The Edge runtime in Next.js uses V8 isolates (WebAssembly/Web APIs) that have **critical limitations** when processing multi-byte UTF-8 characters like emojis from WhatsApp webhooks. This can cause **silent data loss** where emojis are dropped or corrupted without any error messages.

---

## Critical Edge Runtime Limitations

### 1. **Limited Buffer Support** ⚠️ CRITICAL
**Issue**: Edge runtime has incomplete or missing `Buffer` API support
- Edge runtime uses Web APIs, not Node.js APIs
- `Buffer` operations may not work correctly with multi-byte UTF-8
- Emojis are multi-byte characters (4 bytes for most emojis)
- Edge runtime may truncate or corrupt these bytes

**Example Failure**:
```javascript
// In Edge runtime - may fail silently
const text = "Hello 😊"; // 4-byte emoji
Buffer.from(text, 'utf8'); // May return corrupted buffer
```

### 2. **Incomplete Crypto Support** ⚠️ CRITICAL
**Issue**: Edge runtime's `crypto` API differs from Node.js
- Web Crypto API vs Node.js crypto module
- Signature verification may fail with UTF-8 payloads
- HMAC operations may not handle multi-byte characters correctly
- This can cause webhook signature verification to fail silently

**Example Failure**:
```javascript
// Edge runtime crypto - may miscalculate hash
crypto.createHmac('sha256', secret)
  .update(emojiPayload) // Multi-byte UTF-8
  .digest('hex'); // May produce incorrect hash
```

### 3. **String Encoding Assumptions** ⚠️ HIGH
**Issue**: Edge runtime may assume different default encoding
- V8 isolates may use different string internals
- UTF-8 encoding may not be guaranteed
- String operations may corrupt multi-byte characters
- No explicit encoding control in Edge runtime

**Example Failure**:
```javascript
// Edge runtime - encoding may be lost
const body = await request.json(); // May lose UTF-8 encoding
const text = body.text.body; // Emojis may be corrupted here
```

### 4. **Prisma Client Incompatibility** ⚠️ CRITICAL
**Issue**: Prisma Client requires Node.js runtime
- Prisma uses native binaries that don't work in Edge
- Database operations will fail in Edge runtime
- No fallback or error message - just silent failure

**Example Failure**:
```javascript
// Edge runtime - Prisma won't work
await prisma.whatsAppMessage.create({...}); // Silent failure
```

### 5. **Request Body Parsing Differences** ⚠️ MEDIUM
**Issue**: Edge runtime uses different body parsing
- Web Streams API vs Node.js streams
- UTF-8 decoding may differ
- Multi-byte character boundaries may be mishandled
- No control over encoding during parsing

**Example Failure**:
```javascript
// Edge runtime - body parsing may corrupt UTF-8
const data = await request.json(); // Emojis lost here
```

---

## Why Silent Failures Occur

### 1. **No Error Throwing**
Edge runtime doesn't throw errors for encoding issues - it just:
- Truncates multi-byte characters
- Replaces with replacement characters ()
- Returns corrupted strings
- Continues execution as if nothing happened

### 2. **Type Coercion Hides Issues**
JavaScript's type system hides encoding problems:
```javascript
// Edge runtime - looks fine but emojis are corrupted
const text = "Hello 😊"; // Actually: "Hello"
text.length; // Still returns correct length
text.includes("😊"); // Returns false but no error
```

### 3. **JSON Parsing Appears Successful**
Edge runtime's JSON parsing may succeed but corrupt data:
```javascript
// Edge runtime - JSON.parse succeeds but data is corrupted
const data = await request.json(); // No error
data.text.body; // "Hello" instead of "Hello 😊"
```

---

## WhatsApp Webhook Specific Issues

### 1. **Webhook Signature Verification**
- Edge runtime's crypto may miscalculate HMAC for UTF-8 payloads
- Signature verification fails → webhook rejected
- No retry mechanism → message lost forever

### 2. **Database Save Failures**
- Prisma doesn't work in Edge runtime
- Messages never saved → data loss
- No error logged → silent failure

### 3. **Text Extraction**
- Multi-byte emojis corrupted during extraction
- Saved to database as replacement characters
- No way to recover original emoji data

---

## Solution: Explicit Node.js Runtime

### Required Configuration
```typescript
// app/api/webhooks/whatsapp/route.ts
export const runtime = "nodejs"; // CRITICAL: Explicit Node.js runtime
export const maxDuration = 30; // 30 seconds max
```

### Why Node.js Runtime Works

1. **Full Buffer Support**
   - Native Node.js Buffer API
   - Proper UTF-8 encoding/decoding
   - Multi-byte character handling

2. **Complete Crypto Support**
   - Node.js crypto module
   - Correct HMAC for UTF-8
   - Reliable signature verification

3. **Prisma Compatibility**
   - Native binary support
   - Full database operations
   - Proper error handling

4. **Consistent Encoding**
   - UTF-8 guaranteed
   - No encoding assumptions
   - Explicit control over encoding

---

## Testing Edge vs Node.js Runtime

### Test Case: Emoji Payload
```json
{
  "text": {
    "body": "Hello 😊👍🎉"
  }
}
```

### Edge Runtime Result
- ❌ Emojis corrupted: "Hello "
- ❌ No error thrown
- ❌ Signature verification may fail
- ❌ Database save fails (Prisma)

### Node.js Runtime Result
- ✅ Emojis preserved: "Hello 😊👍🎉"
- ✅ UTF-8 encoding verified
- ✅ Signature verification succeeds
- ✅ Database save succeeds

---

## Best Practices

1. **Always use Node.js runtime for webhooks**
   - Especially with UTF-8 payloads
   - Required for Prisma/database operations
   - Needed for reliable crypto operations

2. **Explicit runtime declaration**
   ```typescript
   export const runtime = "nodejs";
   ```

3. **Verify UTF-8 encoding**
   ```typescript
   const buffer = Buffer.from(text, 'utf8');
   const verified = buffer.toString('utf8') === text;
   ```

4. **Test with emoji payloads**
   - Send test messages with emojis
   - Verify they're preserved end-to-end
   - Check database records

---

## Conclusion

Edge runtime is **not suitable** for WhatsApp webhooks because:
- ❌ Incomplete UTF-8 support
- ❌ Prisma incompatibility
- ❌ Crypto limitations
- ❌ Silent failures with emojis

**Always use Node.js runtime** for webhook handlers that process:
- Multi-byte UTF-8 characters (emojis)
- Database operations (Prisma)
- Cryptographic operations (signature verification)
- Complex text processing

