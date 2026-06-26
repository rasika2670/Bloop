import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

const getPublicIdFromCloudinaryUrl = (assetUrl) => {
    if (!assetUrl || typeof assetUrl !== "string") {
        return null;
    }

    try {
        const url = new URL(assetUrl);
        const uploadSegment = url.pathname.split("/upload/")[1];

        if (!uploadSegment) {
            return null;
        }

        const pathAfterVersion = uploadSegment.replace(/^v\d+\//, "");
        const publicIdWithFolders = pathAfterVersion.replace(/\.[^.\/]+$/, "");

        return publicIdWithFolders || null;
    } catch (error) {
        return null;
    }
};

const deletePrevAvatar = async (assetUrl) => {
    try {
        // Configure inside the function so that env vars are loaded by the time this runs
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const publicId = getPublicIdFromCloudinaryUrl(assetUrl);

        if (!publicId) {
            return null;
        }

        return await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });
    } catch (error) {
        console.error("Error deleting previous avatar:", error);
        throw error;
    }
};

export { deletePrevAvatar };