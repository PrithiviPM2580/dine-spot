import jwt from "jsonwebtoken";
import { APIError } from "./api-error-util";
import type { Payload } from "../types";
import { envConfig } from "../config/env-config";

export const signToken = (
  payload: Payload,
  options?: jwt.SignOptions,
): string => {
  return jwt.sign(payload, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRATION,
    ...options,
  });
};

export const verifyToken = (token: string): Payload => {
  try {
    return jwt.verify(token, envConfig.JWT_SECRET) as Payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw APIError.Unauthorized("Authentication token has expired");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw APIError.Unauthorized("Invalid authentication token");
    }

    throw APIError.InternalServerError();
  }
};
