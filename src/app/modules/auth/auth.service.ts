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

  // Find the user
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // Throw Error if user doesn't exist/unverified email
  if (!user) {
    const err = new Error("Invalid Email or Password!");
    throw err;
  } else if (!user.isEmailVerified) {
    const err = new Error("Please verify your email address!");
    throw err;
  }

  // Match user's password against our DB
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const err = new Error("Invalid Email or Password!");
    throw err;
  }

  return { id: user.id, email: user.email, name: user.name };
};

// Register Logic
const register = async (payload: registerSchemaType) => {
  const { name, email, password } = payload;

  // Find user
  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // If user already exist
  if (findUser) {
    const err = new Error("User Already Exits!");
    throw err;
  }

  const hashedPassword: string = await bcrypt.hash(password, 10); //pass hashing
  const verificationCode = crypto.randomInt(100000, 1000000).toString(); //generate verification code
  const expirationTime = 24 * 60 * 60 * 1000; //24 Hour
  const expiresAtDate = new Date(Date.now() + expirationTime); //+24h

  // insert user and verification code to DB
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword, //store only hashed password
      },
    });

    const emailVerificationCode = await tx.verificationCode.create({
      data: {
        userId: user.id,
        code: verificationCode,
        expiresAt: expiresAtDate,
      },
    });
    return { user, emailVerificationCode };
  });

  // Send verification code to email
  sendVerificationEmail(result.user.email, verificationCode).catch((error) => {
    console.error("Failed to send verification email:", error);
  });

  return result;
};

// Email Verification Logic
const verifyEmail = async (payload: verifyEmailSchemaType) => {
  const { email, code } = payload;

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // if user doesn't exist in DB
  if (!user) {
    const err = new Error("User not found!");
    throw err;
  }

  // find the verification code
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
      createdAt: "desc", //so only the latest codes are checked
    },
  });

  // check if there's any verification code
  if (!validate) {
    const err = new Error("No verification code found!");
    throw err;
  }
  // check if the code is used
  if (validate.isUsed) {
    const err = new Error("Invalid Code! This code has already been used.");
    throw err;
  }
  // verify expires date
  if (new Date() > validate.expiresAt) {
    const err = new Error("Verification Code Expired!");
    throw err;
  }

  // Update email verification and code use status
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
    return { updateEmailVerificationStatus, updateIsCodeUsed };
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
