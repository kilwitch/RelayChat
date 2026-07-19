import { Router, type Request, type Response } from "express";
import { upload } from "../config/cloudinary.config.js";

const router = Router();

router.post("/", upload.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    
    const file = req.file as Express.Multer.File & {
      path: string;
      mimetype: string;
    };

    return res.status(200).json({
      url: file.path,            // Public Cloudinary URL
      type: file.mimetype,       // e.g. "image/png", "application/pdf"
      fileName: file.originalname, // original filename for display in chat
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
});

export default router;
