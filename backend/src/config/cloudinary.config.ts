import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

// multer store files direct to cloudinary
const storage=new CloudinaryStorage({
    cloudinary,
    params: async(req, file)=>{
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");

        return {
            folder:"relay-chat",
            resource_type: isImage ? "image" : isVideo ? "video" : "raw",
            allowed_formats:["jpg","jpeg", "png", "gif", "webp", "pdf", "mp4", "doc", "docx"],
            // Only apply image transformations to actual images
            ...(isImage && { transformation:[{width:1200, crop:"limit"}] }),
        };
    },
})

export const upload= multer({
    storage,
    limits:{fileSize: 10*1024*1024}, //10mb max
})


