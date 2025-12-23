import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

const newConversationSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  name: z.string().optional(),
});

// POST /api/whatsapp/conversations/new - Create a new conversation/contact
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

  if (req.method === "POST") {
    try {
      // Validate request body
      const body = newConversationSchema.parse(req.body);

      // Normalize phone number
      let normalizedPhone = body.phoneNumber.replace(/\s+/g, "");
      if (!normalizedPhone.startsWith("+")) {
        normalizedPhone = `+${normalizedPhone}`;
      }

      // Check if WhatsAppContact model exists
      if (!prisma.whatsAppContact) {
        return res.status(500).json({ message: "WhatsAppContact model not found" });
      }

      // Check if contact already exists
      const existingContact = await prisma.whatsAppContact.findUnique({
        where: { phoneNumber: normalizedPhone },
      });

      if (existingContact) {
        return res.status(200).json({
          message: "Contact already exists",
          contact: existingContact,
        });
      }

      // Create new contact
      const contact = await prisma.whatsAppContact.create({
        data: {
          phoneNumber: normalizedPhone,
          name: body.name || normalizedPhone,
        },
      });

      return res.status(201).json({
        message: "Conversation created successfully",
        contact,
      });
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request body", errors: error.errors });
      }
      if (error.code === "P2002") {
        return res.status(409).json({ message: "Contact with this phone number already exists" });
      }
      if (error.code === "P2021") {
        return res.status(500).json({ message: "Database table not found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

