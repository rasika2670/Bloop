import { Router } from "express";
import {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/').get(getAllVideos)
router.route('/').post(verifyJWT, upload.fields([{ name: 'videoFile', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), publishVideo)
router.route('/:videoId').get(getVideoById)
router.route('/:videoId').patch(verifyJWT, upload.single("thumbnail"), updateVideo)
router.route('/:videoId').delete(verifyJWT, deleteVideo)
router.route('/:videoId').put(verifyJWT, togglePublishStatus)

export default router;
