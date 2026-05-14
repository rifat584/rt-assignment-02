import { NextFunction, Request, Response } from "express";
import env from "../../config/env";
import { errResponse } from "../../types/response";

const globalError = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  const errResponse: errResponse = {
    success: false,
    message,
  };

  if (env.NODE_ENV === "development") {
    errResponse.stack = err.stack;
    errResponse.error = err;
  }

  res.status(statusCode).json(errResponse);
};

export default globalError;
