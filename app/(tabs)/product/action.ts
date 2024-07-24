"use server";

import db from "@/app/lib/db";

const ITEMS_TO_DISPLAY = 1;

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * ITEMS_TO_DISPLAY,
    take: ITEMS_TO_DISPLAY,
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}
