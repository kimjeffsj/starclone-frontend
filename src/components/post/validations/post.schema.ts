import { z } from "zod";

export const formSchema = z.object({
  caption: z
    .string()
    .max(2200, "You can enter up to 2200 characters.")
    .optional(),
  location: z
    .string()
    .max(100, "You can enter up to 100 characters.")
    .optional()
    .transform((val) => (val === "" ? undefined : val)), // Empty string to undefined to pass validation in backend
});

export type FormInput = z.infer<typeof formSchema>;
