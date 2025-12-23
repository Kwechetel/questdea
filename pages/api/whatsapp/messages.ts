import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { z } from "zod";

// Validation schema
const sendMessageSchema = z.object({
  to: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required").max(4096),
});

// GET /api/whatsapp/messages?phone=+1234567890 - Get messages for a conversation
// POST /api/whatsapp/messages - Send a message (admin only)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify admin access
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (session.user.role !== Role.ADMIN) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  // GET - Fetch messages for a conversation
  if (req.method === "GET") {
    try {
      const { phone } = req.query;

      if (!phone || typeof phone !== "string") {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // Check if WhatsAppMessage model exists
      if (!prisma.whatsAppMessage) {
        console.warn("WhatsAppMessage model not found. Please run 'npx prisma generate' and restart your dev server.");
        return res.status(200).json([]);
      }

      // Normalize phone number for matching
      let normalizedPhone = decodeURIComponent(phone).replace(/\s+/g, "");
      const phoneVariations: string[] = [normalizedPhone, phone];
      
      // Add variations with/without + prefix
      if (normalizedPhone.startsWith("+")) {
        phoneVariations.push(normalizedPhone.substring(1));
      } else {
        phoneVariations.push(`+${normalizedPhone}`);
      }

      // Get messages where phone is either sender (incoming) or recipient (outgoing)
      // Try to match with different phone number formats
      let messages: any[] = [];
      try {
        messages = await prisma.whatsAppMessage.findMany({
          where: {
            OR: [
              // Incoming messages - try all variations
              ...phoneVariations.map(phoneVar => ({ from: phoneVar })),
              // Outgoing messages - try all variations
              ...phoneVariations.map(phoneVar => ({ to: phoneVar })),
            ],
          },
          orderBy: { timestamp: "asc" },
        });
      } catch (dbError: any) {
        // Handle database connection errors
        if (dbError.code === "P1001" || dbError.message?.includes("Can't reach database server")) {
          console.error("Database connection error:", dbError.message);
          return res.status(503).json({
            message: "Database connection failed. Please check your database connection.",
            error: "DATABASE_CONNECTION_ERROR"
          });
        }
        if (dbError.code === "P2021") {
          // Table doesn't exist
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          return res.status(200).json([]);
        }
        throw dbError; // Re-throw other errors
      }

      // Ensure UTF-8 encoding in response
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.status(200).json(messages);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      
      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection failed. Please ensure the database server is running and accessible.",
          error: "Database connection error"
        });
      }

      if (error.code === "P2021") {
        return res.status(200).json([]); // Table doesn't exist, return empty array
      }

      return res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // POST - Send a message
  if (req.method === "POST") {
    try {
      const validationResult = sendMessageSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const { to, message } = validationResult.data;

      // Send message via WhatsApp API
      const result = await sendWhatsAppMessage(to, message);

      if (!result.success) {
        return res.status(500).json({
          message: "Failed to send message",
          error: result.error,
        });
      }

      // Save outgoing message to database (if model exists)
      let savedMessage = null;
      if (prisma.whatsAppMessage) {
        try {
          savedMessage = await prisma.whatsAppMessage.create({
            data: {
              messageId: result.messageId || `outgoing_${Date.now()}`,
              from: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
              to,
              text: message,
              type: "TEXT",
              direction: "OUTGOING",
              status: "SENT",
            },
          });
          console.log("✅ Message saved to database:", savedMessage.id);
        } catch (dbError: any) {
          console.error("❌ Error saving message to database:", dbError);
          // Still return success since WhatsApp message was sent
        }
      } else {
        console.warn("⚠️ WhatsAppMessage model not found. Message sent but not saved to database.");
        console.warn("   Run: npx prisma generate && npx prisma migrate dev");
      }

      return res.status(200).json({
        message: "Message sent successfully",
        whatsAppMessage: savedMessage,
        savedToDatabase: !!savedMessage,
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

