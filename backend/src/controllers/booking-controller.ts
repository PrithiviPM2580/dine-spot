import type { Response, NextFunction, Request } from "express";
import type { TypeRequest } from "../types";
import { APIError } from "../utils/api-error-util";
import type { QueryFilter } from "mongoose";
import Booking from "../models/booking-model";
import type {
  CancelBookingParams,
  CreateBookingInput,
} from "../validation/booking-validation";
import Resturant from "../models/restaurant-model";
import { date } from "zod";

export const createBooking = async (
  req: TypeRequest<CreateBookingInput>,
  res: Response,
  next: NextFunction,
) => {
  const { date, guests, restaurantId, occasion, specialRequests, time } =
    req.body;

  const restaurant = await Resturant.findById(restaurantId);

  if (!restaurant) {
    return next(APIError.NotFound("Restaurant not found"));
  }

  if (restaurant.status !== "approved") {
    return next(APIError.BadRequest("Restaurant is not approved for booking"));
  }

  const existingBookings = await Booking.find({
    restaurant: restaurantId,
    data: new Date(date),
    time,
    status: "confirmed",
  });

  const bookedSeats = existingBookings.reduce(
    (acc, booking) => acc + booking.guests,
    0,
  );

  const totalSeats = restaurant.totalSets || 20;

  const availableSeats = totalSeats - bookedSeats;

  if (availableSeats < guests) {
    return next(
      APIError.BadRequest(
        "Not enough available seats for the selected time slot",
      ),
    );
  }

  const booking = await Booking.create({
    user: req.user?.id,
    restaurant: restaurantId,
    date: new Date(date),
    time,
    guests,
    occasion,
    specialRequests,
    status: "confirmed",
  });

  const pupulatedBooking = await booking.populate(
    "restaurant",
    "name location image address",
  );

  return res.status(201).json({
    status: "success",
    message: "Booking created successfully",
    data: {
      booking: pupulatedBooking,
    },
  });
};

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bookings = await Booking.find({ user: req.user?.id })
    .populate("restaurant", "name location image address slug")
    .sort({ date: -1, time: -1 });

  return res.status(200).json({
    status: "success",
    message: "Bookings fetched successfully",
    data: {
      bookings,
    },
  });
};

export const cancelBooking = async (
  req: TypeRequest<unknown, CancelBookingParams>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    return next(APIError.NotFound("Booking not found"));
  }

  if (booking.user.toString() !== req.user?.id) {
    return next(
      APIError.Forbidden("You are not authorized to cancel this booking"),
    );
  }

  booking.status = "cancelled";
  await booking.save();

  const pupulatedBooking = await booking.populate(
    "restaurant",
    "name location image address",
  );

  return res.status(200).json({
    status: "success",
    message: "Booking cancelled successfully",
    data: {
      booking: pupulatedBooking,
    },
  });
};
