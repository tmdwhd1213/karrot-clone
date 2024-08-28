"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
//_:any는 form의 state를 받아오는것 because we are using 'useStateForm'
//formData:FormData 는 원래 form의 데이터를 받아오는 것. form안에 name을 갖고 있는 요소들로부터 가져온 데이터
export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
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
      revalidateTag("product-all");

      redirect(`/products/${product.id}`);
    }
  }

  //   console.log(data);
}

//CloudFlare에 upload url 얻어내기
//Account ID, Token이 필요함
// https://developers.cloudflare.com/images/upload-images/direct-creator-upload/#request-a-one-time-upload-url
export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  return data;
}