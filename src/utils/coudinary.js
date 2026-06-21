import {v2 as cloudinary} from "cloudinary"; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file, folder) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // file is uploaded successfull
        console.log("File uploaded successfully to Cloudinary", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the file from local storage if upload fails
        return null;
    }
};

