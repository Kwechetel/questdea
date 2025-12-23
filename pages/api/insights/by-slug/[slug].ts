import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

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
    const insight = await prisma.insight.findUnique({
      where: { slug },
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

