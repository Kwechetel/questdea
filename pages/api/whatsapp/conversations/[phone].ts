import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

const updateConversationSchema = z.object({
  isPinned: z.boolean().optional(),
  markAsRead: z.boolean().optional(),
});

// DELETE /api/whatsapp/conversations/[phone] - Delete all messages for a conversation
// PATCH /api/whatsapp/conversations/[phone] - Update conversation (pin/unpin, mark as read)
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

  const { phone } = req.query;

  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ message: "Phone number is required" });
  }

  // Normalize phone number
  let normalizedPhone = decodeURIComponent(phone).replace(/\s+/g, "");
  if (!normalizedPhone.startsWith("+")) {
    normalizedPhone = `+${normalizedPhone}`;
  }

  // DELETE - Delete all messages for this conversation
  if (req.method === "DELETE") {
    try {
      // Check if WhatsAppMessage model exists
      if (!prisma.whatsAppMessage) {
        return res.status(500).json({ message: "WhatsAppMessage model not found" });
      }

      // Delete all messages where phone is either sender or recipient
      const phoneVariations: string[] = [normalizedPhone, phone];
      if (normalizedPhone.startsWith("+")) {
        phoneVariations.push(normalizedPhone.substring(1));
      } else {
        phoneVariations.push(`+${normalizedPhone}`);
      }

      const deleteResult = await prisma.whatsAppMessage.deleteMany({
        where: {
          OR: [
            ...phoneVariations.map(phoneVar => ({ from: phoneVar })),
            ...phoneVariations.map(phoneVar => ({ to: phoneVar })),
          ],
        },
      });

      return res.status(200).json({ 
        message: "Conversation deleted successfully",
        deletedCount: deleteResult.count 
      });
    } catch (error: any) {
      console.error("Error deleting conversation:", error);
      if (error.code === "P2021") {
        return res.status(500).json({ message: "Database table not found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PATCH - Update conversation (pin/unpin, mark as read)
  if (req.method === "PATCH") {
    try {
      // Validate request body
      const body = updateConversationSchema.parse(req.body);

      // Check if WhatsAppContact model exists
      if (!prisma.whatsAppContact) {
        return res.status(500).json({ message: "WhatsAppContact model not found" });
      }

      // Find or create contact
      let contact = await prisma.whatsAppContact.findUnique({
        where: { phoneNumber: normalizedPhone },
      });

      const updateData: any = {};

      if (body.isPinned !== undefined) {
        updateData.isPinned = body.isPinned;
      }

      if (body.markAsRead === true) {
        updateData.lastReadAt = new Date();
      }

      if (contact) {
        // Update existing contact
        contact = await prisma.whatsAppContact.update({
          where: { phoneNumber: normalizedPhone },
          data: updateData,
        });
      } else {
        // Create new contact with the update data
        contact = await prisma.whatsAppContact.create({
          data: {
            phoneNumber: normalizedPhone,
            name: normalizedPhone, // Default name
            ...updateData,
          },
        });
      }

      return res.status(200).json({
        message: "Conversation updated successfully",
        contact: {
          isPinned: contact.isPinned,
          lastReadAt: contact.lastReadAt,
        },
      });
    } catch (error: any) {
      console.error("Error updating conversation:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request body", errors: error.errors });
      }
      if (error.code === "P2021") {
        return res.status(500).json({ message: "Database table not found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

