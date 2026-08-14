import mongoose, { Schema, Types } from "mongoose";
import crypto from "node:crypto";

export interface IBooking {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
  date: Date;
  time: string;
  guests: number;
  occasion?: string;
  specialRequests?: string;
  status: "confirmed" | "cancelled" | "completed";
  bookingId: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    occasion: { type: String, trim: true },
    specialRequests: { type: String, trim: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    bookingId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index(
  { user: 1, restaurant: 1, date: 1, time: 1 },
  { unique: true },
);

bookingSchema.pre("save", function () {
  if (!this.bookingId) {
    this.bookingId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  }
});

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
