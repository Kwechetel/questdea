import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

// Validation schema for contact update
const updateContactSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Helper function to verify admin access
async function verifyAdmin(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  if (session.user.role !== Role.ADMIN) {
    res.status(403).json({ message: "Forbidden - Admin access required" });
    return null;
  }

  return session;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { phone } = req.query;

  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  // Normalize phone number
  let normalizedPhone = decodeURIComponent(phone).replace(/\s+/g, "");
  if (!normalizedPhone.startsWith("+")) {
    normalizedPhone = `+${normalizedPhone}`;
  }

  // GET /api/whatsapp/contacts/[phone] - Get single contact
  if (req.method === "GET") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      if (!prisma.whatsAppContact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      const contact = await prisma.whatsAppContact.findUnique({
        where: { phoneNumber: normalizedPhone },
      });

      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      return res.status(200).json(contact);
    } catch (error: any) {
      console.error("Error fetching contact:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PATCH /api/whatsapp/contacts/[phone] - Update contact
  if (req.method === "PATCH") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      const validationResult = updateContactSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      if (!prisma.whatsAppContact) {
        return res.status(500).json({
          message: "WhatsAppContact model not found",
        });
      }

      const contact = await prisma.whatsAppContact.update({
        where: { phoneNumber: normalizedPhone },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email !== undefined && { email: data.email }),
          ...(data.notes !== undefined && { notes: data.notes }),
        },
      });

      return res.status(200).json({
        message: "Contact updated successfully",
        contact,
      });
    } catch (error: any) {
      console.error("Error updating contact:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ message: "Contact not found" });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // DELETE /api/whatsapp/contacts/[phone] - Delete contact
  if (req.method === "DELETE") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      if (!prisma.whatsAppContact) {
        return res.status(500).json({
          message: "WhatsAppContact model not found",
        });
      }

      await prisma.whatsAppContact.delete({
        where: { phoneNumber: normalizedPhone },
      });

      return res.status(200).json({
        message: "Contact deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting contact:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ message: "Contact not found" });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

