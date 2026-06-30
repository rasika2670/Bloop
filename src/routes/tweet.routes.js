import { Router } from "express";
import {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/').get(verifyJWT, getUserTweets);
router.route('/').post(verifyJWT, createTweet);
router.route('/:id').put(verifyJWT, updateTweet);
router.route('/:id').delete(verifyJWT, deleteTweet);

export default router;
