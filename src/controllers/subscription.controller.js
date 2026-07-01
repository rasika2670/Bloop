import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    if (userId === channelId) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const subscribedChannel = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });

    if (subscribedChannel) {
        await Subscription.findByIdAndDelete(subscribedChannel._id);
        res.status(200).json({
            success: true,
            message: "Unsubscribed successfully",
        });
    } else {
        await Subscription.create({
            subscriber: userId,
            channel: channelId,
        });
        res.status(200).json({
            success: true,
            message: "Subscribed successfully",
        });
    }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    const subscribers = await Subscription.find({
        channel: channelId,
    });

    res.status(200).json({
        success: true,
        message: "Subscribers fetched successfully",
        data: subscribers,
    });
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!subscriberId) {
        throw new ApiError(400, "Subscriber ID is required");
    }

    const subscribedChannels = await Subscription.find({
        subscriber: subscriberId,
    });

    res.status(200).json({
        success: true,
        message: "Subscribed channels fetched successfully",
        data: subscribedChannels,
    });
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
}