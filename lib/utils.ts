import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authSchema = (type: string) => {
  return z.object({
    firstName:
      type === "login"
        ? z.string().optional()
        : z.string().min(3, "First Name must be at least 3 characters long"),
    lastName:
      type === "login"
        ? z.string().optional()
        : z.string().min(3, "Last Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password:
      type === "sign-up"
        ? z.string().min(8, "Password must be at least 8 characters long")
        : z.string().optional(),
  });
};
