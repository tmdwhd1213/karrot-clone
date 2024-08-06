"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { commentSchema } from "./commentSchema";

export async function likePost(postId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function dislikePost(postId: number) {
  const session = await getSession();
  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function createComment(_: any, formData: FormData) {
  const data = {
    payload: formData.get("comment"),
    postId: formData.get("postId"),
  };
  const result = commentSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    try {
      const session = await getSession();
      const { id, updated_at, payload, postId, userId } =
        await db.comment.create({
          data: {
            payload: result.data.payload,
            post: {
              connect: {
                id: +result.data.postId,
              },
            },
            user: {
              connect: {
                id: session.id,
              },
            },
          },
        });
      revalidateTag("post-detail");
      return { id, updated_at, payload, postId, userId };
    } catch (e) {}
  }
}
