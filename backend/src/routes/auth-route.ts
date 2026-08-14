import { Router } from "express";
import { validateRequest } from "../middlewares/validate-request-middleware";
import { loginSchema, registerSchema } from "../validation/auth-validation";
import { asyncHandler } from "../middlewares/async-handler-middleware";
import { getMe, login, register } from "../controllers/auth-controller";
import { requireAuth } from "../middlewares/auth-middleware";

const authRouter: Router = Router();

authRouter
  .route("/register")
  .post(validateRequest({ body: registerSchema }), asyncHandler(register));

authRouter
  .route("/login")
  .post(validateRequest({ body: loginSchema }), asyncHandler(login));

authRouter.route("/me").get(requireAuth, asyncHandler(getMe));

export default authRouter;
