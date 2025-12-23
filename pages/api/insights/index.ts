import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

// Validation schema for insight
const insightSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required").max(50),
  readTime: z.string().min(1, "Read time is required").max(20),
  author: z.string().max(100).optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  body: z.string().optional().nullable(),
  published: z.boolean().default(true),
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

// GET /api/insights - Get all insights (public if published, admin sees all)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { published, category } = req.query;
      const session = await getServerSession(req, res, authOptions);
      const isAdmin = session?.user?.role === Role.ADMIN;

      // Build where clause
      const where: any = {};
      
      // If not admin, only show published
      if (!isAdmin) {
        where.published = true;
      } else if (published === "true") {
        where.published = true;
      }

      // Filter by category if provided
      if (category && category !== "All") {
        where.category = category;
      }

      const insights = await prisma.insight.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(insights);
    } catch (error: any) {
      console.error("Error fetching insights:", error);
      
      // Provide more specific error messages
      if (error.code === "P1001" || error.message?.includes("Can't reach database server")) {
        return res.status(503).json({ 
          message: "Database connection failed. Please check your DATABASE_URL and ensure the database server is running.",
          error: "Database connection error"
        });
      }
      
      return res.status(500).json({ 
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }

  // POST /api/insights - Create new insight (admin only)
  if (req.method === "POST") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      const validationResult = insightSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      // Check if slug already exists
      const existing = await prisma.insight.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        return res.status(400).json({
          message: "An insight with this slug already exists",
        });
      }

      const insight = await prisma.insight.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          category: data.category,
          readTime: data.readTime,
          author: data.author || "LASTTE Team",
          tags: data.tags || [],
          featured: data.featured,
          body: data.body || null,
          published: data.published,
        },
      });

      return res.status(201).json({
        message: "Insight created successfully",
        insight,
      });
    } catch (error: any) {
      console.error("Error creating insight:", error);

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

  return res.status(405).json({ message: "Method not allowed" });
}

