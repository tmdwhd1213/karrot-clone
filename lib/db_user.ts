"use server";

import { notFound, redirect } from "next/navigation";
import db from "./db";
import getSession from "./session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
export async function getUserInfo() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        username: true,
        email: true,
        id: true,
        avatar: true,
        phone: true,
      },
    });
    console.log("getUser from db");
    return user;
  }
  //session이 없을때 not-found

  notFound();
}

// export const getUserInfo = nextCache(getUser, ["user-detail"], {
//   tags: ["user-detail"],
// });

export async function getReviewsInfo() {
  const session = await getSession();
  const reviews = await db.review.findMany({
    where: {
      product: {
        userId: session.id,
      },
    },

    select: {
      id: true,
      rating: true,
      reviewMessage: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
      product: {
        select: {
          title: true,
        },
      },
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  console.log("getReviews from db");
  return reviews;
}

// export const getReviewsInfo = nextCache(getReviews, ["reviews-detail"], {
//   tags: ["reviews-detail"],
// });

export const logOut = async () => {
  const session = await getSession();
  await session.destroy();
  redirect("/");
};