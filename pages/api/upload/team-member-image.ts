import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Role } from "@prisma/client";
import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";
import { IncomingMessage } from "http";

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

// Disable body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    // Check if BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({
        message: "BLOB_READ_WRITE_TOKEN is not configured. Please add it to your environment variables.",
      });
    }

    // Parse the form data
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req as unknown as IncomingMessage);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({
        message: "No file provided",
      });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.",
      });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(file.filepath);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.originalFilename?.split(".").pop() || "jpg";
    const filename = `team-members/${timestamp}-${randomString}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: "public",
      contentType: file.mimetype,
    });

    // Clean up temporary file
    try {
      fs.unlinkSync(file.filepath);
    } catch (unlinkError) {
      // Ignore unlink errors
      console.warn("Failed to delete temporary file:", unlinkError);
    }

    return res.status(200).json({
      url: blob.url,
      filename: filename,
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    
    // Handle file size errors
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size exceeds 5MB limit",
      });
    }
    
    return res.status(500).json({
      message: "Failed to upload image",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

