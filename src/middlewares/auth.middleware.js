import { User } from "../models/user.models.js";
import { projectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const secret =
    process.env.ACCESS_SECRET_KEY || process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT access token secret is not configured");
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    throw new ApiError(401, "Invalid access token");
  }
});

export const validateProjectPermission = (roles = []) =>{
    asyncHandler(async (req, res, next) => {
        const {projectId} = req.params;

        if(!projectId) {
            throw new ApiError(404, "Project id is missing")
        }

        const project = await projectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),         
            user: new mongoose.Types.ObjectId(req.user._id),         
        })

        if (!project) {
          throw new ApiError(404, "Project not found");
        }

        const givenRole = project?.role
        req.user.role = givenRole

        if(!roles.includes(givenRole)) {
            throw new ApiError(403, "You do not have the permission to perform this action")
        }

        next()
    })
}
