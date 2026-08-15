import type { Response, NextFunction, Request } from "express";
import type { TypeRequest } from "../types";
import { APIError } from "../utils/api-error-util";
import Resturant from "../models/restaurant-model";
import type {
  CreateOwnerRestaurantSchema,
  UpdateBookingStatusParamsSchema,
  UpdateBookingStatusSchema,
  UpdateOwnerRestaurantSchema,
} from "../validation/owner-validation";
import { uploadToCloudinary } from "../utils/cloudinary-util";
import Booking from "../models/booking-model";

export const getOwnerRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const resturant = await Resturant.findOne({ owner: req.user?.id });

  if (!resturant) {
    return next(APIError.NotFound("Resturant not found"));
  }

  return res.status(200).json({
    status: "success",
    message: "Resturant fetched successfully",
    data: {
      resturant,
    },
  });
};

export const createOwnerRestaurant = async (
  req: TypeRequest<CreateOwnerRestaurantSchema>,
  res: Response,
  next: NextFunction,
) => {
  const existingRestaurant = await Resturant.findOne({ owner: req.user?.id });

  if (existingRestaurant) {
    return next(APIError.BadRequest("Owner already has a restaurant"));
  }

  const {
    name,
    description,
    cuisine,
    priceRange,
    location,
    address,
    chef,
    tags,
    availableSlots,
    totalSets,
  } = req.body;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const slugExists = await Resturant.findOne({ slug });

  if (slugExists) {
    return next(
      APIError.BadRequest("Restaurant with this name already exists"),
    );
  }

  let imageUrl = "";
  if (req.file) {
    const { secure_url } = await uploadToCloudinary(
      req.file.buffer,
      "DineSpot",
    );
    imageUrl = secure_url;
  }

  const restaurant = await Resturant.create({
    name,
    slug,
    description,
    cuisine,
    priceRange,
    location,
    address,
    chef,
    tags,
    availableSlots,
    image: imageUrl,
    totalSets: totalSets ? totalSets : 20,
    owner: req.user?.id,
    status: "pending",
  });

  return res.status(201).json({
    status: "success",
    message: "Restaurant created successfully",
    data: {
      restaurant,
    },
  });
};

export const updateOwnerRestaurant = async (
  req: TypeRequest<UpdateOwnerRestaurantSchema>,
  res: Response,
  next: NextFunction,
) => {
  const restaurant = await Resturant.findOne({ owner: req.user?.id });

  if (!restaurant) {
    return next(APIError.NotFound("Restaurant not found"));
  }

  const {
    name,
    description,
    cuisine,
    priceRange,
    location,
    address,
    chef,
    tags,
    availableSlots,
    totalSets,
  } = req.body;

  if (name) restaurant.name = name;
  if (description) restaurant.description = description;
  if (cuisine) restaurant.cuisine = cuisine;
  if (priceRange) restaurant.priceRange = priceRange;
  if (location) restaurant.location = location;
  if (address) restaurant.address = address;
  if (chef) restaurant.chef = chef;
  if (tags) restaurant.tags = tags;
  if (availableSlots) restaurant.availableSlots = availableSlots;
  if (totalSets) restaurant.totalSets = totalSets;

  if (req.file) {
    const { secure_url } = await uploadToCloudinary(
      req.file.buffer,
      "DineSpot",
    );
    restaurant.image = secure_url;
  }

  await restaurant.save();

  return res.status(200).json({
    status: "success",
    message: "Restaurant updated successfully",
    data: {
      restaurant,
    },
  });
};

export const getOwnerBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const restaurant = await Resturant.findOne({ owner: req.user?.id });

  if (!restaurant) {
    return next(APIError.NotFound("Restaurant not found"));
  }

  const bookings = await Booking.find({ restaurant: restaurant._id })
    .populate("user", "name email")
    .sort({ date: -1, time: -1 });

  return res.status(200).json({
    status: "success",
    message: "Bookings fetched successfully",
    data: {
      bookings,
    },
  });
};

export const updateBookingStatus = async (
  req: TypeRequest<UpdateBookingStatusSchema, UpdateBookingStatusParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { status } = req.body;
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    return next(APIError.NotFound("Booking not found"));
  }

  const restaurant = await Resturant.findOne({ owner: req.user?.id });

  if (
    !restaurant ||
    booking.restaurant.toString() !== restaurant._id.toString()
  ) {
    return next(
      APIError.Unauthorized("You are not authorized to update this booking"),
    );
  }

  booking.status = status;
  await booking.save();

  return res.status(200).json({
    status: "success",
    message: "Booking status updated successfully",
    data: {
      booking,
    },
  });
};
