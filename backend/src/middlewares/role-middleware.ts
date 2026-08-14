import type { Request, Response, NextFunction } from "express";
import { APIError } from "../utils/api-error-util";
import type { Role } from "../types";

export const requireRole = (...roles: readonly Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(APIError.Unauthorized("User not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(APIError.Forbidden("User does not have the required role"));
    }

    return next();
  };
};
