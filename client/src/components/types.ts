import { z } from "zod";

export const createPollSchema = z.object({
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2)
})

export type CreatePollSchema = z.infer<typeof createPollSchema>