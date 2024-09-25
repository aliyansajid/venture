import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authSchema = (type: string) => {
  return z.object({
    firstName:
      type === "login"
        ? z.string().optional()
        : z
            .string({ required_error: "First name is required" })
            .min(3, "First Name must be at least 3 characters long"),
    lastName:
      type === "login"
        ? z.string().optional()
        : z
            .string({ required_error: "Last name is required" })
            .min(3, "Last Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password:
      type === "sign-up"
        ? z
            .string({ required_error: "Password is required" })
            .min(8, "Password must be at least 8 characters long")
        : z.string().optional(),
  });
};

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const userEditSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
});

export const teamSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  teamLead: z.string().min(1, "Team lead is required"),
  teamMembers: z
    .array(z.string().min(1))
    .min(1, "At least one team member is required")
    .max(10, "You can select up to 10 team members"),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  team: z.string({ required_error: "Team is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  priority: z.string({ required_error: "Priority is required" }),
  status: z.string().optional(),
  budget: z.preprocess(
    (val) => (val !== "" ? Number(val) : undefined),
    z.number().int().optional()
  ),
  client: z.string().optional(),
});

export const roleDisplayNames: { [key: string]: string } = {
  admin: "Admin",
  "team-lead": "Team Lead",
  "team-member": "Team Member",
  client: "Client",
};

export const getInitials = (name: string) => {
  if (!name) return "US";
  const nameArray = name.split(" ");
  const initials =
    nameArray.length > 1
      ? nameArray
          .map((word) => word[0])
          .join("")
          .toUpperCase()
      : nameArray[0][0].toUpperCase();
  return initials.slice(0, 2);
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("en-US", options).replace(",", " -");
};

export const tagColors = [
  { text: "text-yellow-base", bg: "bg-background-yellow" },
  { text: "text-green-base", bg: "bg-background-green" },
  { text: "text-blue-base", bg: "bg-background-blue" },
  { text: "text-purple-base", bg: "bg-background-purple" },
  { text: "text-orange-base", bg: "bg-background-orange" },
];

export const sanitizeAndStyleHtml = (html: string) => {
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: [
      "b",
      "i",
      "u",
      "strike",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "div",
      "span",
      "br",
      "hr",
      "blockquote",
      "strong",
      "em",
      "input",
    ],
    allowedAttributes: {
      "*": ["style", "class", "align"],
      input: ["type", "checked"],
    },
  });

  return sanitizedHtml.replace(/<h[1-6]>|<\/h[1-6]>/g, (match) => {
    switch (match) {
      case "<h1>":
        return '<p style="font-size: 1.5rem; font-weight: bold; margin: 0;">';
      case "</h1>":
        return "</p>";
      case "<h2>":
        return '<p style="font-size: 1.25rem; font-weight: bold; margin: 0;">';
      case "</h2>":
        return "</p>";
      case "<h3>":
        return '<p style="font-size: 1.1rem; font-weight: bold; margin: 0;">';
      case "</h3>":
        return "</p>";
      case "<h4>":
        return '<p style="font-size: 1rem; font-weight: bold; margin: 0;">';
      case "</h4>":
        return "</p>";
      case "<h5>":
        return '<p style="font-size: 0.9rem; font-weight: bold; margin: 0;">';
      case "</h5>":
        return "</p>";
      case "<h6>":
        return '<p style="font-size: 0.8rem; font-weight: bold; margin: 0;">';
      case "</h6>":
        return "</p>";
      default:
        return match;
    }
  });
};

export function formatLabel(label: string) {
  return label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}
