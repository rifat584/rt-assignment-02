import { Request, Response } from "express";
import { AuthService } from "./auth.service";

// Handles-> Req, Res, Service Call
const login = async (req: Request, res: Response) => {
  const result = await AuthService.login("email@com");
  res.json({
    success: true,
    message: "Login successful",
    data: result,
  });
};

export const  AuthController = {
  login,
};
