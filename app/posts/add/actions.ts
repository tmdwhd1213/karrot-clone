"use server";

import db from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

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

const productSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
});

export async function uploadPost(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const post = await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.description,
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
      redirect(`/posts/${post.id}`);
    }
  }
}
