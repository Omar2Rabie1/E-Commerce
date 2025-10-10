import path from "path";
import z from "zod";




export const registerSchema = z.object({
   name: z.string().nonempty('This Feiled Required').min(3, "minLenght 3 Chars").max(20, 'maxLenght 20 Chars'),
   email: z.email("Enter Valid Email").nonempty('This Feiled Required'),
   password: z.string().nonempty('This Feiled Required').regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
   rePassword: z.string().nonempty('This Feiled Required'),
   phone: z.string().nonempty('This Feiled Required').regex(/^01[0|1|2|5][0-9]{8}$/)

})
   .refine((object) => object.password === object.rePassword,
      {
         error: "Password And RePassword Doesn`t Match",
         path: ['rePassword']
      }


   )
export type registerSchemaType = z.infer<typeof registerSchema>