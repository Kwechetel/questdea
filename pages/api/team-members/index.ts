import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

// Validation schema for team member
const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  image: z.string().url().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  facebookUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  order: z.number().int().default(0),
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

// GET /api/team-members - Get all team members (public)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Check if teamMember model exists in Prisma Client
      if (!prisma.teamMember) {
        return res.status(200).json([]); // Return empty array if model doesn't exist yet
      }

      const teamMembers = await prisma.teamMember.findMany({
        orderBy: {
          order: "asc",
        },
      });

      return res.status(200).json(teamMembers);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      
      // Check if table doesn't exist (common after schema update)
      if (error.code === "P2021" || error.message?.includes("does not exist")) {
        return res.status(200).json([]); // Return empty array if table doesn't exist yet
      }
      
      // Check if it's the undefined error
      if (error.message?.includes("Cannot read properties of undefined")) {
        return res.status(200).json([]); // Return empty array if Prisma Client not regenerated
      }
      
      // Provide more specific error messages
      if (error.code === "P1001") {
        return res.status(503).json({ 
          message: "Database connection error. Please ensure the database is running and accessible.",
          error: "Database connection error"
        });
      }
      
      return res.status(500).json({ 
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }

  // POST /api/team-members - Create new team member (admin only)
  if (req.method === "POST") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      // Check if teamMember model exists in Prisma Client
      if (!prisma.teamMember) {
        return res.status(500).json({
          message: "TeamMember model not found. Please run 'npx prisma generate' to regenerate Prisma Client, then restart your dev server.",
          error: "Prisma Client not regenerated",
        });
      }

      const validationResult = teamMemberSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      const teamMember = await prisma.teamMember.create({
        data: {
          name: data.name,
          role: data.role,
          image: data.image || null,
          description: data.description,
          facebookUrl: data.facebookUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          order: data.order,
        },
      });

      return res.status(201).json({
        message: "Team member created successfully",
        teamMember,
      });
    } catch (error: any) {
      console.error("Error creating team member:", error);
      
      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection error. Please ensure your database is running and accessible. If using Neon, the database may be paused - try accessing it to wake it up.",
          error: "Database connection failed",
        });
      }
      
      // Check if it's the undefined error
      if (error.message?.includes("Cannot read properties of undefined")) {
        return res.status(500).json({
          message: "Prisma Client needs to be regenerated. Please run 'npx prisma generate' and restart your dev server.",
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

