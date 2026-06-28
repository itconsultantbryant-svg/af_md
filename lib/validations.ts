import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Valid phone number required").optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const enrollmentSchema = z.object({
  courseId: z.string().min(1),
  organization: z.string().optional(),
  jobTitle: z.string().optional(),
  experience: z.string().optional(),
  motivation: z.string().min(10, "Please tell us why you want to enroll"),
  emergencyContact: z.string().optional(),
  paymentMethod: z.enum([
    "VISA_CARD",
    "MOBILE_MONEY_LONESTAR",
    "MOBILE_MONEY_ORANGE",
    "BANK_TRANSFER",
  ]),
  paymentReference: z.string().optional(),
  paymentProof: z.string().optional(),
});

export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  duration: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  format: z.enum(["Online", "In-Person", "Corporate"]),
  price: z.string().min(1),
  priceAmount: z.number().min(0),
  topics: z.array(z.string()).min(1),
  audiences: z.array(z.string()).min(1),
  seatsTotal: z.number().int().min(0),
  seatsAvailable: z.number().int().min(0),
  published: z.boolean().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  organization: z.string().min(2),
  country: z.string().default("Liberia"),
  industry: z.string().optional(),
  contactPerson: z.string().optional(),
  notes: z.string().optional(),
});

export const contractSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  value: z.number().min(0),
  currency: z.string().default("USD"),
  paymentTerms: z.string().optional(),
  stages: z.array(z.object({ name: z.string(), status: z.string(), dueDate: z.string().optional() })).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});
