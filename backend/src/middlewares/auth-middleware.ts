import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt-utils";
import { APIError } from "../utils/api-error-util";
import User from "../models/user-model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(APIError.Unauthorized("Authorization header missing"));
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(
        APIError.Unauthorized("Authorization header must be Bearer <token>"),
      );
    }

    const payload = verifyToken(token);

    const user = await User.findById(payload.id);

    if (!user) {
      return next(APIError.Unauthorized("User not found"));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};
