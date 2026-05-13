import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

// Handles -> Endpoint creation, connecting routes to controller
router.get("/login", AuthController.login);

export const AuthRoutes = router;
