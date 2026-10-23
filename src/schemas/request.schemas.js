import { z } from "zod";

const email = z
  .string()
  .trim()
  .email()
  .max(150)
  .transform((value) => value.toLowerCase());

export const signupSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email,
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
});

const priority = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.enum(["low", "medium", "high"]))
  .transform((value) => value[0].toUpperCase() + value.slice(1));

const dueDate = z
  .union([z.iso.datetime(), z.null()])
  .transform((value) => (value === null ? null : new Date(value)));

export const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().nullable().optional(),
  priority: priority.optional(),
  dueDate: dueDate.optional(),
});

export const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
    completed: z.boolean().optional(),
    priority: priority.optional(),
    dueDate: dueDate.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update",
  });

export const todoIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});
