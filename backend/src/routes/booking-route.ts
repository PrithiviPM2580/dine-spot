import { Router } from "express";
import { requireAuth } from "../middlewares/auth-middleware";
import { validateRequest } from "../middlewares/validate-request-middleware";
import {
  cancelBookingParamsSchema,
  createBookingSchema,
} from "../validation/booking-validation";
import { asyncHandler } from "../middlewares/async-handler-middleware";
import {
  cancelBooking,
  createBooking,
  getMyBookings,
} from "../controllers/booking-controller";
import { requireRole } from "../middlewares/role-middleware";

const bookingRouter = Router();

bookingRouter
  .route("/")
  .post(
    requireAuth,
    requireRole("user"),
    validateRequest({ body: createBookingSchema }),
    asyncHandler(createBooking),
  );

bookingRouter
  .route("/my")
  .get(requireAuth, requireRole("user"), asyncHandler(getMyBookings));

bookingRouter
  .route("/:id/cancel")
  .put(
    requireAuth,
    requireRole("user"),
    validateRequest({ params: cancelBookingParamsSchema }),
    asyncHandler(cancelBooking),
  );

export default bookingRouter;
