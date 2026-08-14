import mongoose from "mongoose";
import { z } from "zod";

export const createBookingSchema = z.object({
  restaurantId: z.string().refine((id) => mongoose.isObjectIdOrHexString(id), {
    message: "Invalid restaurant id",
  }),
  date: z.iso.date(),
  time: z.string().regex(/^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i, {
    message: "Invalid time format",
  }),
  guests: z
    .number()
    .int()
    .min(1, { message: "Guests must be at least 1" })
    .max(20, { message: "Guests must be at most 20" }),
  occasion: z.string().optional(),
  specialRequests: z.string().optional(),
});

export const cancelBookingParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isObjectIdOrHexString(id), {
    message: "Invalid booking id",
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CancelBookingParams = z.infer<typeof cancelBookingParamsSchema>;
