import {v2 as cloudinary} from "cloudinary"; 
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Configure inside the function so that env vars are loaded by the time this runs
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // file is uploaded successfull
        //console.log("File uploaded successfully to Cloudinary", response.url);
        fs.unlinkSync(localFilePath); // remove locally after successful upload
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

export {uploadOnCloudinary};