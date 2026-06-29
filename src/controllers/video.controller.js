import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deletePrevAvatar } from "../utils/deletePrevAvatar.js";

const getAllVideos = asyncHandler(async (req, res) => {

    try {
        //fetch all videos
        const videos = await Video.find();

        //check if videos are fetched successfully
        if (!videos) {
            throw new ApiError(404, "Videos not found")
        }

        //return response
        res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"))
    } catch (error) {
        throw new ApiError(500, "Error fetching videos")
    }
})

const publishVideo = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const { title, description } = req.body

    if (!title?.trim()) {
        throw new ApiError(400, "Title is required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    // upload on cloudinary
    const uploadedVideo = await uploadOnCloudinary(videoFileLocalPath)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!uploadedVideo) {
        throw new ApiError(500, "Error uploading video file")
    }

    if (!uploadedThumbnail) {
        throw new ApiError(500, "Error uploading thumbnail file")
    }

    // create video object
    const newVideo = await Video.create({
        title,
        description: description || "",
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        duration: uploadedVideo.duration || 0,
        owner: userId
    })

    return res
        .status(201)
        .json(new ApiResponse(201, newVideo, "Video uploaded successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId?.trim()) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId?.trim()) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Verify if the current user is the owner of the video
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this video");
    }

    const { title, description } = req.body;

    if (title?.trim()) {
        video.title = title;
    }

    if (description?.trim()) {
        video.description = description;
    }

    // Handle thumbnail upload if provided
    const thumbnailLocalPath = req.file?.path;
    if (thumbnailLocalPath) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!uploadedThumbnail?.url) {
            throw new ApiError(500, "Error uploading thumbnail");
        }

        // Delete old thumbnail from cloudinary
        if (video.thumbnail) {
            await deletePrevAvatar(video.thumbnail);
        }

        video.thumbnail = uploadedThumbnail.url;
    }

    const updatedVideo = await video.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId?.trim()) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to delete this video");
    }

    await video.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"));

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId?.trim()) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You do not have permission to toggle publish status");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Publish status toggled successfully"));

})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}   