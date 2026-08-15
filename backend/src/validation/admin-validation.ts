import mongoose from "mongoose";
import { z } from "zod";

export const approveRestaurantSchema = z.object({
  status: z.enum(["approved", "rejected", "pending"]),
});

export const approveRestaurantParamsSchema = z.object({
  id: z
    .string()
    .refine((id) => mongoose.isObjectIdOrHexString(id), {
      error: "Invalid Restuarant ID",
    }),
});

export type ApproveRestaurantSchema = z.infer<typeof approveRestaurantSchema>;
export type ApproveRestaurantParamsSchema = z.infer<
  typeof approveRestaurantParamsSchema
>;
