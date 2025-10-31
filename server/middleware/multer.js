import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "vehicle_docs", 
        allowed_formats: ['jpg', 'jpeg', 'png',  'pdf'], 
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 
    }
});

export default upload;
