import path from "path";
import z from "zod";




export const loginSchema = z.object({

   email: z.email("Enter Valid Email").nonempty('This Feiled Required'),
   password: z.string().nonempty('This Feiled Required').regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),



})

export type loginSchemaType = z.infer<typeof loginSchema>