import { ApiResponse } from "../utils/ApiResponse.js";

const healthcheck = async (req, res) => {
    try {
        return res.status(200).json(new ApiResponse(200, {
            message : "OK"
        }));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal Server Error", error.message));
    }
}

export {
  healthcheck
}