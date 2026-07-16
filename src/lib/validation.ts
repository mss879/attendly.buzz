import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.email("Please enter a valid email address").trim().max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9()\s-]{7,20}$/, "Please enter a valid phone number"),
  batch: z.string().trim().regex(/^(19|20)\d{2}$/, "Please select your batch"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const SLIP_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export const SLIP_ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};
