import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../../utils/ApiResponse";
import httpStatus from "http-status";

// Handles-> Req, Res, Service Call
const login = async (req: Request, res: Response) => {
  const result = await AuthService.login("email@com");
  res.json({
    success: true,
    message: "Login successful",
    data: result,
  });
};

const register = async (req: Request, res: Response) => {
  const result = await AuthService.register({
    name: "Rifat",
    email: "rifat@gmail.com",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
};

const changePassword = async (req: Request, res: Response) => {
  const result = await AuthService.changePassword({
    oldPassword: "old",
    newPassword: "new",
    confirmNewPassword: "confirmed",
  });
  res.json({
    success: true,
    message: "Password Changed Successfully",
    data: result,
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword("myemail@gmail.com");
  res.json({
    success: true,
    message: "Password reset mail sent!",
    data: result,
  });
};

export const AuthController = {
  login,
  register,
  changePassword,
  forgotPassword,
};
