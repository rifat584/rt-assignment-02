import z from "zod";

const loginSchema = z.email("Email should be valid");

const registerSchema = z.object({
  name: z.string().min(3, "The name must have a minimum 3 character"),
});

const forgotPasswordSchema = z.email("Email should be valid");

const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(6, "The password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password don't match",
    path: ["confirmNewPassword"], //Sets the error on the confirmPassword field
  });

export const AuthValidation = {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  changePasswordSchema,
};
