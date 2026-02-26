import { messages } from "@/core/constants/messages";
import { sharedSchemas } from "@/core/schema";
import z from "zod";
import { allEventLogType } from "./constants";

export const eventLogSchema = z.object({
  id: z.uuidv4(),
  type: z.enum(allEventLogType, { error: messages.invalid("Event type") }),
  data: sharedSchemas.string({ max: 255 }).nullable().default(null),
  createdAt: z.date(),
  entity: z.string().nullable().default(null),
});
