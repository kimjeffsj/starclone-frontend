import z from "zod";

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Enter Email or Username"),
  password: z.string().min(1, "Enter Password"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
