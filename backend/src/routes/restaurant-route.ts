import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler-middleware";
import {
  getResturants,
  getFreaturedResturants,
  getResturantAvailability,
  getResturantBySlug,
} from "../controllers/restaurant-controller";
import { validateRequest } from "../middlewares/validate-request-middleware";
import {
  getRestaurantAvailabilityParamsSchema,
  getRestaurantAvailabilityQuerySchema,
  getRestaurantBySlugParamsSchema,
  getResturantsQuerySchema,
} from "../validation/restaurant-validation";

const restaurantRouter = Router();

restaurantRouter
  .route("/")
  .get(
    validateRequest({ query: getResturantsQuerySchema }),
    asyncHandler(getResturants),
  );

restaurantRouter.route("/featured").get(asyncHandler(getFreaturedResturants));

restaurantRouter
  .route("/:slug")
  .get(
    validateRequest({ params: getRestaurantBySlugParamsSchema }),
    asyncHandler(getResturantBySlug),
  );

restaurantRouter.route("/:id/availability").get(
  validateRequest({
    params: getRestaurantAvailabilityParamsSchema,
    query: getRestaurantAvailabilityQuerySchema,
  }),
  asyncHandler(getResturantAvailability),
);

export default restaurantRouter;
