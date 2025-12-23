import { NextRequest, NextResponse } from "next/server";

/**
 * MINIMAL TEST WEBHOOK
 * 
 * Purpose: Test if WhatsApp messages (including emojis) reach the webhook route
 * 
 * This handler:
 * - Returns 200 OK immediately
 * - Logs that it was hit
 * - Logs request headers and basic info
 * - NO parsing, NO database logic, NO processing
 * 
 * Use this to verify:
 * 1. Webhook is being called by WhatsApp
 * 2. Messages with emojis are reaching the route
 * 3. Request is arriving at all
 * 
 * Once confirmed, you can investigate parsing/processing issues.
 */

// CRITICAL: Use Node.js runtime
export const runtime = "nodejs";

// Handle GET request (webhook verification by Meta)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log("🔍 [TEST WEBHOOK] GET request received");
  console.log("Mode:", mode);
  console.log("Token:", token ? "PRESENT" : "MISSING");
  console.log("Challenge:", challenge);

  const webhookToken = process.env.WHATSAPP_WEBHOOK_TOKEN;

  if (!webhookToken) {
    console.error("❌ [TEST WEBHOOK] WHATSAPP_WEBHOOK_TOKEN is not set");
    return NextResponse.json(
      { error: "Webhook token not configured" },
      { status: 500 }
    );
  }

  // Verify token matches your secret
  if (mode === "subscribe" && token === webhookToken) {
    console.log("✅ [TEST WEBHOOK] Webhook verified successfully");
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error("❌ [TEST WEBHOOK] Webhook verification failed");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

// Handle POST request (incoming messages)
export async function POST(request: NextRequest) {
  // Log that webhook was hit
  const timestamp = new Date().toISOString();
  console.log("=".repeat(80));
  console.log(`🔔 [TEST WEBHOOK] POST request received at ${timestamp}`);
  console.log("=".repeat(80));

  // Log request headers (for debugging)
  console.log("📋 Request Headers:");
  console.log("  Content-Type:", request.headers.get("content-type"));
  console.log("  Content-Length:", request.headers.get("content-length"));
  console.log("  User-Agent:", request.headers.get("user-agent"));
  console.log("  X-Hub-Signature-256:", request.headers.get("x-hub-signature-256") ? "PRESENT" : "MISSING");

  // Log request URL
  console.log("📋 Request URL:", request.url);

  // Try to get raw body size (without parsing)
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    console.log("📋 Body size:", contentLength, "bytes");
  }

  // Log that we're returning 200 OK immediately
  console.log("✅ [TEST WEBHOOK] Returning 200 OK immediately");
  console.log("=".repeat(80));

  // Return 200 OK immediately - no processing
  return NextResponse.json(
    { 
      status: "ok",
      message: "Test webhook received",
      timestamp 
    },
    { status: 200 }
  );
}

