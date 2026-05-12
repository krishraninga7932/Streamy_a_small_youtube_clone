import express from "express"
import { uploadVideo } from "../controllers/upload.controller.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

router.post("/upload-video", upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
]), uploadVideo) 


export default router;