import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (isImage) {
      return {
        folder: "relay-chat",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [{ width: 1200, crop: "limit" }],
      };
    }

    if (isVideo) {
      return {
        folder: "relay-chat",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "avi", "webm"],
      };
    }

    // Raw files (PDF, DOCX, XLSX, ZIP, TXT, etc.)
    // Note: Do NOT pass allowed_formats or transformation for raw files; Cloudinary API rejects them.
    return {
      folder: "relay-chat",
      resource_type: "raw",
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
