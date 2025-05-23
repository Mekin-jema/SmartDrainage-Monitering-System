import { z } from "zod";

export const taskSchema = z.object({
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  location: z.string().min(1, "Location is required"),
  assignedDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  progress: z.number().min(0).max(100).default(0),
  assignedTo: z.string().min(1, "Assigned user is required"),
});
