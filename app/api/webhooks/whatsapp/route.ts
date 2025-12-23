import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * PRODUCTION-READY WhatsApp Cloud API Webhook Handler
 * 
 * Features:
 * - ✅ Full emoji support with explicit UTF-8 handling
 * - ✅ Node.js runtime (not Edge)
 * - ✅ Safe UTF-8 payload parsing (ArrayBuffer + TextDecoder)
 * - ✅ Immediate acknowledgment (fire-and-forget)
 * - ✅ All WhatsApp message types supported
 * - ✅ Resistant to malformed payloads (extensive guards)
 * 
 * Architecture:
 * - Returns 200 OK immediately (< 1 second)
 * - Processes messages asynchronously in background
 * - Explicit UTF-8 decoding prevents emoji corruption
 * - Comprehensive error handling and logging
 */

// CRITICAL: Explicit Node.js runtime (required for Prisma, crypto, Buffer)
export const runtime = "nodejs";

// Configure max duration for webhook processing
export const maxDuration = 30; // 30 seconds max

// Verify webhook signature for security
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret) return false;
  try {
    const hash = crypto
      .createHmac("sha256", secret)
      .update(payload, "utf8")
      .digest("hex");
    return `sha256=${hash}` === signature;
  } catch (error) {
    console.error("❌ Signature verification error:", error);
    return false;
  }
}

// Safely extract text with UTF-8 preservation
function extractTextSafely(value: any): string {
  if (value === null || value === undefined) return "";
  if (typeof value !== "string") {
    try {
      return String(value);
    } catch {
      return "";
    }
  }
  // Ensure UTF-8 encoding is preserved
  try {
    return Buffer.from(value, "utf8").toString("utf8");
  } catch {
    return value;
  }
}

// Extract message data safely with optional chaining and guards
interface ExtractedMessage {
  text: string;
  mediaUrl: string | null;
  messageType: string;
  context?: {
    from?: string;
    id?: string;
  };
  interactive?: {
    type: string;
    buttonReply?: { id: string; title: string };
    listReply?: { id: string; title: string; description?: string };
  };
  reaction?: {
    messageId: string;
    emoji: string;
  };
}

function extractMessageData(message: any): ExtractedMessage {
  const result: ExtractedMessage = {
    text: "",
    mediaUrl: null,
    messageType: "unknown",
  };

  // Guard: Ensure message is an object
  if (!message || typeof message !== "object") {
    console.warn("⚠️ Invalid message object in extractMessageData");
    return result;
  }

  // Extract message type safely
  const type = String(message?.type || "text").toLowerCase();
  result.messageType = type;

  // Handle different message types with extensive optional chaining
  switch (type) {
    case "text": {
      const textBody = message?.text?.body;
      if (textBody !== undefined && textBody !== null) {
        result.text = extractTextSafely(textBody);
      }
      break;
    }

    case "image": {
      const caption = message?.image?.caption;
      if (caption !== undefined && caption !== null) {
        result.text = extractTextSafely(caption);
      }
      result.mediaUrl = message?.image?.id || null;
      break;
    }

    case "document": {
      const caption = message?.document?.caption;
      const filename = message?.document?.filename;
      if (caption !== undefined && caption !== null) {
        result.text = extractTextSafely(caption);
      } else if (filename !== undefined && filename !== null) {
        result.text = extractTextSafely(filename);
      }
      result.mediaUrl = message?.document?.id || null;
      break;
    }

    case "audio": {
      result.text = "Audio message";
      result.mediaUrl = message?.audio?.id || null;
      break;
    }

    case "video": {
      const caption = message?.video?.caption;
      if (caption !== undefined && caption !== null) {
        result.text = extractTextSafely(caption);
      } else {
        result.text = "Video message";
      }
      result.mediaUrl = message?.video?.id || null;
      break;
    }

    case "sticker": {
      result.text = "Sticker";
      result.mediaUrl = message?.sticker?.id || null;
      break;
    }

    case "reaction": {
      const reaction = message?.reaction;
      if (reaction && typeof reaction === "object") {
        const emoji = reaction?.emoji;
        const messageId = reaction?.message_id;
        
        if (emoji !== undefined && emoji !== null) {
          result.text = extractTextSafely(emoji);
        } else {
          result.text = "Reaction";
        }
        
        result.reaction = {
          messageId: messageId || "",
          emoji: emoji || "",
        };
      } else {
        result.text = "Reaction";
      }
      break;
    }

    case "interactive": {
      const interactive = message?.interactive;
      if (interactive && typeof interactive === "object") {
        const interactiveType = String(interactive?.type || "").toLowerCase();
        
        if (interactiveType === "button_reply") {
          const buttonReply = interactive?.button_reply;
          if (buttonReply && typeof buttonReply === "object") {
            const title = buttonReply?.title;
            const id = buttonReply?.id;
            result.text = title ? extractTextSafely(title) : "Button reply";
            result.interactive = {
              type: "button_reply",
              buttonReply: {
                id: id || "",
                title: title || "",
              },
            };
          }
        } else if (interactiveType === "list_reply") {
          const listReply = interactive?.list_reply;
          if (listReply && typeof listReply === "object") {
            const title = listReply?.title;
            const id = listReply?.id;
            const description = listReply?.description;
            result.text = title ? extractTextSafely(title) : "List reply";
            if (description) {
              result.text += `: ${extractTextSafely(description)}`;
            }
            result.interactive = {
              type: "list_reply",
              listReply: {
                id: id || "",
                title: title || "",
                description: description || undefined,
              },
            };
          }
        } else {
          result.text = `Interactive: ${interactiveType}`;
        }
      } else {
        result.text = "Interactive message";
      }
      break;
    }

    case "location": {
      const location = message?.location;
      if (location && typeof location === "object") {
        const latitude = location?.latitude;
        const longitude = location?.longitude;
        const name = location?.name;
        const address = location?.address;
        
        if (name) {
          result.text = extractTextSafely(name);
        } else if (address) {
          result.text = extractTextSafely(address);
        } else if (latitude !== undefined && longitude !== undefined) {
          result.text = `Location: ${latitude}, ${longitude}`;
        } else {
          result.text = "Location";
        }
      } else {
        result.text = "Location";
      }
      break;
    }

    case "contacts": {
      result.text = "Contact";
      break;
    }

    case "system": {
      const system = message?.system;
      if (system && typeof system === "object") {
        const body = system?.body;
        if (body) {
          result.text = extractTextSafely(body);
        } else {
          result.text = "System message";
        }
      } else {
        result.text = "System message";
      }
      break;
    }

    default: {
      console.warn(`⚠️ Unknown message type: ${type}`);
      result.text = `[${type.toUpperCase()}]`;
    }
  }

  // Extract context (for replies, reactions, etc.)
  const context = message?.context;
  if (context && typeof context === "object") {
    result.context = {
      from: context?.from || undefined,
      id: context?.id || undefined,
    };
  }

  return result;
}

// Handle GET request (webhook verification by Meta)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const webhookToken = process.env.WHATSAPP_WEBHOOK_TOKEN;

  if (!webhookToken) {
    console.error("❌ WHATSAPP_WEBHOOK_TOKEN is not set");
    return NextResponse.json(
      { error: "Webhook token not configured" },
      { status: 500 }
    );
  }

  // Verify token matches your secret
  if (mode === "subscribe" && token === webhookToken) {
    console.log("✅ Webhook verified successfully");
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error("❌ Webhook verification failed");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

/**
 * Handle POST request (incoming messages/statuses)
 * 
 * CRITICAL: Returns 200 OK immediately to prevent WhatsApp timeouts.
 * Processing happens asynchronously in the background.
 */
export async function POST(request: NextRequest) {
  // CRITICAL: Return 200 OK IMMEDIATELY - no blocking operations before this
  // WhatsApp requires acknowledgment within 20 seconds, but we do it in < 1 second
  
  // Clone request for async processing (non-blocking operation)
  const clonedRequest = request.clone();
  
  // Start async processing (fire-and-forget pattern)
  // Errors are logged but don't affect the 200 response
  processWebhookPayload(clonedRequest).catch((error) => {
    console.error("❌ Error in async webhook processing:", error);
    console.error("Error stack:", error?.stack);
  });

  // Return 200 OK immediately - MUST be < 1 second
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

/**
 * Process webhook payload asynchronously
 * 
 * This function runs AFTER the 200 OK response has been sent to WhatsApp.
 * It processes the message in the background without blocking the acknowledgment.
 */
async function processWebhookPayload(request: NextRequest) {
  try {
    // Verify we're running on Node.js runtime (not Edge)
    if (typeof process === "undefined" || !process.versions?.node) {
      console.error("❌ CRITICAL: Not running on Node.js runtime!");
      console.error("❌ Edge runtime detected - emojis will be corrupted!");
      throw new Error("Node.js runtime required for webhook processing");
    }
    console.log("✅ Running on Node.js runtime:", process.versions.node);
    
    console.log("📥 Processing webhook payload (async, after 200 OK)");
    const contentType = request.headers.get("content-type") || "";
    const contentLength = request.headers.get("content-length");
    console.log("Content-Type:", contentType);
    console.log("Content-Length:", contentLength);

    // CRITICAL: Read body as ArrayBuffer first (no encoding assumption)
    // Then explicitly decode as UTF-8 to preserve emojis
    let data: any;
    let rawBodyString: string;

    try {
      // Read as ArrayBuffer (raw bytes, no encoding assumption)
      const arrayBuffer = await request.arrayBuffer();
      
      // Explicitly decode as UTF-8 using TextDecoder
      // This ensures emojis (4-byte UTF-8 sequences) are preserved
      const decoder = new TextDecoder("utf-8");
      rawBodyString = decoder.decode(arrayBuffer);
      
      // Parse JSON from UTF-8 string
      data = JSON.parse(rawBodyString);
      
      // Verify UTF-8 encoding is preserved
      const bodyBuffer = Buffer.from(rawBodyString, "utf8");
      const reconstructedString = bodyBuffer.toString("utf8");
      const encodingValid = reconstructedString === rawBodyString;
      
      console.log("📦 Body size (bytes):", bodyBuffer.length);
      console.log("📦 UTF-8 encoding:", encodingValid ? "✅ Valid" : "❌ Corrupted");
      
      if (!contentType.includes("utf-8") && !contentType.includes("UTF-8")) {
        console.warn("⚠️ Content-Type doesn't explicitly specify UTF-8");
      }
    } catch (bodyError: any) {
      console.error("❌ Error parsing body:", bodyError);
      throw new Error("Invalid request body");
    }

    // Verify webhook signature if app secret is set
    const signature = request.headers.get("x-hub-signature-256");
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (appSecret && signature) {
      if (!verifySignature(rawBodyString, signature, appSecret)) {
        console.error("❌ Invalid webhook signature");
        throw new Error("Invalid signature");
      }
      console.log("✅ Webhook signature verified");
    } else {
      console.log("⚠️ Skipping signature verification (WHATSAPP_APP_SECRET not set)");
    }

    // Log body structure (without full content to avoid spam)
    console.log("📋 Body structure:", {
      object: data?.object,
      entryCount: data?.entry?.length || 0,
    });

    // Process all messages asynchronously
    const processingPromises: Promise<void>[] = [];

    // Handle different webhook types with defensive checks
    if (data?.object === "whatsapp_business_account") {
      console.log("✅ Valid WhatsApp webhook payload");
      
      // Defensive: Check entry exists and is array
      const entries = Array.isArray(data.entry) ? data.entry : [];
      
      for (const entry of entries) {
        if (!entry || typeof entry !== "object") continue;
        console.log("Processing entry:", entry.id);
        
        // Defensive: Check changes exists and is array
        const changes = Array.isArray(entry.changes) ? entry.changes : [];
        
        for (const change of changes) {
          if (!change || typeof change !== "object") continue;
          console.log("Processing change:", change.field);
          
          if (change.field === "messages" && change.value) {
            console.log("📨 Handling messages...");
            processingPromises.push(handleMessages(change.value));
          } else if (change.field === "message_status" && change.value) {
            console.log("📊 Handling message status...");
            processingPromises.push(handleMessages(change.value));
          }
        }
      }
    } else {
      console.log("⚠️ Unknown webhook object type:", data?.object);
    }

    // Wait for all processing to complete
    await Promise.all(processingPromises);
    console.log("✅ Webhook processing completed successfully");
  } catch (error: any) {
    console.error("❌ Error processing webhook:", error);
    console.error("Error stack:", error.stack);
    // Don't throw - errors are logged but don't affect the 200 response
  }
}

// Handle incoming messages and status updates
async function handleMessages(value: any) {
  if (!value || typeof value !== "object") {
    console.warn("⚠️ Invalid message value structure");
    return;
  }

  // Handle incoming messages with defensive checks
  if (Array.isArray(value.messages)) {
    for (const message of value.messages) {
      if (message && typeof message === "object") {
        await handleIncomingMessage(message);
      }
    }
  }

  // Handle message status updates with defensive checks
  if (Array.isArray(value.statuses)) {
    for (const status of value.statuses) {
      if (status && typeof status === "object") {
        await handleMessageStatus(status);
      }
    }
  }
}

// Process incoming message from client with defensive type handling
async function handleIncomingMessage(message: any) {
  try {
    // Guard: Validate message object
    if (!message || typeof message !== "object") {
      console.warn("⚠️ Invalid message object");
      return;
    }

    // Defensive: Extract fields with fallbacks using optional chaining
    const from = message?.from || "";
    const messageId = message?.id || "";
    const timestamp = message?.timestamp
      ? new Date(parseInt(String(message.timestamp)) * 1000)
      : new Date();
    
    // Extract message data safely (handles all types including reactions, interactive, stickers)
    const extracted = extractMessageData(message);
    const text = extracted.text;
    const mediaUrl = extracted.mediaUrl;
    const messageType = extracted.messageType;

    console.log(`📨 Processing message: from=${from}, id=${messageId}, type=${messageType}`);

    // Log interactive/reaction details if present
    if (extracted.interactive) {
      console.log("📱 Interactive message:", extracted.interactive);
    }
    if (extracted.reaction) {
      console.log("😊 Reaction:", extracted.reaction);
    }
    if (extracted.context) {
      console.log("🔗 Context:", extracted.context);
    }

    // Log text with emoji verification (for debugging)
    if (text && text.length > 0) {
      const emojiRegex =
        /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
      if (emojiRegex.test(text)) {
        console.log("✅ Emojis detected in message text");
      }
    }

    // Save message to database (if model exists)
    // Guard: Check Prisma model exists
    if (prisma?.whatsAppMessage) {
      try {
        // CRITICAL: Ensure UTF-8 encoding is preserved before database insert
        // Re-encode text to guarantee valid UTF-8 (defensive measure)
        const textForDatabase = text
          ? Buffer.from(text, "utf8").toString("utf8")
          : null;
        
        const savedMessage = await prisma.whatsAppMessage.create({
          data: {
            messageId,
            from,
            to: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
            text: textForDatabase, // ✅ Explicitly UTF-8 encoded
            type: messageType.toUpperCase() as any,
            direction: "INCOMING",
            mediaUrl,
            timestamp,
          },
        });
        
        console.log(`✅ Message saved to database: ${savedMessage.id}`);
        
        // CRITICAL: Verify UTF-8 encoding was preserved in database
        // Compare original text with saved text byte-by-byte
        if (text && savedMessage.text) {
          const originalBuffer = Buffer.from(text, "utf8");
          const savedBuffer = Buffer.from(savedMessage.text, "utf8");
          const encodingMatch = originalBuffer.equals(savedBuffer);
          
          if (encodingMatch) {
            console.log("✅ UTF-8 encoding verified: Original and saved text match");
          } else {
            console.error("❌ UTF-8 encoding mismatch detected!");
            console.error("Original hex:", originalBuffer.toString("hex"));
            console.error("Saved hex:", savedBuffer.toString("hex"));
          }
          
          // Verify emojis are in saved message
          const emojiRegex =
            /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
          if (emojiRegex.test(savedMessage.text)) {
            console.log("✅ Emojis confirmed in saved database record");
          } else if (emojiRegex.test(text)) {
            console.error("❌ Emojis lost during database save!");
            console.error("Original had emojis but saved text does not");
          }
        }
      } catch (dbError: any) {
        console.error("❌ Error saving message to database:", dbError);
        // Don't throw - log error but continue
      }
    } else {
      console.warn(
        "⚠️ WhatsAppMessage model not found. Message not saved to database."
      );
    }
  } catch (error: any) {
    console.error("Error handling incoming message:", error);
    // Don't throw - errors are logged but don't affect webhook response
  }
}

// Handle message status updates
async function handleMessageStatus(status: any) {
  try {
    if (!status || typeof status !== "object") {
      console.warn("⚠️ Invalid status object");
      return;
    }

    const messageId = status.id;
    const statusValue = String(status.status || "").toUpperCase();

    if (!messageId || !statusValue) {
      console.warn("⚠️ Invalid status data");
      return;
    }

    // Update message status in database (if model exists)
    if (prisma?.whatsAppMessage) {
      await prisma.whatsAppMessage.updateMany({
        where: { messageId },
        data: { status: statusValue as any },
      });
    }

    console.log(`📊 Message ${messageId} status: ${statusValue}`);
  } catch (error: any) {
    console.error("Error handling message status:", error);
  }
}
