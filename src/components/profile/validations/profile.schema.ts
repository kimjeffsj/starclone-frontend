import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().max(150, "Bio must be at most 150 characters").optional(),
  website: z
    .string()
    .url("Website must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
