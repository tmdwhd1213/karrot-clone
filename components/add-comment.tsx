"use client";

import { createComment } from "@/app/posts/[id]/actions";
import CommentButton from "./comment-button";
import { Suspense, useOptimistic } from "react";
import { useFormState } from "react-dom";

interface CommentsProps {
  payload: string;
  id: number;
  userId: number;
  user: {
    username: string;
    avatar: string | null;
  };
}

export default function AddComment({
  id,
  sessionId,
  comments,
  user,
}: {
  id: number;
  sessionId: number;
  comments: CommentsProps[];
  user: { username: string; avatar: string | null };
}) {
  const [optimisticState, reducerFn] = useOptimistic(
    comments,
    (previousComments, payload: CommentsProps) => [...previousComments, payload]
  );

  //여기서 server action을 intercept해서 필요한 작업 수행 (나중에 다시 확인!)
  const interceptAction = async (_: any, formData: FormData) => {
    // formData 이용해서 newComment 생성
    const newComment = {
      payload: formData.get("comment")?.toString()!,
      id,
      userId: sessionId,
      user: {
        created_at: new Date(),
        username: "optimistic",
        avatar: null,
      },
    };

    // optimistic
    reducerFn(newComment);
    formData.append("postId", id + "");
    return createComment(null, formData);
  };
  const [, action] = useFormState(interceptAction, null);

  return (
    <>
      <Suspense
        fallback={<span className="loading loading-bars loading-sm"></span>}
      />
      <form className="flex gap-2 justify-center items-center w-full fixed bottom-2 left-0">
        <input
          className="placeholder:text-neutral-400 bg-neutral-700 rounded-full w-[620px]"
          placeholder="댓글을 입력해주세요."
        />
        <CommentButton />
      </form>
    </>
  );
}
