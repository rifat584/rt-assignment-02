import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

// Handles -> Endpoint creation, connecting routes to controller
router.get("/login", AuthController.login);
router.get("/register", AuthController.register);
router.get("/change-password", AuthController.changePassword);
router.get("/forgot-password", AuthController.forgotPassword);

export const AuthRoutes = router;
