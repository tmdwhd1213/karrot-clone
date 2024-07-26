"use server";

import { z } from "zod";
import fs from "fs/promises"; // 비동기로 쓸때 /promise
import db from "@/app/lib/db";
import getSession from "@/app/lib/session";
import { redirect } from "next/navigation";

// 첫번쨰에 formState가 오므로 첫번쨰 param에 임의의 _로 줌.
export async function uploadProduct(_: any, formData: FormData) {
  const productSchema = z.object({
    photo: z.string({
      required_error: "Photo is required!",
    }),
    title: z.string({
      required_error: "Title is required!",
    }),
    price: z.coerce.number({
      required_error: "Price is required!",
    }),
    description: z.string({
      required_error: "Description is required!",
    }),
  });
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }
  // zod.parse() -> try catch로 예외처리해야됨.
  // zode.safeParse() -> 예외처리 필요없고 대신 객체로 {success: false, error: zodError}라는 객체를 반환함.
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    const newProduct = await db.product.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        photo: result.data.photo,
        price: result.data.price,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/product/${newProduct.id}`);
  }
}

// 코드챌린지: 1. 유저가 업로드했는지 확인할 것.
// 2. 이미지 사이즈가 10MB 이하인지 확인할 것.
