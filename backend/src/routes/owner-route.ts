import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler-middleware";
import {
  createOwnerRestaurant,
  getOwnerBookings,
  getOwnerRestaurant,
  updateBookingStatus,
  updateOwnerRestaurant,
} from "../controllers/owner-controller";
import { validateRequest } from "../middlewares/validate-request-middleware";
import {
  createOwnerRestaurantSchema,
  updateBookingStatusParamsSchema,
  updateBookingStatusSchema,
  updateOwnerRestaurantSchema,
} from "../validation/owner-validation";
import { upload } from "../middlewares/multer-middleware";
import { requireAuth } from "../middlewares/auth-middleware";
import { requireRole } from "../middlewares/role-middleware";

const ownerRouter: Router = Router();

ownerRouter
  .route("/restaurant")
  .get(requireAuth, requireRole("owner"), asyncHandler(getOwnerRestaurant));

ownerRouter
  .route("/restaurant")
  .post(
    requireAuth,
    requireRole("owner"),
    validateRequest({ body: createOwnerRestaurantSchema }),
    upload.single("image"),
    asyncHandler(createOwnerRestaurant),
  );

ownerRouter
  .route("/restaurant")
  .put(
    requireAuth,
    requireRole("owner"),
    validateRequest({ body: updateOwnerRestaurantSchema }),
    upload.single("image"),
    asyncHandler(updateOwnerRestaurant),
  );

ownerRouter
  .route("/bookings")
  .get(requireAuth, requireRole("owner"), asyncHandler(getOwnerBookings));

ownerRouter
  .route("/bookings/:id/status")
  .put(
    requireAuth,
    requireRole("owner"),
    validateRequest({
      body: updateBookingStatusSchema,
      params: updateBookingStatusParamsSchema,
    }),
    asyncHandler(updateBookingStatus),
  );
export default ownerRouter;
