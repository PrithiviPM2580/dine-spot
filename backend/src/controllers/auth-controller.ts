import type { Response, NextFunction, Request } from "express";
import type { TypeRequest } from "../types";
import type { LoginInput, RegisterInput } from "../validation/auth-validation";
import User from "../models/user-model";
import { APIError } from "../utils/api-error-util";
import { signToken } from "../utils/jwt-utils";

export const register = async (
  req: TypeRequest<RegisterInput>,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(APIError.Conflict("User with this email already exists"));
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: {
      user: userResponse,
      token,
    },
  });
};

export const login = async (
  req: TypeRequest<LoginInput>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(APIError.Unauthorized("Invalid email or password"));
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return next(APIError.Unauthorized("Invalid email or password"));
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      user: userResponse,
      token,
    },
  });
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(APIError.Unauthorized("User not authenticated"));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(APIError.NotFound("User not found"));
  }

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(200).json({
    status: "success",
    message: "User retrieved successfully",
    data: {
      user: userResponse,
    },
  });
};
