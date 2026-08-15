import multer from "multer";
import { APIError } from "../utils/api-error-util";
import type { Request, Response, NextFunction } from "express";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(APIError.BadRequest("Only image files are allowed"));
    }
    cb(null, true);
  },
});
