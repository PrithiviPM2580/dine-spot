import type { Response, NextFunction, Request } from "express";
import type { TypeRequest } from "../types";
import { APIError } from "../utils/api-error-util";
import type {
  GetRestaurantAvailabilityParams,
  GetRestaurantAvailabilityQuery,
  GetRestaurantBySlugParams,
  GetResturantsQuery,
} from "../validation/restaurant-validation";
import Restaurant, { type IRestaurant } from "../models/restaurant-model";
import type { QueryFilter } from "mongoose";
import Booking from "../models/booking-model";

export const getResturants = async (
  req: TypeRequest<unknown, unknown, GetResturantsQuery>,
  res: Response,
  next: NextFunction,
) => {
  const { search, priceRange, rating, location, sort, page, limit } = req.query;

  const filters: QueryFilter<IRestaurant> = {
    status: "approved",
  };

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  if (priceRange) {
    filters.priceRange = priceRange;
  }

  if (rating !== undefined) {
    filters.rating = { $gte: rating };
  }

  if (location) {
    filters.location = {
      $regex: location,
      $options: "i",
    };
  }

  let sortOptions: Record<string, 1 | -1> = {
    createdAt: -1,
  };

  switch (sort) {
    case "rating":
      sortOptions = { rating: -1 };
      break;

    case "price_low":
      sortOptions = { priceRange: 1 };
      break;

    case "price_high":
      sortOptions = { priceRange: -1 };
      break;

    case "newest":
    default:
      sortOptions = { createdAt: -1 };
      break;
  }

  const skip = (page - 1) * limit;

  const [restaurants, total] = await Promise.all([
    Restaurant.find(filters).sort(sortOptions).skip(skip).limit(limit).lean(),

    Restaurant.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    status: "success",
    message: "Restaurants fetched successfully",
    data: {
      restaurants,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
};

export const getFreaturedResturants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const featured = await Restaurant.find({
    status: "approved",
    $or: [{ featured: true }, { exclusive: true }],
  })
    .limit(6)
    .lean();

  if (!featured || featured.length === 0) {
    return next(APIError.NotFound("No featured restaurants found"));
  }

  return res.status(200).json({
    status: "success",
    message: "Featured restaurants fetched successfully",
    data: {
      featured,
    },
  });
};

export const getResturantBySlug = async (
  req: TypeRequest<unknown, GetRestaurantBySlugParams>,
  res: Response,
  next: NextFunction,
) => {
  const { slug } = req.params;

  const restaurant = await Restaurant.findOne({ slug });

  if (!restaurant) {
    return next(APIError.NotFound("Restaurant not found"));
  }

  if (restaurant.status !== "approved") {
    return next(APIError.Forbidden("Restaurant is not approved"));
  }

  return res.status(200).json({
    status: "success",
    message: "Restaurant fetched successfully",
    data: {
      restaurant,
    },
  });
};

export const getResturantAvailability = async (
  req: TypeRequest<
    unknown,
    GetRestaurantAvailabilityParams,
    GetRestaurantAvailabilityQuery
  >,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { date } = req.query;

  const resturant = await Restaurant.findById(id);

  if (!resturant) {
    return next(APIError.NotFound("Restaurant not found"));
  }

  const bookingDate = new Date(date as string);

  const bookings = await Booking.find({
    restaurant: resturant._id,
    date: bookingDate,
    status: "confirmed",
  });

  const availability = resturant.availableSlots.map((slot) => {
    const bookedSeats = bookings
      .filter((b) => b.time === slot)
      .reduce((acc, b) => acc + b.guests, 0);

    const totalAvailableSeats = resturant.totalSets || 20;
    const availableSeats = Math.max(totalAvailableSeats - bookedSeats, 0);

    return {
      time: slot,
      availableSeats,
      isAvailable: availableSeats > 0,
    };
  });

  return res.status(200).json({
    status: "success",
    message: "Restaurant availability fetched successfully",
    data: {
      date: bookingDate,
      availability,
    },
  });
};
