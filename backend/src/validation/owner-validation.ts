import mongoose from "mongoose";
import { z } from "zod";

export const createOwnerRestaurantSchema = z.object({
  name: z
    .string()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(100, "Restaurant name must be less than 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  cuisine: z
    .string()
    .min(2, "Cuisine is required")
    .max(50, "Cuisine must be less than 50 characters"),

  priceRange: z.enum(["$", "$$", "$$$", "$$$$"]),

  location: z
    .string()
    .min(2, "Location is required")
    .max(100, "Location must be less than 100 characters"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),

  chef: z
    .string()
    .min(2, "Chef name must be at least 2 characters")
    .max(100, "Chef name must be less than 100 characters"),

  tags: z.array(z.string().min(1, "Tag cannot be empty")).default([]),

  availableSlots: z
    .array(z.string().min(1, "Available slot cannot be empty"))
    .default([]),

  totalSets: z
    .number()
    .int("Total sets must be a whole number")
    .min(1, "Total sets must be at least 1")
    .default(20),
});

export const updateOwnerRestaurantSchema =
  createOwnerRestaurantSchema.partial();

export const updateBookingStatusSchema = z.object({
  status: z.enum(["confirmed", "cancelled", "completed"]),
});

export const updateBookingStatusParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isObjectIdOrHexString(id), {
    error: "Invalid booking ID",
  }),
});

export type CreateOwnerRestaurantSchema = z.infer<
  typeof createOwnerRestaurantSchema
>;
export type UpdateOwnerRestaurantSchema = z.infer<
  typeof updateOwnerRestaurantSchema
>;

export type UpdateBookingStatusSchema = z.infer<
  typeof updateBookingStatusSchema
>;

export type UpdateBookingStatusParamsSchema = z.infer<
  typeof updateBookingStatusParamsSchema
>;
