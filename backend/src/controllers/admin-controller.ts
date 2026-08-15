import type { Response, NextFunction, Request } from "express";
import type { TypeRequest } from "../types";
import { APIError } from "../utils/api-error-util";
import Resturant from "../models/restaurant-model";
import type {
  ApproveRestaurantParamsSchema,
  ApproveRestaurantSchema,
} from "../validation/admin-validation";
import User from "../models/user-model";
import Booking from "../models/booking-model";

export const getAllRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const restuarants = await Resturant.find().populate("owner", "name email");

  if (!restuarants) {
    return next(APIError.NotFound("No restaurants found"));
  }

  return res.status(200).json({
    status: "success",
    message: "Restaurants fetched successfully",
    data: {
      restuarants,
    },
  });
};

export const approveRestaurant = async (
  req: TypeRequest<ApproveRestaurantSchema, ApproveRestaurantParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { status } = req.body;
  const { id } = req.params;

  const restaurant = await Resturant.findById(id);

  if (!restaurant) {
    return next(APIError.NotFound("Restaurant not found"));
  }

  restaurant.status = status;
  await restaurant.save();

  return res.status(200).json({
    status: "success",
    message: "Restaurant status updated successfully",
    data: {
      restaurant,
    },
  });
};

export const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [
    totalUsers,
    totalOwners,
    totalBookings,
    totalRestaurants,
    latestBookings,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "owner" }),
    Booking.countDocuments(),
    Resturant.countDocuments(),
    Booking.find()
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  return res.status(200).json({
    status: "success",
    message: "Admin stats fetched successfully",
    data: {
      users: {
        totalUsers,
        totalOwners,
        total: totalUsers + totalOwners,
      },
      restaurants: {
        totalRestaurants,
      },
      bookings: {
        totalBookings,
      },
      latestBookings,
    },
  });
};
