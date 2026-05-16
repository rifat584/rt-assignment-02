import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequestData from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";

const router:Router = Router();

// Handles -> Endpoint creation, connecting routes to controller
router.get("/login",
  // validateRequestData(AuthValidation.loginSchema),
  AuthController.login);
router.post("/register", validateRequestData(AuthValidation.registerSchema), AuthController.register);
router.get("/change-password", AuthController.changePassword);
router.get("/forgot-password", AuthController.forgotPassword);

export const AuthRoutes = router;
