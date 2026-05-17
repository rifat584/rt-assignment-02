import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../../utils/ApiResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

// Handles-> Req, Res, Service Call
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login Successful",
  });
});

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Register successful",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmail(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email Verification successful",
  });
});

const changePassword = async (req: Request, res: Response) => {
  const result = await AuthService.changePassword({
    oldPassword: "old",
    newPassword: "new",
    confirmNewPassword: "confirmed",
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Changed Successfully",
    data: result,
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword("myemail@gmail.com");
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset mail sent!",
    data: result,
  });
};

export const AuthController = {
  login,
  register,
  verifyEmail,
  changePassword,
  forgotPassword,
};
