import mongoose from "mongoose";
import { z } from "zod";

export const getResturantsQuerySchema = z.object({
  search: z.string().trim().optional(),

  priceRange: z.enum(["$", "$$", "$$$", "$$$$"]).optional(),

  rating: z.coerce.number().min(0).max(5).optional(),

  location: z.string().trim().optional(),

  sort: z
    .enum(["rating", "price_low", "price_high", "newest"])
    .default("newest"),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const getRestaurantBySlugParamsSchema = z.object({
  slug: z.string().trim(),
});

export const getRestaurantAvailabilityQuerySchema = z.object({
  date: z.iso.date(),
});

export const getRestaurantAvailabilityParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isObjectIdOrHexString(id), {
    message: "Invalid restaurant ID",
  }),
});

export type GetResturantsQuery = z.infer<typeof getResturantsQuerySchema>;
export type GetRestaurantBySlugParams = z.infer<
  typeof getRestaurantBySlugParamsSchema
>;
export type GetRestaurantAvailabilityQuery = z.infer<
  typeof getRestaurantAvailabilityQuerySchema
>;
export type GetRestaurantAvailabilityParams = z.infer<
  typeof getRestaurantAvailabilityParamsSchema
>;
