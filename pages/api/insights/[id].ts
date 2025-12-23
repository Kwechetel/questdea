import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

// Validation schema for insight update
const updateInsightSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens")
    .optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).max(50).optional(),
  readTime: z.string().min(1).max(20).optional(),
  author: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  body: z.string().optional().nullable(),
  published: z.boolean().optional(),
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
    return res.status(400).json({ message: "Invalid insight ID" });
  }

  // GET /api/insights/[id] - Get single insight
  if (req.method === "GET") {
    try {
      const insight = await prisma.insight.findUnique({
        where: { id },
      });

      if (!insight) {
        return res.status(404).json({ message: "Insight not found" });
      }

      // Check if published or admin
      const session = await getServerSession(req, res, authOptions);
      const isAdmin = session?.user?.role === Role.ADMIN;

      if (!insight.published && !isAdmin) {
        return res.status(404).json({ message: "Insight not found" });
      }

      return res.status(200).json(insight);
    } catch (error) {
      console.error("Error fetching insight:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PATCH /api/insights/[id] - Update insight (admin only)
  if (req.method === "PATCH") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      const validationResult = updateInsightSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      // Check if slug is being updated and if it conflicts
      if (data.slug) {
        const existing = await prisma.insight.findUnique({
          where: { slug: data.slug },
        });

        if (existing && existing.id !== id) {
          return res.status(400).json({
            message: "An insight with this slug already exists",
          });
        }
      }

      const insight = await prisma.insight.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.slug && { slug: data.slug }),
          ...(data.description && { description: data.description }),
          ...(data.category && { category: data.category }),
          ...(data.readTime && { readTime: data.readTime }),
          ...(data.author !== undefined && { author: data.author }),
          ...(data.tags !== undefined && { tags: data.tags }),
          ...(data.featured !== undefined && { featured: data.featured }),
          ...(data.body !== undefined && { body: data.body }),
          ...(data.published !== undefined && { published: data.published }),
        },
      });

      return res.status(200).json({
        message: "Insight updated successfully",
        insight,
      });
    } catch (error: any) {
      console.error("Error updating insight:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ message: "Insight not found" });
      }

      if (error.code === "P2002") {
        return res.status(400).json({
          message: "An insight with this slug already exists",
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // DELETE /api/insights/[id] - Delete insight (admin only)
  if (req.method === "DELETE") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      await prisma.insight.delete({
        where: { id },
      });

      return res.status(200).json({
        message: "Insight deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting insight:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ message: "Insight not found" });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

