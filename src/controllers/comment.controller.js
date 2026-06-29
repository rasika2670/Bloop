import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";

const getVideoComments = asyncHandler(async (req,res)=>{
    const{videoId} = req.params;
    const{page = 1 , limit = 10} = req.query;

    const video = await Video.findById(videoId);
    if (!video){
        throw new ApiError(404,"Video not found")
    }
    const comments = await Comment.find({video:videoId}).sort({createdAt:-1})
    
    if (!comments){
        throw new ApiError(404,"Comments not found")
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200,"Comments fetched successfully",{comments}))
    
})
const addComment = asyncHandler(async (req,res)=>{
    const user = req.user;
    const {content} = req.body || {};
    const {videoId} = req.params;
    
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required");
    }

    const video = await Video.findById(videoId);
    if (!video){
        throw new ApiError(404,"Video not found")
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"))
})


const updateComment = asyncHandler(async (req,res)=>{
    const user = req.user;
    const {content} = req.body || {};
    const {commentId} = req.params;

    // find comment by id
    const comment = await Comment.findById(commentId)

    // check if comment exists
    if (!comment){
        throw new ApiError(404,"Comment not found")
    }

    // check if user is owner of comment
    if (comment.owner.toString() !== user._id.toString()){
        throw new ApiError(401,"Unauthorized to update this comment")
    }

    // update comment
    comment.content = content.trim();
    await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req,res)=>{
    const user = req.user;
    const {commentId} = req.params;

    // find comment by id
    const comment = await Comment.findById(commentId)

    // check if comment exists
    if (!comment){
        throw new ApiError(404,"Comment not found")
    }

    // check if user is owner of comment
    if (comment.owner.toString() !== user._id.toString()){
        throw new ApiError(401,"Unauthorized to delete this comment")
    }

    // delete comment
    await comment.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Comment deleted successfully"))
})

export{
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}