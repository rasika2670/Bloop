import { Router } from "express";
import { 
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike
 } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Secure all routes in this file

router.route("/v/:videoId").post(toggleVideoLike);
router.route("/c/:commentId").post(toggleCommentLike);
router.route("/t/:tweetId").post(toggleTweetLike);
router.route("/").get(getLikedVideos);

export default router;
