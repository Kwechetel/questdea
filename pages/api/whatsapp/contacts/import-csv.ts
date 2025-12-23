import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

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

// Parse CSV content
function parseCSV(csvContent: string): Array<{ phoneNumber: string; name: string; email?: string; notes?: string }> {
  const lines = csvContent.split("\n").filter(line => line.trim());
  const contacts: Array<{ phoneNumber: string; name: string; email?: string; notes?: string }> = [];

  // Skip header row if present
  const startIndex = lines[0]?.toLowerCase().includes("phone") ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle quoted values)
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    // Extract data (expecting: phoneNumber, name, email?, notes?)
    if (values.length >= 2) {
      let phoneNumber = values[0].replace(/"/g, "").trim();
      const name = values[1].replace(/"/g, "").trim();
      const email = values[2]?.replace(/"/g, "").trim() || undefined;
      const notes = values[3]?.replace(/"/g, "").trim() || undefined;

      // Normalize phone number
      phoneNumber = phoneNumber.replace(/\s+/g, "");
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+${phoneNumber}`;
      }

      if (phoneNumber && name) {
        contacts.push({
          phoneNumber,
          name,
          email,
          notes,
        });
      }
    }
  }

  return contacts;
}

// POST /api/whatsapp/contacts/import-csv - Import contacts from CSV
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await verifyAdmin(req, res);
  if (!session) return;

  try {
    const { csvContent } = req.body;

    if (!csvContent || typeof csvContent !== "string") {
      return res.status(400).json({ message: "CSV content is required" });
    }

    if (!prisma.whatsAppContact) {
      return res.status(500).json({
        message: "WhatsAppContact model not found. Please run 'npx prisma generate' and restart your dev server.",
      });
    }

    // Parse CSV
    const contacts = parseCSV(csvContent);

    if (contacts.length === 0) {
      return res.status(400).json({ message: "No valid contacts found in CSV" });
    }

    // Import contacts (upsert - update if exists, create if not)
    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const contact of contacts) {
      try {
        const existing = await prisma.whatsAppContact.findUnique({
          where: { phoneNumber: contact.phoneNumber },
        });

        if (existing) {
          await prisma.whatsAppContact.update({
            where: { phoneNumber: contact.phoneNumber },
            data: {
              name: contact.name,
              email: contact.email || null,
              notes: contact.notes || null,
            },
          });
          results.updated++;
        } else {
          await prisma.whatsAppContact.create({
            data: {
              phoneNumber: contact.phoneNumber,
              name: contact.name,
              email: contact.email || null,
              notes: contact.notes || null,
            },
          });
          results.created++;
        }
      } catch (error: any) {
        results.errors.push(`${contact.phoneNumber}: ${error.message}`);
      }
    }

    return res.status(200).json({
      message: "CSV import completed",
      results,
    });
  } catch (error: any) {
    console.error("Error importing CSV:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

