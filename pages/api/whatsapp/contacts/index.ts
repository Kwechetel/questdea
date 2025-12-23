import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

// Validation schema for contact
const contactSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  name: z.string().min(1, "Name is required").max(200),
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

// GET /api/whatsapp/contacts - Get all contacts (admin only)
// POST /api/whatsapp/contacts - Create new contact (admin only)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      if (!prisma.whatsAppContact) {
        console.warn("WhatsAppContact model not found. Please run 'npx prisma generate' and restart your dev server.");
        return res.status(200).json([]);
      }

      const contacts = await prisma.whatsAppContact.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return res.status(200).json(contacts);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection failed. Please ensure the database server is running and accessible.",
          error: "Database connection error"
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  if (req.method === "POST") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      const validationResult = contactSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      // Check if WhatsAppContact model exists
      if (!prisma.whatsAppContact) {
        return res.status(500).json({
          message: "WhatsAppContact model not found. Please run 'npx prisma migrate dev --name add_whatsapp_contacts' and 'npx prisma generate', then restart your dev server.",
          error: "Prisma Client not regenerated",
        });
      }

      // Normalize phone number (remove spaces, ensure + prefix)
      let normalizedPhone = data.phoneNumber.replace(/\s+/g, "");
      if (!normalizedPhone.startsWith("+")) {
        normalizedPhone = `+${normalizedPhone}`;
      }

      // Check if contact already exists
      const existing = await prisma.whatsAppContact.findUnique({
        where: { phoneNumber: normalizedPhone },
      });

      if (existing) {
        return res.status(400).json({
          message: "A contact with this phone number already exists",
        });
      }

      const contact = await prisma.whatsAppContact.create({
        data: {
          phoneNumber: normalizedPhone,
          name: data.name,
          email: data.email || null,
          notes: data.notes || null,
        },
      });

      return res.status(201).json({
        message: "Contact created successfully",
        contact,
      });
    } catch (error: any) {
      console.error("Error creating contact:", error);

      if (error.code === "P2002") {
        return res.status(400).json({
          message: "A contact with this phone number already exists",
        });
      }

      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection failed. Please ensure the database server is running and accessible.",
          error: "Database connection error"
        });
      }

      if (error.message?.includes("Cannot read properties of undefined") || error.message?.includes("whatsAppContact")) {
        return res.status(500).json({
          message: "WhatsAppContact model not found. Please run 'npx prisma migrate dev --name add_whatsapp_contacts' and 'npx prisma generate', then restart your dev server.",
          error: "Prisma Client not regenerated",
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

