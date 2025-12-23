import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role, LeadStatus } from "@prisma/client";
import { z } from "zod";

// Validation schema for status update
const updateStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "WON", "LOST"]),
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

// GET /api/leads/[id] - Get single lead
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid lead ID" });
  }

  // Verify admin access
  const session = await verifyAdmin(req, res);
  if (!session) return;

  try {
    if (req.method === "GET") {
      const lead = await prisma.lead.findUnique({
        where: { id },
      });

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      return res.status(200).json(lead);
    }

    // PATCH /api/leads/[id] - Update lead status
    if (req.method === "PATCH") {
      const validationResult = updateStatusSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const { status } = validationResult.data;

      const lead = await prisma.lead.update({
        where: { id },
        data: { status: status as LeadStatus },
      });

      return res.status(200).json({
        message: "Lead status updated successfully",
        lead,
      });
    }

    // DELETE /api/leads/[id] - Delete lead
    if (req.method === "DELETE") {
      // Check if lead exists
      const lead = await prisma.lead.findUnique({
        where: { id },
      });

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      await prisma.lead.delete({
        where: { id },
      });

      return res.status(200).json({
        message: "Lead deleted successfully",
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Error in lead API:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

