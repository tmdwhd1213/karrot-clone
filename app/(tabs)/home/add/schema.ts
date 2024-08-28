import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "photo is requried.",
  }),
  title: z
    .string({
      required_error: "title is requried.",
    })
    .max(20),
  description: z
    .string({
      required_error: "description is requried.",
    })
    .min(5)
    .max(50),
  price: z.coerce.number({
    required_error: "price is requried.",
  }),
});

//modal 시작하기
export type ProductType = z.infer<typeof productSchema>;