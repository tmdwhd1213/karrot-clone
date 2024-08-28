"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
// import { unstable_cache as nextCache, revalidateTag } from "next/cache";

export async function getReservation() {
  const session = await getSession();
  
  const products = await db.product?.findMany({
    where: {
      buyerUserId: session.id,
      status: "reservation",
    },

    //하나만 가져오기 (1개겠지? 숫자에 따라서 가져옴)

    //건너뛰기 (1개겠지? 숫자에 따라서 건너뜀)
    //오름차순, 내림차순 정렬 적용하기
    orderBy: {
      created_at: "desc",
    },
  });
  console.log("getReservation: ", products);

  return products;
}

// export const getReservationProductCache = nextCache(
//   getReservation,
//   ["product-reservation"],
//   {
//     tags: ["product-reservation"],
//   }
// );