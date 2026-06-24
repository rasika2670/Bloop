import {asyncHandler} from 'express-async-handler';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});