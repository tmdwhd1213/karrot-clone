"use server";

import db from "@/lib/db";
// import getSession from "@/lib/session";

export async function getComment(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      updated_at: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
      payload: true,
      userId: true,
    },
  });

  return comments;
}
