import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

// GET /api/case-studies/by-slug/[slug] - Get case study by slug (public or admin)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ message: "Invalid slug" });
  }

  try {
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { slug },
    });

    if (!caseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }

    // Check if published or admin
    const session = await getServerSession(req, res, authOptions);
    const isAdmin = session?.user?.role === Role.ADMIN;

    if (!caseStudy.published && !isAdmin) {
      return res.status(404).json({ message: "Case study not found" });
    }

    return res.status(200).json(caseStudy);
  } catch (error) {
    console.error("Error fetching case study by slug:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

