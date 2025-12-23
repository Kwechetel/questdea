import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

// Validation schema for team member update
const updateTeamMemberSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  role: z.string().min(1).max(200).optional(),
  image: z.string().url().optional().nullable(),
  description: z.string().min(1).optional(),
  facebookUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  order: z.number().int().optional(),
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
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid team member ID" });
  }

  // GET /api/team-members/[id] - Get single team member
  if (req.method === "GET") {
    try {
      // Check if teamMember model exists in Prisma Client
      if (!prisma.teamMember) {
        return res.status(404).json({ 
          message: "TeamMember model not found. Please run 'npx prisma generate'.",
        });
      }

      const teamMember = await prisma.teamMember.findUnique({
        where: { id },
      });

      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }

      return res.status(200).json(teamMember);
    } catch (error: any) {
      console.error("Error fetching team member:", error);
      
      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection error. Please ensure your database is running and accessible.",
          error: "Database connection failed",
        });
      }
      
      if (error.message?.includes("Cannot read properties of undefined")) {
        return res.status(500).json({
          message: "Prisma Client needs to be regenerated. Please run 'npx prisma generate'.",
        });
      }
      
      return res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // PATCH /api/team-members/[id] - Update team member (admin only)
  if (req.method === "PATCH") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      // Check if teamMember model exists in Prisma Client
      if (!prisma.teamMember) {
        return res.status(500).json({
          message: "TeamMember model not found. Please run 'npx prisma generate' and restart your dev server.",
        });
      }

      const validationResult = updateTeamMemberSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      const teamMember = await prisma.teamMember.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.role && { role: data.role }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.description && { description: data.description }),
          ...(data.facebookUrl !== undefined && { facebookUrl: data.facebookUrl }),
          ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl }),
          ...(data.order !== undefined && { order: data.order }),
        },
      });

      return res.status(200).json({
        message: "Team member updated successfully",
        teamMember,
      });
    } catch (error: any) {
      console.error("Error updating team member:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ message: "Team member not found" });
      }

      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection error. Please ensure your database is running and accessible.",
          error: "Database connection failed",
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // DELETE /api/team-members/[id] - Delete team member (admin only)
  if (req.method === "DELETE") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      // Check if teamMember model exists in Prisma Client
      if (!prisma.teamMember) {
        return res.status(500).json({
          message: "TeamMember model not found. Please run 'npx prisma generate' and restart your dev server.",
        });
      }

      await prisma.teamMember.delete({
        where: { id },
      });

      return res.status(200).json({
        message: "Team member deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting team member:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ message: "Team member not found" });
      }

      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection error. Please ensure your database is running and accessible.",
          error: "Database connection failed",
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

