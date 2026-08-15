import { Router } from "express";
import { requireAuth } from "../middlewares/auth-middleware";
import { requireRole } from "../middlewares/role-middleware";
import { asyncHandler } from "../middlewares/async-handler-middleware";
import {
  approveRestaurant,
  getAdminStats,
  getAllRestaurants,
} from "../controllers/admin-controller";
import { validateRequest } from "../middlewares/validate-request-middleware";
import {
  approveRestaurantParamsSchema,
  approveRestaurantSchema,
} from "../validation/admin-validation";

const adminRouter = Router();

adminRouter
  .route("/restaurants")
  .get(requireAuth, requireRole("admin"), asyncHandler(getAllRestaurants));

adminRouter.route("/restaurant/:id/approve").put(
  requireAuth,
  requireRole("admin"),
  validateRequest({
    body: approveRestaurantSchema,
    params: approveRestaurantParamsSchema,
  }),
  asyncHandler(approveRestaurant),
);

adminRouter
  .route("/stats")
  .get(requireAuth, requireRole("admin"), asyncHandler(getAdminStats));

export default adminRouter;
