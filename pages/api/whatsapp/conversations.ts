import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

// GET /api/whatsapp/conversations - Get all conversations (admin only)
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

  if (req.method === "GET") {
    try {
      // Check if WhatsAppMessage model exists in Prisma Client
      if (!prisma.whatsAppMessage) {
        console.warn("WhatsAppMessage model not found. Please run 'npx prisma generate' and restart your dev server.");
        return res.status(200).json([]);
      }

      // Get all messages and group by client phone number
      // For incoming: from = client, to = business
      // For outgoing: from = business, to = client
      let allMessages: any[] = [];
      try {
        allMessages = await prisma.whatsAppMessage.findMany({
          orderBy: { timestamp: "desc" },
        });
      } catch (dbError: any) {
        // Handle database connection errors
        if (dbError.code === "P1001" || dbError.message?.includes("Can't reach database server")) {
          console.error("Database connection error:", dbError.message);
          return res.status(503).json({ 
            message: "Database connection failed. Please check your database connection or if the database server is running.",
            error: "DATABASE_CONNECTION_ERROR"
          });
        }
        throw dbError; // Re-throw other errors
      }

      // Group by client phone number (the "other" party in the conversation)
      const conversationMap = new Map<string, any[]>();
      
      allMessages.forEach((msg) => {
        // Determine client phone number based on message direction
        const clientPhone = msg.direction === "INCOMING" ? msg.from : msg.to;
        
        if (!conversationMap.has(clientPhone)) {
          conversationMap.set(clientPhone, []);
        }
        conversationMap.get(clientPhone)!.push(msg);
      });

      // Get contacts for phone numbers
      const phoneNumbers = Array.from(conversationMap.keys());
      let contacts: any[] = [];
      
      if (prisma.whatsAppContact) {
        try {
          // Normalize phone numbers for matching (ensure they all have + prefix)
          const normalizedPhoneNumbers = phoneNumbers.map(phone => {
            let normalized = phone.replace(/\s+/g, "");
            if (!normalized.startsWith("+")) {
              normalized = `+${normalized}`;
            }
            return normalized;
          });

          contacts = await prisma.whatsAppContact.findMany({
            where: {
              phoneNumber: {
                in: normalizedPhoneNumbers,
              },
            },
          });
        } catch (error: any) {
          // Handle case where table doesn't exist yet (P2021)
          if (error.code === "P2021") {
            console.warn("WhatsApp contacts table doesn't exist yet. Run migration: npx prisma migrate dev --name add_whatsapp_contacts");
            contacts = [];
          } else {
            console.error("Error fetching contacts:", error);
            contacts = [];
          }
        }
      }

      // Create a map that works with both normalized and non-normalized phone numbers
      const contactMap = new Map<string, any>();
      contacts.forEach(contact => {
        // Map the stored format
        contactMap.set(contact.phoneNumber, contact);
        // Also map variations (with/without +)
        if (contact.phoneNumber.startsWith("+")) {
          contactMap.set(contact.phoneNumber.substring(1), contact);
        } else {
          contactMap.set(`+${contact.phoneNumber}`, contact);
        }
      });

      // Get last message for each conversation
      const conversationsWithLastMessage = Array.from(conversationMap.entries()).map(([clientPhone, messages]) => {
        const lastMessage = messages[0]; // Already sorted by timestamp desc
        const incomingMessages = messages.filter(m => m.direction === "INCOMING");
        
        // Try to find contact - normalize the phone number for matching
        let normalizedClientPhone = clientPhone.replace(/\s+/g, "");
        if (!normalizedClientPhone.startsWith("+")) {
          normalizedClientPhone = `+${normalizedClientPhone}`;
        }
        
        // Try multiple variations to find the contact
        const contact = contactMap.get(clientPhone) || 
                       contactMap.get(normalizedClientPhone) ||
                       contactMap.get(clientPhone.replace(/\s+/g, ""));

        // Calculate unread count based on lastReadAt
        let unreadCount = 0;
        if (contact?.lastReadAt) {
          unreadCount = incomingMessages.filter(msg => 
            new Date(msg.timestamp) > new Date(contact.lastReadAt!)
          ).length;
        } else {
          // If never read, all incoming messages are unread
          unreadCount = incomingMessages.length;
        }

        return {
          phoneNumber: clientPhone,
          contactName: contact?.name || null,
          lastMessage: lastMessage?.text || "Media message",
          lastMessageType: lastMessage?.type,
          lastMessageDirection: lastMessage?.direction,
          lastMessageTime: lastMessage?.timestamp,
          unreadCount,
          totalMessages: messages.length,
          isPinned: contact?.isPinned || false,
          lastReadAt: contact?.lastReadAt || null,
        };
      });

      // Sort: pinned first, then by last message time
      conversationsWithLastMessage.sort((a, b) => {
        // Pinned conversations first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // Then by last message time
        const timeA = new Date(a.lastMessageTime).getTime();
        const timeB = new Date(b.lastMessageTime).getTime();
        return timeB - timeA;
      });

      // Ensure UTF-8 encoding in response
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.status(200).json(conversationsWithLastMessage);
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
      
      // Handle database connection errors specifically
      if (error.code === "P1001" || error.message?.includes("Can't reach database server")) {
        return res.status(503).json({ 
          message: "Database connection failed. Please check your database connection or if the database server is running.",
          error: "DATABASE_CONNECTION_ERROR"
        });
      }
      
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

