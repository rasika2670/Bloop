import mongoose from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Like} from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const videoId = req.params.videoId;

    if(!userId || !videoId) {
        throw new ApiError(400, "User ID and Video ID are required");
    }

    const existingLike = await Like.findOne({ likedBy: userId, video: videoId });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Video unliked successfully"));
    } else {
        const newLike = new Like({ likedBy: userId, video: videoId });
        await newLike.save();
        return res.status(200).json(new ApiResponse(200, newLike, "Video liked successfully"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const commentId = req.params.commentId;

    if(!userId || !commentId) {
        throw new ApiError(400, "User ID and Comment ID are required");
    }

    const existingLike = await Like.findOne({ likedBy: userId, comment: commentId });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Comment unliked successfully"));
    } else {
        const newLike = new Like({ likedBy: userId, comment: commentId });
        await newLike.save();
        return res.status(200).json(new ApiResponse(200, newLike, "Comment liked successfully"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const tweetId = req.params.tweetId;

    if(!userId || !tweetId) {
        throw new ApiError(400, "User ID and Tweet ID are required");
    }

    const existingLike = await Like.findOne({ likedBy: userId, tweet: tweetId });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Tweet unliked successfully"));
    } else {
        const newLike = new Like({ likedBy: userId, tweet: tweetId });
        await newLike.save();
        return res.status(200).json(new ApiResponse(200, newLike, "Tweet liked successfully"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if(!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$video"
        }
    ]);

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export{
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos,
}