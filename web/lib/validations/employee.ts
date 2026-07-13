import { z } from "zod";
import { EMPLOYEE_MODELS } from "@/lib/types/employee";

export const createEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  role: z.string().min(1, "Role is required").trim(),
  instructions: z.string().min(1, "Instructions are required").trim(),
  model: z.enum(EMPLOYEE_MODELS, { message: "Please select a model" }),
  temperature: z
    .number({ message: "Temperature is required" })
    .min(0, "Temperature must be at least 0")
    .max(1, "Temperature must be at most 1"),
});

export const updateEmployeeSchema = createEmployeeSchema;

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
