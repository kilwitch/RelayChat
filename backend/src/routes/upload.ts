import { Router, type Request, type Response } from "express";
import { upload } from "../config/cloudinary.config.js";

const router = Router();

/**
 * POST /api/upload
 * Accepts a single "file" field, uploads it to Cloudinary,
 * and returns the public URL + MIME type.
 */
router.post("/", upload.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // multer-storage-cloudinary attaches the Cloudinary URL to req.file.path
    const file = req.file as Express.Multer.File & {
      path: string;
      mimetype: string;
    };

    return res.status(200).json({
      url: file.path,        // Public Cloudinary URL
      type: file.mimetype,   // e.g. "image/png", "application/pdf"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
});

export default router;
