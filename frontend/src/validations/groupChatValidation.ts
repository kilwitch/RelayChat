import {z} from "zod";

export const createChatSchema=z
.object({
    title: z.string().min(4, {message:"chat title must be 4 characters long "}).max(191, {message:"chat title must be less tahn 191 characters long "}),
    passcode:z.string().min(4, {message:"chat passcode should be 4 characters long"}).max(25, {message:"chat passcode must be less than 25 characters long "})
}).required()

export type createChatSchemaType=z.infer<typeof createChatSchema>
