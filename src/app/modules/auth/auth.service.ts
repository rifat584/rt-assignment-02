// Handles ->business logic, DB logic, data processing, returning result to controller
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { prisma } from "../../../lib/prisma";
import {
  loginSchemaType,
  registerSchemaType,
  verifyEmailSchemaType,
} from "./auth.validation";
import { boolean } from "zod";
import { sendVerificationEmail } from "../../../lib/sendEmail";

// Login Logic
const login = async (payload: loginSchemaType) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    const err = new Error("User not found!");
    throw err;
  } else if (!user.isEmailVerified) {
    const err = new Error("Please verify your email address!");
    throw err;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const err = new Error("Invalid Email or Password!");
    throw err;
  }
  return user.email;
};

// Register Logic
const register = async (payload: registerSchemaType) => {
  const { name, email, password } = payload;

  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (findUser) {
    const err = new Error("User Already Exits!");
    throw err;
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);
  const verificationCode = crypto.randomInt(100000, 1000000).toString();
  const expirationTime = 15 * 60 * 1000; //15 Minutes
  const expiresAtDate = new Date(Date.now() + expirationTime);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const emailVerificationCode = await tx.verificationCode.create({
      data: {
        userId: user.id,
        code: verificationCode,
        expiresAt: expiresAtDate,
      },
    });
    const result = { user, emailVerificationCode };
    return result;
  });

  try {
    await sendVerificationEmail(result.user.email, verificationCode);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  return result;
};

// Email Verification Logic
const verifyEmail = async (payload: verifyEmailSchemaType) => {
  const { email, code } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const err = new Error("User not found!");
    throw err;
  }

  const validate = await prisma.verificationCode.findFirst({
    where: {
      userId: user.id,
      code: code,
    },
    select: {
      id: true,
      isUsed: true,
      expiresAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!validate) {
    const err = new Error("No verification code found!");
    throw err;
  }

  if (validate.isUsed) {
    const err = new Error("Invalid Code! This code has already been used.");
    throw err;
  }

  if (new Date() > validate.expiresAt) {
    const err = new Error("Verification Code Expired!");
    throw err;
  }

  const result = await prisma.$transaction(async (tx) => {
    const updateEmailVerificationStatus = await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
      },
    });

    const updateIsCodeUsed = await tx.verificationCode.update({
      where: {
        id: validate.id,
      },
      data: {
        isUsed: true,
      },
    });
    const result = { updateEmailVerificationStatus, updateIsCodeUsed };
    return result;
  });

  return result;
};

const changePassword = async (payload: object) => {
  return payload;
};

const forgotPassword = async (payload: string) => {
  return payload;
};

export const AuthService = {
  login,
  register,
  verifyEmail,
  changePassword,
  forgotPassword,
};
