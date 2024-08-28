"use server";

import db from "./db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

export async function getProduct(id: number) {
  console.log("Product Hit!!!");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    //include를 사용해서 product의 유저를 포함하여 가져오자.
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
          chat_rooms: true,
        },
      },
      ChatRoom: {
        select: {
          id: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  return product;
}
export const getProductCache = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

export async function getProductTitle(id: number) {
  console.log("Title Hit!!!");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    //include를 사용해서 product의 유저를 포함하여 가져오자.
    select: {
      title: true,
    },
  });
  return product;
}