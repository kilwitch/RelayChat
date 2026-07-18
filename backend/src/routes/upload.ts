import { type Response, type Request, Router} from "express";

import { upload } from "../config/cloudinary.config.js";


const router=Router();

//post api/upload
router.post("/", upload.single("file"), (req:Request, res:Response)=>{
    try {
        if(!req.file){
            return res.status(400).json({message:"no file uploaded"});
        }

        const file= req.file as Express.Multer.File & {
            path:string; // cloudinary url
            mimetype:string;
        }

        return res.status(200).json({
            url:file.path,
            type:file.mimetype,
        })
    } catch (error) {
        return res.status(500).json({message:"upload failed", error});
    }
})

export default router;