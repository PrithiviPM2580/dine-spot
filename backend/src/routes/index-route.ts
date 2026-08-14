import { Router, type Request, type Response } from "express";
import authRouter from "./auth-route";
import restaurantRouter from "./restaurant-route";
import bookingRouter from "./booking-route";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the API!" });
});

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

router.use("/api/auth", authRouter);
router.use("/api/restaurants", restaurantRouter);
router.use("/api/bookings", bookingRouter);

export default router;
