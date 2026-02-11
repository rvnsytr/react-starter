import { messages } from "@/core/constants/messages";
import { sharedSchemas } from "@/core/schema";
import z from "zod";
import { userSchema } from "../auth/schema";
import { allEventLogType } from "./constants";

export const eventLogSchema = z.object({
  id: z.uuidv4(),
  userId: userSchema.shape.id,

  type: z.enum(allEventLogType, { error: messages.invalid("Event type") }),
  entityId: z.uuidv4().nullable().default(null),
  data: sharedSchemas.string("data", { max: 255 }).nullable().default(null),

  createdAt: sharedSchemas.date("createdAt"),
});
