import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@prisma/client";
import {
  sendWhatsAppMessage,
  formatLeadNotification,
} from "@/lib/whatsapp";

// Rate limiting store (in-memory)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit: 3 submissions per 15 minutes per IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0]
      : req.socket.remoteAddress || "unknown";
  return ip;
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// Zod validation schema
const leadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(1, "Phone is required").max(50),
  business: z.string().max(200).nullable().optional(),
  budget: z.string().max(100).nullable().optional(),
  message: z.string().max(2000).nullable().optional(),
  website: z.string().max(0).optional(), // Honeypot - must be empty
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle GET requests (admin only - for fetching leads)
  if (req.method === "GET") {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("../auth/[...nextauth]");
    const { Role, LeadStatus } = await import("@prisma/client");

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (session.user.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const { status } = req.query;
      
      const where = status && status !== "ALL" 
        ? { status: status as LeadStatus }
        : {};

      const leads = await prisma.lead.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Handle POST requests (public - for form submissions)
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
    }

    // Validate request body with Zod
    const validationResult = leadSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
    }

    const data = validationResult.data;

    // Check honeypot field (should be empty or undefined)
    if (data.website && data.website.length > 0) {
      // Silent fail for bots
      return res.status(200).json({ message: "Success" });
    }

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        business: data.business || null,
        budget: data.budget || null,
        message: data.message || null,
        status: LeadStatus.NEW,
      },
    });

    // Send WhatsApp notification (non-blocking)
    const adminPhoneNumber = process.env.WHATSAPP_ADMIN_PHONE;
    if (adminPhoneNumber) {
      console.log("📱 Sending WhatsApp notification to:", adminPhoneNumber);
      // Don't await - send notification asynchronously
      sendWhatsAppMessage(
        adminPhoneNumber,
        formatLeadNotification({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          business: lead.business,
          message: lead.message,
        })
      )
        .then((result) => {
          if (result.success) {
            console.log("✅ WhatsApp notification sent successfully:", result.messageId);
            console.log("📱 Message should arrive shortly. If not received, check 24-hour window restriction.");
          } else {
            console.error("❌ WhatsApp notification failed:", result.error);
            if (result.error?.includes("24-hour window")) {
              console.error("⚠️ IMPORTANT: The recipient must message your business WhatsApp number first!");
              console.error("   Business Number: +263 77 359 9291");
              console.error("   Or use pre-approved template messages instead of free-form text.");
            }
            if (result.error?.includes("Permission denied") || result.error?.includes("permission")) {
              console.error("⚠️ PERMISSIONS ERROR: Your access token needs 'whatsapp_business_messaging' permission.");
              console.error("   See WHATSAPP_PERMISSIONS_FIX.md for instructions to generate a new token.");
            }
          }
        })
        .catch((error) => {
          // Log error but don't fail the request
          console.error("❌ Failed to send WhatsApp notification:", error);
        });
    } else {
      console.warn("⚠️ WHATSAPP_ADMIN_PHONE is not set. Skipping WhatsApp notification.");
    }

    return res.status(201).json({
      message: "Lead created successfully",
      id: lead.id,
    });
  } catch (error: any) {
    console.error("Error creating lead:", error);

    // Handle unique constraint violation (duplicate email)
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "A lead with this email already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
