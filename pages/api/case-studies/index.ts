import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

// Validation schema for case study
const caseStudySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  summary: z.string().min(1, "Summary is required").max(500),
  stack: z.string().min(1, "Stack is required").max(200),
  coverImageUrl: z.string().url().optional().nullable(),
  body: z.string().min(1, "Body is required"),
  published: z.boolean().default(false),
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

// GET /api/case-studies - Get all case studies (public if published, admin sees all)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { published } = req.query;
      const session = await getServerSession(req, res, authOptions);
      const isAdmin = session?.user?.role === Role.ADMIN;

      // Build where clause
      const where: any = {};
      
      // If not admin, only show published
      if (!isAdmin) {
        where.published = true;
      } else if (published === "true") {
        // Admin can filter by published status if needed
        where.published = true;
      }
      // If admin and no published filter, show all (where = {})

      const caseStudies = await prisma.caseStudy.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(caseStudies);
    } catch (error: any) {
      console.error("Error fetching case studies:", error);
      
      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection error. Please ensure your database is running and accessible. If using Neon, the database may be paused - try accessing it to wake it up.",
          error: "Database connection failed",
        });
      }
      
      return res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // POST /api/case-studies - Create new case study (admin only)
  if (req.method === "POST") {
    const session = await verifyAdmin(req, res);
    if (!session) return;

    try {
      const validationResult = caseStudySchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      // Check if slug already exists
      const existing = await prisma.caseStudy.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        return res.status(400).json({
          message: "A case study with this slug already exists",
        });
      }

      const caseStudy = await prisma.caseStudy.create({
        data: {
          title: data.title,
          slug: data.slug,
          summary: data.summary,
          stack: data.stack,
          coverImageUrl: data.coverImageUrl || null,
          body: data.body,
          published: data.published,
        },
      });

      return res.status(201).json({
        message: "Case study created successfully",
        caseStudy,
      });
    } catch (error: any) {
      console.error("Error creating case study:", error);

      if (error.code === "P2002") {
        return res.status(400).json({
          message: "A case study with this slug already exists",
        });
      }

      if (error.code === "P1001") {
        return res.status(503).json({
          message: "Database connection error. Please ensure your database is running and accessible. If using Neon, the database may be paused - try accessing it to wake it up.",
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

