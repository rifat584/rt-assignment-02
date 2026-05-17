// Handles ->business logic, DB logic, data processing, returning result to controller
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import {
  loginSchemaType,
  registerSchemaType,
  verifyEmailSchemaType,
} from "./auth.validation";

const login = async (payload: loginSchemaType) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (!user) {
    const err = new Error("User not found!");
    throw err;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const err = new Error("Invalid Email or Password!");
    throw err;
  }
  return user.email;
};

const register = async (payload: registerSchemaType) => {
  const { name, email, password } = payload;

  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  console.log(findUser);

  if (findUser) {
    const err = new Error("User Already Exits!");
    throw err;
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

const verifyEmail = async (payload: verifyEmailSchemaType) => {
  console.log(payload);
  return payload;
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
